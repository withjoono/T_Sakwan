"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import {
  matchAll,
  SAAGWAN_CUTOFFS,
  SAAGWAN_AVG,
  type SchoolKey,
} from "@/lib/sakwan/cutoffs"
import { loadScores } from "@/lib/sakwan/scores-store"
import {
  fetchMogoLatestScore,
  fetchMogoTargets,
  type MogoStudentScore,
  type MogoTarget,
} from "@/lib/sakwan/mogo-analysis"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Info,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"

type ExamTrack = "saagwan" | "police"

const PREDICT_YEAR = 2025

/** 합격 가능성 등급 — 내 점수와 합격컷의 차이(diff)로 판정 */
type Possibility = {
  label: string
  tone: "emerald" | "sky" | "amber" | "red"
  desc: string
}

function possibilityOf(diff: number): Possibility {
  if (diff >= 15) return { label: "안정", tone: "emerald", desc: "합격선을 여유 있게 상회" }
  if (diff >= 0) return { label: "적정", tone: "sky", desc: "합격선 근처 — 무난한 지원권" }
  if (diff >= -10) return { label: "소신", tone: "amber", desc: "합격선 아래 — 소신 지원권" }
  return { label: "위험", tone: "red", desc: "합격선과 격차 큼 — 상향 지원" }
}

const TONE: Record<Possibility["tone"], { badge: string; bar: string; text: string }> = {
  emerald: { badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500", text: "text-emerald-700" },
  sky: { badge: "bg-sky-100 text-sky-700", bar: "bg-sky-500", text: "text-sky-700" },
  amber: { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500", text: "text-amber-700" },
  red: { badge: "bg-red-100 text-red-700", bar: "bg-red-500", text: "text-red-700" },
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function PredictionPage() {
  const { user, isAuthenticated } = useAuth()
  const [track, setTrack] = useState<ExamTrack>("saagwan")
  const [manualScore, setManualScore] = useState<number>(258)
  const [latestScore, setLatestScore] = useState<number | null>(null)
  const [latestYear, setLatestYear] = useState<number | null>(null)
  const [mogoScore, setMogoScore] = useState<number | null>(null)
  const [mogoLinked, setMogoLinked] = useState(false)
  const [targets, setTargets] = useState<MogoTarget[]>([])

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false

    void (async () => {
      // 1) Mogo 백엔드 최신 점수 우선 (연결부분 호출 — 백엔드 로직은 Mogo 소유)
      const mogo: MogoStudentScore | null = await fetchMogoLatestScore(user.id)
      if (!cancelled && mogo) {
        setMogoLinked(true)
        // totalStandardSum 있으면 그 값으로 시드, 없으면 현재 기본값 유지
        if (typeof mogo.totalStandardSum === "number") {
          setMogoScore(mogo.totalStandardSum)
        }
      }

      // 2) Mogo 지망 학교(타겟) — 있으면 카드 강조에 사용
      const t = await fetchMogoTargets(user.id)
      if (!cancelled && t.length > 0) setTargets(t)

      // 3) Mogo 응답이 없으면 기존 로컬 응시 기록으로 폴백 (현재 동작 그대로 유지)
      if (!cancelled && !mogo) {
        const arr = await loadScores(String(user.id))
        if (!cancelled && arr[0]) {
          setLatestScore(arr[0].totalScore)
          setLatestYear(arr[0].year)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  // 지망 학교 → 사관/경찰 SchoolKey 느슨한 매핑 (best-effort, 매칭 없으면 스킵)
  const targetedKeys = new Set<SchoolKey>()
  for (const t of targets) {
    const hay = `${t.universityName ?? ""} ${t.departmentName ?? ""} ${t.departmentCode ?? ""}`
    if (/육군|육사/.test(hay)) targetedKeys.add("army")
    if (/해군|해사/.test(hay)) targetedKeys.add("navy")
    if (/공군|공사/.test(hay)) targetedKeys.add("airforce")
    if (/국군간호|국간사|간호/.test(hay)) targetedKeys.add("nursing")
    if (/경찰/.test(hay)) targetedKeys.add("police")
  }

  const myScore = mogoScore ?? latestScore ?? manualScore
  const scoreSource = mogoLinked ? "mogo" : latestScore !== null ? "exam" : "manual"

  const schools = matchAll(myScore, PREDICT_YEAR).filter((m) =>
    track === "saagwan" ? m.meta.track === "saagwan" : m.meta.track === "police",
  )

  // 요약 카운트
  const summary = schools.reduce(
    (acc, s) => {
      const p = possibilityOf(s.diff)
      acc[p.label] = (acc[p.label] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const updateManual = (v: number) => {
    setManualScore(clamp(v, 0, 300))
    setLatestScore(null)
    setMogoScore(null)
    setMogoLinked(false)
  }

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
            <Target className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">학교별 합격 예측</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            내 점수로,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">
              합격 가능성까지.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-red-100">
            육사·해사·공사·국간사·경찰대 — {PREDICT_YEAR}년 합격선 기준으로 내 점수의 합격 가능성을 학교별로 예측합니다.
          </p>
        </div>
      </section>

      {/* 트랙 토글 */}
      <section className="border-b border-gray-100 bg-gray-50 py-8">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mx-auto flex max-w-md rounded-xl bg-white p-1 shadow-sm">
            <button
              onClick={() => setTrack("saagwan")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${track === "saagwan" ? "bg-red-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              🎖 사관학교
            </button>
            <button
              onClick={() => setTrack("police")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${track === "police" ? "bg-red-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            >
              👮 경찰대
            </button>
          </div>
        </div>
      </section>

      {/* 점수 입력 · 슬라이더 */}
      <section className="bg-white py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
            <Sparkles className="h-4 w-4 text-red-700" />
            <span className="text-xs font-bold text-red-700">STEP 1 · 예측 기준 점수</span>
          </div>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">내 점수를 넣어보세요</h2>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-1 text-xs font-bold text-gray-500">분석 기준 점수</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-red-700">{myScore}</span>
                    <span className="text-sm font-bold text-gray-500">/ 300점</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        scoreSource !== "manual" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {scoreSource === "mogo" ? (
                        "실데이터 (모고 연동)"
                      ) : scoreSource === "exam" ? (
                        <>실제 응시 ({latestYear}년)</>
                      ) : (
                        "예시 · 임시 입력값"
                      )}
                    </span>
                  </div>
                  {scoreSource === "manual" && (
                    <p className="mt-1 text-xs text-gray-400">
                      ※ 실제 응시 기록이 없어 예시 점수(258)로 표시 중 — 아래에서 직접 조정하세요.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={300}
                    value={manualScore}
                    onChange={(e) => updateManual(Number(e.target.value))}
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <span className="text-sm text-gray-400">점</span>
                  <Link href="/mock/past" className="ml-2 text-xs text-red-600 hover:underline">
                    또는 실제 응시 →
                  </Link>
                </div>
              </div>

              {/* 슬라이더 */}
              <div className="mt-6">
                <input
                  type="range"
                  min={0}
                  max={300}
                  step={1}
                  value={myScore}
                  onChange={(e) => updateManual(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-red-700"
                />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>0</span>
                  <span>150</span>
                  <span>300</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 학교별 합격 예측 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
              <BarChart3 className="h-4 w-4 text-red-700" />
              <span className="text-xs font-bold text-red-700">STEP 2 · 학교별 합격 예측</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {track === "saagwan" ? "육·해·공·국간사 합격 가능성" : "경찰대 합격 가능성"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {PREDICT_YEAR}년 합격선 대비 내 점수 위치로 안정·적정·소신·위험을 판정합니다.
            </p>
          </div>

          {/* 요약 배지 */}
          <div className="mb-6 flex flex-wrap gap-2">
            {(["안정", "적정", "소신", "위험"] as const).map((label) => {
              const tone = possibilityOf(
                label === "안정" ? 20 : label === "적정" ? 5 : label === "소신" ? -5 : -20,
              ).tone
              const n = summary[label] ?? 0
              return (
                <span
                  key={label}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${TONE[tone].badge} ${n === 0 ? "opacity-40" : ""}`}
                >
                  {label} {n}개
                </span>
              )
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {schools.map(({ key, meta, pass, diff, cut }) => {
              const p = possibilityOf(diff)
              const tone = TONE[p.tone]
              const avg = SAAGWAN_AVG[key as SchoolKey]?.[PREDICT_YEAR]
              // 바 범위: 합격컷 주변을 잘 보이게 220~300 구간에 매핑
              const LO = 210
              const HI = 300
              const pct = (v: number) => clamp(((v - LO) / (HI - LO)) * 100, 0, 100)
              const myPct = pct(myScore)
              const cutPct = pct(cut)
              // 확률 근사치 (Mogo probability bar 재현)
              const prob = clamp(50 + diff * 3, 3, 99)
              return (
                <Card
                  key={key}
                  className={`border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${
                    targetedKeys.has(key as SchoolKey)
                      ? "border-red-400 ring-1 ring-red-200"
                      : "border-gray-200"
                  }`}
                >
                  <CardContent className="p-6">
                    {/* 헤더 */}
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {meta.icon} {meta.name}
                          {targetedKeys.has(key as SchoolKey) && (
                            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 align-middle text-[10px] font-bold text-red-700">
                              🎯 지망
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          {PREDICT_YEAR} 합격컷 {cut}점
                          {avg ? ` · 평균 ${avg}점` : ""}
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone.badge}`}>
                        {p.label}
                      </span>
                    </div>

                    {/* 확률 */}
                    <div className="mb-3 flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-gray-500">합격 가능성</span>
                      <span className={`text-3xl font-black ${tone.text}`}>
                        {prob}
                        <span className="text-base font-normal text-gray-400">%</span>
                      </span>
                    </div>

                    {/* 내 점수 vs 합격컷 막대 (컷 마커) */}
                    <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                      <div
                        className={`absolute top-0 h-full ${pass ? "bg-emerald-500" : tone.bar}`}
                        style={{ width: `${myPct}%` }}
                      />
                      {/* 합격컷 마커 */}
                      <div
                        className="absolute top-0 h-full w-[2px] bg-gray-900"
                        style={{ left: `${cutPct}%` }}
                      />
                      <span
                        className="absolute -top-0.5 text-[9px] font-bold text-gray-900"
                        style={{ left: `calc(${cutPct}% + 3px)` }}
                      >
                        컷 {cut}
                      </span>
                      <span className="absolute bottom-0.5 right-2 text-xs font-bold text-white">
                        나 {myScore}점
                      </span>
                    </div>

                    {/* 합격/불합격 + diff */}
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                      >
                        {pass ? `✓ 합격 예상 +${diff}점` : `✗ 합격선 ${diff}점`}
                      </span>
                      <span className="text-xs text-gray-500">{p.desc}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* 추세: 최근 합격선 흐름 (경찰 트랙에도 노출) */}
          <div className="mt-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
              <TrendingUp className="h-4 w-4 text-blue-700" />
              <span className="text-xs font-bold text-blue-700">최근 5개년 합격선 추이</span>
            </div>
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {schools.map(({ key, meta }) => {
                    const years = [2021, 2022, 2023, 2024, 2025]
                    const cuts = years.map((y) => SAAGWAN_CUTOFFS[key as SchoolKey][y])
                    const min = Math.min(...cuts)
                    const max = Math.max(...cuts)
                    const span = Math.max(1, max - min)
                    return (
                      <div key={key} className="flex items-center gap-4">
                        <div className="w-20 shrink-0 text-sm font-bold text-gray-700">
                          {meta.icon} {meta.short}
                        </div>
                        <div className="flex flex-1 items-end gap-2">
                          {years.map((y, i) => {
                            const h = 20 + ((cuts[i] - min) / span) * 40
                            const isLast = i === years.length - 1
                            return (
                              <div key={y} className="flex flex-1 flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-600">{cuts[i]}</span>
                                <div
                                  className={`w-full rounded-t ${isLast ? "bg-red-600" : "bg-gray-300"}`}
                                  style={{ height: `${h}px` }}
                                />
                                <span className="text-[10px] text-gray-400">{y}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 안내 */}
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-700" />
            <div>
              <strong>예측 기준:</strong> 1차 필기 표준점수 합(300점 만점) 기준. 합격 가능성은{" "}
              <b>+15↑ 안정 · 0~+15 적정 · -10~0 소신 · -10↓ 위험</b>으로 판정합니다. 실제 합격에는 2차(체력·면접·신검)와
              내신·수능 최저 등이 반영됩니다.
            </div>
          </div>

          {!isAuthenticated && (
            <p className="mt-3 text-xs text-gray-500">
              ※ 실제 응시 점수로 예측하려면 로그인 후 기출 응시가 필요합니다.
            </p>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/mock/past">
              <Button size="lg" className="bg-red-700 px-8 py-6 text-lg font-bold text-white hover:bg-red-800">
                기출로 실제 점수 만들기 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/mock">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-red-200 px-8 py-6 text-lg font-bold text-red-700 hover:bg-red-50"
              >
                모의고사 홈으로
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
