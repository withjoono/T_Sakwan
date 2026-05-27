"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { ANSWER_KEY_AVAILABLE, type Answer, type ElectiveKey } from "@/lib/sakwan/answer-keys"
import { gradeSubmission, type Submission } from "@/lib/sakwan/scoring"
import { saveScore } from "@/lib/sakwan/scores-store"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, Eraser, Save } from "lucide-react"

type Track = "saagwan" | "police"

interface SectionDef {
  name: string
  count: number
  electives?: ElectiveKey[]
  electiveStart?: number  // 사관 수학에서 선택 시작 번호
}

const SAAGWAN_SECTIONS: SectionDef[] = [
  { name: "국어", count: 30 },
  { name: "영어", count: 30 },
  { name: "수학", count: 30, electives: ["확률과 통계", "미적분", "기하"], electiveStart: 23 },
]
const POLICE_SECTIONS: SectionDef[] = [
  { name: "국어", count: 45 },
  { name: "영어", count: 45 },
  { name: "수학", count: 25 },
]

const STORAGE_KEY = "sakwan_omr_draft_v1"

function ExamPageInner() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, isAuthenticated, loginUrl } = useAuth()

  const track = (params.get("track") || "saagwan") as Track
  const year = Number(params.get("year") || new Date().getFullYear())

  const sections = track === "saagwan" ? SAAGWAN_SECTIONS : POLICE_SECTIONS
  const [sectionIdx, setSectionIdx] = useState(0)
  const currentSection = sections[sectionIdx]

  const [elective, setElective] = useState<ElectiveKey>("미적분")
  const [answers, setAnswers] = useState<Record<string, Record<number, Answer | null>>>(() => {
    const init: Record<string, Record<number, Answer | null>> = {}
    sections.forEach((s) => {
      init[s.name] = Object.fromEntries(
        Array.from({ length: s.count }, (_, i) => [i + 1, null]),
      )
    })
    return init
  })
  const [seconds, setSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  /* ─── localStorage 임시저장 / 복원 ─── */
  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(`${STORAGE_KEY}_${track}_${year}`)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed.answers) setAnswers(parsed.answers)
        if (parsed.elective) setElective(parsed.elective)
        if (parsed.seconds) setSeconds(parsed.seconds)
      } catch {
        /* ignore */
      }
    }
  }, [track, year])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(
      `${STORAGE_KEY}_${track}_${year}`,
      JSON.stringify({ answers, elective, seconds }),
    )
  }, [answers, elective, seconds, track, year])

  /* ─── 타이머 ─── */
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = Math.floor(seconds / 3600)
  const mm = Math.floor((seconds % 3600) / 60)
  const ss = seconds % 60
  const timer = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`

  const setAnswer = (sectionName: string, num: number, val: Answer | null) => {
    setAnswers((prev) => ({
      ...prev,
      [sectionName]: { ...prev[sectionName], [num]: val },
    }))
  }

  const progress = useMemo(() => {
    const total = sections.reduce((s, x) => s + x.count, 0)
    const done = sections.reduce(
      (s, x) => s + Object.values(answers[x.name] || {}).filter((v) => v !== null).length,
      0,
    )
    return { total, done, pct: Math.round((done / total) * 100) }
  }, [answers, sections])

  const handleSubmit = async () => {
    if (!user) {
      window.alert("로그인이 필요합니다.")
      window.location.href = loginUrl
      return
    }
    if (!ANSWER_KEY_AVAILABLE[`${track}-${year}`]) {
      const ok = window.confirm(
        `${year}년 정답표가 아직 입력되지 않았습니다 (placeholder만 있음).\n그래도 제출해서 채점 결과를 확인하시겠어요? (실제 점수와 다를 수 있음)`,
      )
      if (!ok) return
    }

    setSubmitting(true)
    try {
      let submission: Submission
      if (track === "saagwan") {
        submission = {
          track: "saagwan",
          year,
          elective,
          korean: answers["국어"],
          english: answers["영어"],
          math: answers["수학"],
        }
      } else {
        submission = {
          track: "police",
          year,
          korean: answers["국어"],
          english: answers["영어"],
          math: answers["수학"],
        }
      }
      const result = gradeSubmission(submission)
      const stored = await saveScore(String(user.id), result)
      // 결과 페이지로 이동 (id로 다시 조회)
      window.localStorage.setItem("sakwan_last_result", JSON.stringify(stored))
      window.localStorage.removeItem(`${STORAGE_KEY}_${track}_${year}`)
      router.push(`/mock/result?id=${encodeURIComponent(stored.id || "")}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "채점 실패"
      window.alert(msg)
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-amber-600" />
          <h1 className="mb-2 text-2xl font-bold">로그인이 필요합니다</h1>
          <p className="mb-6 text-gray-600">응시 결과를 저장하려면 Hub SSO 로그인이 필요해요.</p>
          <a href={loginUrl}>
            <Button className="bg-red-700 text-white hover:bg-red-800">로그인</Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* 상단 진행바 */}
      <div className="sticky top-[60px] z-40 border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/mock" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" /> 종료
            </Link>
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-gray-900">
                {track === "saagwan" ? "🎖 사관" : "👮 경찰대"} {year}년 기출
              </span>
              <span className="text-xs text-gray-500">{progress.done} / {progress.total} 풀이</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-red-700">
              <Clock className="h-4 w-4" /> {timer}
            </div>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-red-600 transition-all" style={{ width: `${progress.pct}%` }} />
          </div>
        </div>
      </div>

      {/* placeholder 경고 */}
      {!ANSWER_KEY_AVAILABLE[`${track}-${year}`] && (
        <div className="container mx-auto max-w-5xl px-4 pt-4">
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
            <div>
              <strong>{year}년 정답표 미입력</strong> — 현재 placeholder(임시값)로 채점됩니다. 실제 점수와 다를 수 있어요.
              정답표 입력 가이드는 README 참조.
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto max-w-5xl px-4 py-6">
        {/* 과목 탭 */}
        <div className="mb-5 flex flex-wrap gap-2 border-b border-gray-200">
          {sections.map((s, i) => {
            const done = Object.values(answers[s.name] || {}).filter((v) => v !== null).length
            return (
              <button
                key={s.name}
                onClick={() => setSectionIdx(i)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
                  sectionIdx === i
                    ? "border-red-600 text-red-700"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {s.name}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">
                  {done}/{s.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* 수학 선택과목 토글 (사관만) */}
        {track === "saagwan" && currentSection.name === "수학" && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 p-3 text-sm">
            <span className="font-bold text-purple-700">선택과목:</span>
            {(["확률과 통계", "미적분", "기하"] as ElectiveKey[]).map((e) => (
              <button
                key={e}
                onClick={() => setElective(e)}
                className={`rounded-lg border-2 px-3 py-1 text-xs font-bold transition-all ${
                  elective === e
                    ? "border-purple-500 bg-white text-purple-700"
                    : "border-transparent bg-white/60 text-gray-600 hover:border-purple-200"
                }`}
              >
                {e}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-purple-700">23-30번이 선택과목 영역</span>
          </div>
        )}

        {/* OMR 그리드 */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{currentSection.name} OMR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: currentSection.count }, (_, i) => i + 1).map((num) => {
                const val = answers[currentSection.name]?.[num] ?? null
                const isElectiveStart = currentSection.electiveStart && num === currentSection.electiveStart
                return (
                  <div
                    key={num}
                    className={`rounded-lg border-2 p-2 ${
                      val !== null ? "border-red-300 bg-red-50/40" : "border-gray-200 bg-white"
                    } ${isElectiveStart ? "ring-2 ring-purple-300" : ""}`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">{num}번</span>
                      <button
                        onClick={() => setAnswer(currentSection.name, num, null)}
                        className="text-[10px] text-gray-400 hover:text-red-600"
                        title="지우기"
                      >
                        <Eraser className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {[1, 2, 3, 4, 5].map((c) => (
                        <button
                          key={c}
                          onClick={() => setAnswer(currentSection.name, num, c)}
                          className={`h-7 w-7 rounded-full text-xs font-bold transition-all ${
                            val === c
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 하단 액션 */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            <Save className="mr-1 inline h-3 w-3" /> 답안은 자동 임시저장됩니다.
          </div>
          <div className="flex gap-2">
            {sectionIdx > 0 && (
              <Button variant="outline" onClick={() => setSectionIdx(sectionIdx - 1)}>
                <ArrowLeft className="mr-1 h-4 w-4" /> 이전 과목
              </Button>
            )}
            {sectionIdx < sections.length - 1 ? (
              <Button className="bg-red-700 text-white hover:bg-red-800" onClick={() => setSectionIdx(sectionIdx + 1)}>
                다음 과목 <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-amber-500 text-white hover:bg-amber-600"
                onClick={handleSubmit}
                disabled={submitting}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                {submitting ? "채점 중..." : "제출하고 채점"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">로딩 중...</div>}>
      <ExamPageInner />
    </Suspense>
  )
}
