"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { loadScores, type StoredScore } from "@/lib/sakwan/scores-store"
import {
  fetchMogoWrongAnswers,
  isSaagwanExam,
  type MogoWrongAnswer,
} from "@/lib/sakwan/mogo-analysis"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookX,
  CheckCircle2,
  Filter,
  ListChecks,
  XCircle,
} from "lucide-react"

/* ───────────── 타입 ───────────── */
type SubjectFilter = "전체" | "국어" | "영어" | "수학"

interface WrongItem {
  subject: string
  num: number
  userAnswer: number | null
  correct: number
}

const SUBJECTS: SubjectFilter[] = ["전체", "국어", "영어", "수학"]

/* 과목별 뱃지 색상 */
const SUBJECT_TONE: Record<string, string> = {
  국어: "bg-blue-100 text-blue-700",
  영어: "bg-emerald-100 text-emerald-700",
  수학: "bg-purple-100 text-purple-700",
}
const subjectTone = (s: string) => SUBJECT_TONE[s] ?? "bg-gray-100 text-gray-700"

/* 로그인 전 / 응시 기록 없을 때 보여줄 예시 오답 세트 */
const EXAMPLE_SCORE: StoredScore = {
  userId: "example",
  track: "saagwan",
  year: 2026,
  elective: "미적분",
  totalCorrect: 86,
  totalQuestions: 90,
  totalScore: 258,
  gradedAt: "2026-07-11T09:00:00.000Z",
  createdAt: "2026-07-11T09:00:00.000Z",
  sections: [
    {
      name: "국어",
      totalQuestions: 30,
      correct: 29,
      attempted: 30,
      rawScore: 0,
      detail: [{ num: 22, userAnswer: 2, correct: 5, isCorrect: false }],
    },
    {
      name: "영어",
      totalQuestions: 30,
      correct: 29,
      attempted: 30,
      rawScore: 0,
      detail: [{ num: 29, userAnswer: 1, correct: 3, isCorrect: false }],
    },
    {
      name: "수학",
      totalQuestions: 30,
      correct: 28,
      attempted: 29,
      rawScore: 0,
      detail: [
        { num: 16, userAnswer: 3, correct: 18, isCorrect: false },
        { num: 27, userAnswer: null, correct: 4, isCorrect: false },
      ],
    },
  ],
}

/* StoredScore → 오답 목록 추출 */
function extractWrong(score: StoredScore): WrongItem[] {
  const items: WrongItem[] = []
  for (const sec of score.sections) {
    for (const d of sec.detail) {
      if (!d.isCorrect) {
        items.push({ subject: sec.name, num: d.num, userAnswer: d.userAnswer, correct: d.correct })
      }
    }
  }
  return items
}

/* Mogo 오답노트 행을 사관 회차에 한정(메타가 있을 때만) */
function keepMogoRow(r: MogoWrongAnswer): boolean {
  const meta = r as MogoWrongAnswer & { mockExam?: { type?: string; code?: string } }
  return meta.mockExam ? isSaagwanExam(meta) : true
}

/* MogoWrongAnswer[] → 기존 UI가 쓰는 StoredScore[] (회차별 그룹) + 회차 라벨 */
function buildMogoScores(
  userId: string,
  rows: MogoWrongAnswer[],
): { scores: StoredScore[]; labels: string[] } {
  const order = ["국어", "영어", "수학"]
  const groups = new Map<number, MogoWrongAnswer[]>()
  for (const r of rows) {
    if (!groups.has(r.mockExamId)) groups.set(r.mockExamId, [])
    groups.get(r.mockExamId)!.push(r)
  }

  const scores: StoredScore[] = []
  const labels: string[] = []
  for (const [examId, items] of groups) {
    const bySubject = new Map<string, MogoWrongAnswer[]>()
    for (const it of items) {
      if (!bySubject.has(it.subject)) bySubject.set(it.subject, [])
      bySubject.get(it.subject)!.push(it)
    }
    const names = [
      ...order.filter((n) => bySubject.has(n)),
      ...[...bySubject.keys()].filter((n) => !order.includes(n)),
    ]
    const sections = names.map((name) => {
      const list = bySubject.get(name)!
      return {
        name,
        totalQuestions: 0,
        correct: 0,
        attempted: 0,
        rawScore: 0,
        detail: list.map((w) => ({
          num: w.questionNumber,
          userAnswer: w.studentAnswer ?? null, // null = 미응시
          correct: w.correctAnswer,
          isCorrect: false,
        })),
      }
    })
    scores.push({
      id: `mogo_${examId}`,
      userId,
      track: "saagwan",
      year: 0,
      sections,
      totalCorrect: 0,
      totalQuestions: 0,
      totalScore: 0,
      gradedAt: "",
    })
    labels.push(items[0]?.examName ?? `모의고사 ${examId}`)
  }
  return { scores, labels }
}

function trackLabel(track: string) {
  return track === "police" ? "경찰대" : "사관학교"
}

function roundLabel(score: StoredScore) {
  const d = score.gradedAt ? new Date(score.gradedAt) : null
  const date = d && !isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()}` : ""
  const el = score.elective ? ` · ${score.elective}` : ""
  return `${score.year} ${trackLabel(score.track)}${el}${date ? ` · ${date} 채점` : ""}`
}

export default function WrongAnswersPage() {
  const { user, isAuthenticated } = useAuth()

  const [scores, setScores] = useState<StoredScore[]>([])
  const [isExample, setIsExample] = useState(false)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<"mogo" | "local" | "example">("example")
  const [mogoLabels, setMogoLabels] = useState<string[] | null>(null)

  const [selectedIdx, setSelectedIdx] = useState(0)
  const [subject, setSubject] = useState<SubjectFilter>("전체")

  useEffect(() => {
    let alive = true
    if (!user?.id) {
      // 미로그인: 예시 세트로 항상 렌더
      setScores([EXAMPLE_SCORE])
      setIsExample(true)
      setSource("example")
      setMogoLabels(null)
      setLoading(false)
      return
    }
    setLoading(true)
    void (async () => {
      // 1) Mogo 백엔드 오답노트 우선
      const mogoRows = await fetchMogoWrongAnswers(user.id).catch(() => [] as MogoWrongAnswer[])
      if (!alive) return
      const rows = (mogoRows ?? []).filter(keepMogoRow)
      if (rows.length > 0) {
        const built = buildMogoScores(String(user.id), rows)
        setScores(built.scores)
        setMogoLabels(built.labels)
        setIsExample(false)
        setSource("mogo")
        setSelectedIdx(0)
        setLoading(false)
        return
      }
      // 2) 폴백: 기존 로컬 채점 결과 → 없으면 예시 세트 (기존 동작 그대로)
      const arr = await loadScores(String(user.id))
      if (!alive) return
      setMogoLabels(null)
      if (arr.length > 0) {
        setScores(arr)
        setIsExample(false)
        setSource("local")
      } else {
        setScores([EXAMPLE_SCORE])
        setIsExample(true)
        setSource("example")
      }
      setSelectedIdx(0)
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [user?.id])

  const labelFor = (i: number, s: StoredScore) => mogoLabels?.[i] ?? roundLabel(s)

  const current = scores[selectedIdx] ?? scores[0] ?? EXAMPLE_SCORE
  const allWrong = useMemo(() => extractWrong(current), [current])

  // 과목별 오답 수
  const countBySubject = useMemo(() => {
    const m: Record<string, number> = {}
    for (const w of allWrong) m[w.subject] = (m[w.subject] ?? 0) + 1
    return m
  }, [allWrong])

  const filtered = useMemo(
    () => (subject === "전체" ? allWrong : allWrong.filter((w) => w.subject === subject)),
    [allWrong, subject],
  )

  // 과목별 그룹 (표시 순서 고정)
  const grouped = useMemo(() => {
    const order = ["국어", "영어", "수학"]
    const map = new Map<string, WrongItem[]>()
    for (const w of filtered) {
      if (!map.has(w.subject)) map.set(w.subject, [])
      map.get(w.subject)!.push(w)
    }
    return [...map.entries()].sort(
      (a, b) => (order.indexOf(a[0]) + 99) % 99 - ((order.indexOf(b[0]) + 99) % 99),
    )
  }, [filtered])

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-slate-900 py-16">
        <div className="container relative mx-auto max-w-5xl px-6">
          <Link
            href="/mock"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-red-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> 모의고사 홈
          </Link>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <BookX className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">오답노트</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            틀린 문항만 모아,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">
              한눈에 복습.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-red-100">
            T사관에서 채점한 사관·경찰 응시 결과의 오답만 자동으로 모았습니다. 과목별로 내 답과 정답을 비교하며 복습하세요.
          </p>
        </div>
      </section>

      {/* 본문 */}
      <section className="bg-white">
        <div className="container mx-auto max-w-5xl px-6 py-14">
          {loading ? (
            <div className="py-20 text-center text-gray-500">불러오는 중…</div>
          ) : (
            <>
              {/* 안내 배너 */}
              {isExample && (
                <div className="mb-6 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <div>
                    <strong>예시 오답노트</strong>입니다. 실제 기출/모의고사를 응시해 채점하면 내 오답이 여기에 자동으로
                    쌓입니다.
                    {!isAuthenticated && <span className="ml-1">결과 저장에는 로그인이 필요합니다.</span>}
                  </div>
                </div>
              )}

              {/* 회차 선택 */}
              <div className="mb-8">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
                    <ListChecks className="h-4 w-4 text-red-700" />
                    <span className="text-xs font-bold text-red-700">회차 선택</span>
                  </div>
                  {source === "mogo" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      실데이터 · 모고 연동
                    </span>
                  )}
                </div>
                {scores.length > 1 ? (
                  <div className="flex flex-wrap gap-2">
                    {scores.map((s, i) => {
                      const on = i === selectedIdx
                      return (
                        <button
                          key={s.id ?? i}
                          onClick={() => {
                            setSelectedIdx(i)
                            setSubject("전체")
                          }}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all ${
                            on ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-600 hover:border-red-200"
                          }`}
                        >
                          {labelFor(i, s)}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-gray-900">
                    {labelFor(selectedIdx, current)}
                    {isExample && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">예시</span>
                    )}
                  </div>
                )}
              </div>

              {/* 요약 */}
              <Card className="mb-8 border-gray-200">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl bg-red-50 p-4 text-center">
                      <div className="text-3xl font-black text-red-700">{allWrong.length}</div>
                      <div className="mt-1 text-xs font-medium text-gray-500">총 오답 수</div>
                    </div>
                    {(["국어", "영어", "수학"] as const).map((s) => (
                      <div key={s} className="rounded-2xl bg-gray-50 p-4 text-center">
                        <div className="text-3xl font-black text-gray-900">{countBySubject[s] ?? 0}</div>
                        <div className="mt-1 text-xs font-medium text-gray-500">{s} 오답</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 과목 필터 */}
              <div className="mb-5">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-bold text-gray-600">과목 필터</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => {
                    const on = subject === s
                    const cnt = s === "전체" ? allWrong.length : countBySubject[s] ?? 0
                    return (
                      <button
                        key={s}
                        onClick={() => setSubject(s)}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                          on ? "bg-red-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {s} <span className={on ? "text-red-200" : "text-gray-400"}>({cnt})</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 오답 목록 (과목별 그룹) */}
              {filtered.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="py-16 text-center">
                    <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
                    <p className="font-bold text-gray-900">오답이 없습니다!</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {subject === "전체" ? "이 회차는 전 과목 정답입니다." : `${subject} 과목은 전부 맞혔습니다.`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {grouped.map(([subj, items]) => (
                    <div key={subj}>
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-sm font-bold ${subjectTone(subj)}`}>{subj}</span>
                        <span className="text-sm text-gray-500">오답 {items.length}문항</span>
                      </div>
                      <div className="space-y-2">
                        {items.map((w) => {
                          const noAttempt = w.userAnswer === null
                          return (
                            <Card key={`${subj}-${w.num}`} className="border-gray-200">
                              <CardContent className="flex items-center justify-between gap-4 p-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-700">
                                    {w.num}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${subjectTone(subj)}`}>
                                        {subj}
                                      </span>
                                      <span className="text-sm font-semibold text-gray-900">{w.num}번</span>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                      {noAttempt ? "미응시 문항" : "오답 문항"}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="text-center">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-bold ${noAttempt ? "text-gray-400" : "text-red-600"}`}>
                                        {noAttempt ? "미응시" : w.userAnswer}
                                      </span>
                                      <ArrowRight className="h-3.5 w-3.5 text-gray-300" />
                                      <span className="font-bold text-emerald-600">{w.correct}</span>
                                    </div>
                                    <div className="mt-0.5 text-[11px] text-gray-400">내 답 → 정답</div>
                                  </div>
                                  <XCircle className="h-6 w-6 flex-shrink-0 text-red-500" />
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-10 flex flex-col items-center gap-3">
                <Link href="/mock/past">
                  <Button size="lg" className="bg-red-700 px-8 py-6 text-lg font-bold text-white hover:bg-red-800">
                    기출 응시하고 오답 채우기 <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/mock" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                  모의고사 홈으로
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
