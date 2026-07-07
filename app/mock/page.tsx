"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { matchAll, matchCutoff, SCHOOL_META, type SchoolKey } from "@/lib/sakwan/cutoffs"
import { loadScores } from "@/lib/sakwan/scores-store"
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react"

type ExamTrack = "saagwan" | "police"

const WEAK_TOPICS = [
  { name: "수학 미적분 — 극한", rate: 32 },
  { name: "국어 비문학 — 사회", rate: 41 },
  { name: "수학 선택 — 기하 회전체", rate: 48 },
]

export default function MockHubPage() {
  const [track, setTrack] = useState<ExamTrack>("saagwan")
  const [crossStream, setCrossStream] = useState<"humanities" | "science">("science")
  const [manualScore, setManualScore] = useState<number>(258)
  const { user, isAuthenticated } = useAuth()

  const [latestScore, setLatestScore] = useState<number | null>(null)
  const [latestMeta, setLatestMeta] = useState<{ year: number; track: ExamTrack } | null>(null)

  useEffect(() => {
    if (!user?.id) return
    void loadScores(String(user.id)).then((arr) => {
      if (arr[0]) {
        setLatestScore(arr[0].totalScore)
        setLatestMeta({ year: arr[0].year, track: arr[0].track as ExamTrack })
      }
    })
  }, [user?.id])

  const myScore = latestScore ?? manualScore
  const scoreSource = latestScore !== null ? "exam" : "manual"

  const visibleSchools = matchAll(myScore).filter((m) =>
    track === "saagwan" ? m.meta.track === "saagwan" : m.meta.track === "police",
  )

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-800 via-red-900 to-slate-900 py-16">
        <div className="container relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <Trophy className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">T사관 모의고사</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            응시하고,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">
              바로 합격선까지.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-red-100">
            실제 기출로 실전 채점하거나, T사관이 직접 만든 실전 모의로 전국 석차를 확인하세요. 어떤 걸로 시작할까요?
          </p>
        </div>
      </section>

      {/* 두 갈래 진입 카드 */}
      <section className="bg-white py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* 기출 */}
            <Link href="/mock/past" className="group">
              <div className="relative flex h-full min-h-[210px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 to-red-900 p-7 text-white transition-all group-hover:-translate-y-1 group-hover:shadow-2xl">
                <div>
                  <BookOpen className="mb-3 h-8 w-8 text-red-200" />
                  <div className="text-2xl font-black">기출 모의고사</div>
                  <p className="mt-1.5 max-w-xs text-sm text-red-100">
                    2022–2026 사관·경찰 실제 기출을 OMR로 응시 → 자동 채점 → 작년 합격선 매칭까지 즉시.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-100">지금 응시 가능</span>
                  <span className="flex items-center gap-1 text-sm font-bold">응시하러 가기 <ArrowRight className="h-4 w-4" /></span>
                </div>
              </div>
            </Link>

            {/* T사관 모의 */}
            <Link href="/mock/tsagwan" className="group">
              <div className="relative flex h-full min-h-[210px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-orange-800 p-7 text-white transition-all group-hover:-translate-y-1 group-hover:shadow-2xl">
                <div>
                  <Sparkles className="mb-3 h-8 w-8 text-amber-200" />
                  <div className="text-2xl font-black">T사관 모의고사</div>
                  <p className="mt-1.5 max-w-xs text-sm text-orange-100">
                    T사관이 직접 출제한 신유형 실전 모의. 7월 총 5회, 전국 석차·취약 리포트 제공.
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full bg-amber-400/25 px-3 py-1 text-xs font-bold text-amber-100">D-4 · 1회 7/11</span>
                  <span className="flex items-center gap-1 text-sm font-bold">일정·신청 보기 <ArrowRight className="h-4 w-4" /></span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 트랙 탭 */}
      <section className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mx-auto flex max-w-md rounded-xl bg-white p-1 shadow-sm">
            <button
              onClick={() => setTrack("saagwan")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${track === "saagwan" ? "bg-red-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              사관학교
            </button>
            <button
              onClick={() => setTrack("police")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${track === "police" ? "bg-red-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              경찰대
            </button>
          </div>
        </div>
      </section>

      {/* 점수 스냅샷 */}
      <section className="bg-white py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-1 text-xs font-bold text-gray-500">분석 기준 점수</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-red-700">{myScore}</span>
                    <span className="text-sm font-bold text-gray-500">/ 300점</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        scoreSource === "exam" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {scoreSource === "exam" ? <>실제 응시 ({latestMeta?.year}년)</> : "임시 입력값"}
                    </span>
                  </div>
                  {latestMeta && (
                    <Link href="/mock/result" className="mt-1 inline-block text-xs text-blue-600 hover:underline">
                      최근 결과 자세히 보기 →
                    </Link>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={300}
                    value={manualScore}
                    onChange={(e) => {
                      setManualScore(Number(e.target.value))
                      setLatestScore(null)
                    }}
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <Link href="/mock/past" className="text-xs text-red-600 hover:underline">또는 실제 응시 →</Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 과거 합격 분석 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
              <BarChart3 className="h-4 w-4 text-red-700" />
              <span className="text-xs font-bold text-red-700">과거 합격 분석</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">내 점수 vs 작년 합격선</h2>
          </div>

          <Card className="border-gray-200">
            <CardContent className="space-y-6 p-8">
              {visibleSchools.map(({ key, meta, pass, diff, cut }) => {
                const myPct = (myScore / 300) * 100
                const cutPct = (cut / 300) * 100
                return (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        {meta.icon} {meta.name} <span className="text-xs text-gray-400">(2025 합격컷 {cut})</span>
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
        </div>
      </section>

      {/* 사관 선택 분석 */}
      {track === "saagwan" ? (
        <section className="bg-white py-14">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-8">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                <Target className="h-4 w-4 text-blue-700" />
                <span className="text-xs font-bold text-blue-700">모의지원 — 사관 선택 분석</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">공사·육사·해사, 어디가 유리?</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {(["airforce", "army", "navy"] as SchoolKey[]).map((k) => {
                const m = matchCutoff(myScore, k)
                const prob = clamp(50 + m.diff * 3, 5, 99)
                return (
                  <Card key={k} className="border-2 border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold">{SCHOOL_META[k].icon} {SCHOOL_META[k].short}</span>
                        <span className="text-3xl font-black">{prob}<span className="text-base font-normal text-gray-500">%</span></span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">{m.message}</div>
                      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full ${m.pass ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${prob}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* 교차지원 분석 */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1">
              <TrendingUp className="h-4 w-4 text-purple-700" />
              <span className="text-xs font-bold text-purple-700">교차지원 시뮬레이션</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">문과 ↔ 이과</h2>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">현재 트랙</span>
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button onClick={() => setCrossStream("humanities")} className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${crossStream === "humanities" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500"}`}>문과</button>
                  <button onClick={() => setCrossStream("science")} className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${crossStream === "science" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500"}`}>이과</button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-xs font-semibold text-gray-500">현재 ({crossStream === "science" ? "이과" : "문과"})</div>
                  <div className="my-1 text-3xl font-black text-gray-900">{crossStream === "science" ? "72%" : "58%"}</div>
                </div>
                <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-5">
                  <div className="text-xs font-semibold text-purple-600">전환 시 ({crossStream === "science" ? "문과" : "이과"})</div>
                  <div className="my-1 text-3xl font-black text-purple-700">{crossStream === "science" ? "65%" : "75%"}</div>
                  <div className="text-xs text-purple-600">{crossStream === "science" ? "표준점수 보정 -7%p" : "수학 가산점 +17%p"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 오답·취약 분석 */}
      <section className="bg-white py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">오답·취약 분석</h2>
            <p className="mt-2 text-gray-600">응시 결과 기반 — 데이터 누적 후 자동 분석.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {WEAK_TOPICS.map((t, i) => (
              <Card key={t.name} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="mb-1 text-xs font-bold text-red-600">취약 #{i + 1}</div>
                  <div className="mb-3 text-base font-bold text-gray-900">{t.name}</div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500">정답률</span>
                    <span className="font-bold text-red-700">{t.rate}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${t.rate}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-red-950 py-16 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold text-white">기출 응시는 지금, 모의고사는 7월 5회</h2>
          <p className="mb-8 text-lg text-red-100">Sakwan에서 응시 → 즉시 채점 → 합격선 매칭까지 한 화면.</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/mock/past">
              <Button size="lg" className="rounded-lg bg-red-600 px-8 py-6 text-lg font-bold text-white hover:bg-red-700">
                기출 응시 시작 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/mock/tsagwan">
              <Button size="lg" className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
                T사관 모의 일정 보기 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 shadow-lg">
          <AlertCircle className="mr-1 inline h-3 w-3" /> 응시 결과를 영구 저장하려면 로그인 필요
        </div>
      )}
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
