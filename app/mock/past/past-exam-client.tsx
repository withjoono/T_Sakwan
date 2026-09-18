"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { matchAll } from "@/lib/sakwan/cutoffs"
import { getExamFormat } from "@/lib/sakwan/exam-format"
import { loadScores } from "@/lib/sakwan/scores-store"
import { ANSWER_KEY_AVAILABLE } from "@/lib/sakwan/answer-keys"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Clock,
  FileText,
  Info,
  ListChecks,
} from "lucide-react"

type ExamTrack = "saagwan" | "police"

const PAST_YEARS = [2026, 2025, 2024, 2023, 2022] as const

const STEPS = [
  { n: 1, title: "문제 풀이", desc: "제공되는 기출 PDF(또는 종이)로 실제 시험처럼 풀이합니다." },
  { n: 2, title: "OMR 입력", desc: "답안만 Sakwan OMR에 마킹. 주관식 숫자입력·선택과목 구간까지 그대로." },
  { n: 3, title: "자동 채점·매칭", desc: "과목별 정답/오답 자동 표기 + 점수 + 작년 합격선 매칭까지 즉시." },
]

export default function PastExamPage() {
  const { user, isAuthenticated } = useAuth()
  const [track, setTrack] = useState<ExamTrack>("saagwan")
  const [year, setYear] = useState<number>(2026)

  const [latestScore, setLatestScore] = useState<number | null>(null)
  const [manualScore] = useState<number>(258)

  useEffect(() => {
    if (!user?.id) return
    void loadScores(String(user.id)).then((arr) => {
      if (arr[0]) setLatestScore(arr[0].totalScore)
    })
  }, [user?.id])

  const myScore = latestScore ?? manualScore
  const keyAvailable = ANSWER_KEY_AVAILABLE[`${track}-${year}`]
  const examFormat = getExamFormat(track)
  const examLink = `/mock/exam?track=${track}&year=${year}`

  const visibleSchools = matchAll(myScore).filter((m) =>
    track === "saagwan" ? m.meta.track === "saagwan" : m.meta.track === "police",
  )

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-slate-900 py-16">
        <div className="container relative mx-auto max-w-5xl px-6">
          <Link href="/mock" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-red-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> 모의고사 홈
          </Link>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <BookOpen className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">역대 기출</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            역대 기출로,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">
              지금 실전 채점.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-red-100">
            2022–2026 사관·경찰 1차 기출을 그대로 OMR 응시 → 자동 채점 → 작년 합격선 매칭까지 한 화면에서.
          </p>
        </div>
      </section>

      {/* STEP 1·2 시험/연도 선택 */}
      <section className="border-b border-gray-100 bg-white py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
            <FileText className="h-4 w-4 text-red-700" />
            <span className="text-xs font-bold text-red-700">STEP 1 · 시험 선택</span>
          </div>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">어떤 시험의 기출을 볼까요?</h2>

          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTrack("saagwan")}
              className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${track === "saagwan" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              🎖 사관학교
            </button>
            <button
              onClick={() => setTrack("police")}
              className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${track === "police" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              👮 경찰대
            </button>
          </div>

          <div className="mt-8 mb-3 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
            <span className="text-xs font-bold text-gray-600">STEP 2 · 연도 선택</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PAST_YEARS.map((y) => {
              const available = ANSWER_KEY_AVAILABLE[`${track}-${y}`]
              const on = year === y
              return (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`rounded-2xl border-2 p-4 text-center transition-all ${
                    on ? "border-red-500 bg-red-50" : "border-gray-200 bg-white hover:border-red-200"
                  }`}
                >
                  <div className="text-2xl font-black text-gray-900">{y}</div>
                  <div className="mt-1 text-[11px] text-gray-500">
                    {available ? "정답표 ✓" : <span className="text-amber-600">정답표 미입력</span>}
                    {y === 2026 ? " · 최신" : ""}
                  </div>
                  {on && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      선택됨
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* 선택 요약 + CTA */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border-2 border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center">
            <div>
              <div className="text-base font-bold text-gray-900">
                {track === "saagwan" ? "🎖 사관학교" : "👮 경찰대"} · {year}년 기출
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-3.5 w-3.5" />
                {track === "saagwan" ? "국어30 · 영어30 · 수학30(공통+선택)" : "국어45 · 영어45 · 수학25"}
              </div>
            </div>
            <Link href={examLink}>
              <Button size="lg" className="bg-red-700 px-8 py-6 text-lg font-bold text-white hover:bg-red-800">
                응시 시작 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          {!keyAvailable && (
            <p className="mt-3 text-xs text-amber-700">
              ⚠ {year}년 정답표 미입력 — 응시는 가능하나 채점은 placeholder 기준(실제 점수와 다를 수 있음)
            </p>
          )}
          {!isAuthenticated && (
            <p className="mt-2 text-xs text-gray-500">※ 응시 결과 저장에는 로그인이 필요합니다</p>
          )}
        </div>
      </section>

      {/* 응시 방식 3단계 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
            <ListChecks className="h-4 w-4 text-red-700" />
            <span className="text-xs font-bold text-red-700">응시 방식</span>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">3단계로 끝나는 실전 채점</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <Card key={s.n} className="border-gray-200">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-700 font-bold text-white">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{s.title}</div>
                    <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 시험 형식 */}
      <section className="border-b border-gray-100 bg-white py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
            <BookOpen className="h-4 w-4 text-blue-700" />
            <span className="text-xs font-bold text-blue-700">
              {track === "saagwan" ? "사관학교" : "경찰대"} 1차 시험 형식
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">시험 구성</h2>
          <p className="mt-2 text-sm text-gray-500">
            {track === "saagwan"
              ? "수능과 다른 사관학교 전용 형식. Sakwan OMR도 이 형식 그대로 구현."
              : "경찰대 1차 형식(확인 중)."}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {examFormat.sections.map((sec) => (
              <Card key={sec.name} className="border-2 border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-baseline justify-between text-lg">
                    <span>{sec.name}</span>
                    <span className="text-2xl font-black text-red-700">{sec.totalQuestions}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    총 {sec.totalQuestions}문항{sec.rawMaxScore ? ` · ${sec.rawMaxScore}점` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sec.parts.map((p, i) => (
                      <li key={i} className="flex items-start justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs">
                        <div>
                          <div className="font-bold text-gray-900">{p.label}</div>
                          {p.note ? <div className="mt-0.5 text-[10px] text-gray-500">{p.note}</div> : null}
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-[11px] text-gray-700">{p.range[0]}–{p.range[1]}</div>
                          <div className="text-[10px] text-gray-500">{p.type}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {sec.electives ? (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <div className="text-[10px] font-bold text-gray-500">선택과목</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {sec.electives.map((e) => (
                          <span key={e} className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">{e}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
            <div>
              <strong>OMR 응시 방식:</strong> 문제지(PDF/종이)를 보면서 Sakwan에서 답안만 입력 → 자동 채점 → 합격선 매칭까지 즉시.
              문제 본문은 별도 제공(추후 PDF 다운로드 예정).
            </div>
          </div>
        </div>
      </section>

      {/* 과거 합격 분석 */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
            <BarChart3 className="h-4 w-4 text-red-700" />
            <span className="text-xs font-bold text-red-700">과거 합격 분석</span>
          </div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">내 점수 vs 작년 합격선</h2>

          <Card className="border-gray-200">
            <CardContent className="space-y-6 p-8">
              {visibleSchools.map(({ key, meta, pass, diff, cut }) => {
                const myPct = (myScore / 300) * 100
                const cutPct = (cut / 300) * 100
                return (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        {meta.icon} {meta.name}{" "}
                        <span className="text-xs text-gray-400">(2025 합격컷 {cut})</span>
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {pass ? `✓ 합격선 +${diff}` : `✗ 합격선 ${diff}`}
                      </span>
                    </div>
                    <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                      <div className={`absolute top-0 h-full ${pass ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${myPct}%` }} />
                      <div className="absolute top-0 h-full w-[2px] bg-gray-900" style={{ left: `${cutPct}%` }} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white">나 {myScore}점</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href={examLink}>
              <Button size="lg" className="bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
                {year}년 기출 응시 시작 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
