"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { loadScores, type StoredScore } from "@/lib/sakwan/scores-store"
import { matchAll, SAAGWAN_AVG, type SchoolKey } from "@/lib/sakwan/cutoffs"
import {
  fetchMogoLatestScore,
  fetchMogoAnalysisSummary,
  isSaagwanExam,
  type MogoStudentScore,
  type MogoAnalysisSummary,
} from "@/lib/sakwan/mogo-analysis"
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react"

/* ───────── 예시(기본) 성적 — 성적이 없거나 미로그인 시 항상 의미있는 화면을 위해 ───────── */
const EXAMPLE_SCORE: StoredScore = {
  userId: "example",
  track: "saagwan",
  year: 2026,
  elective: "미적분",
  totalCorrect: 78,
  totalQuestions: 90,
  totalScore: 262,
  gradedAt: "2026-07-11T10:00:00.000Z",
  createdAt: "2026-07-11T10:00:00.000Z",
  sections: [
    { name: "국어", totalQuestions: 30, correct: 27, attempted: 30, rawScore: 92, detail: [] },
    { name: "영어", totalQuestions: 30, correct: 25, attempted: 30, rawScore: 85, detail: [] },
    { name: "수학", totalQuestions: 30, correct: 26, attempted: 30, rawScore: 85, detail: [] },
  ],
}

/* ───────── 회차 라벨 (createdAt 기준 오래된 순으로 1회부터) ───────── */
function roundLabel(index: number): string {
  return `T사관 모의 ${index + 1}회`
}

/* ───────── 총점(0~300) → 전국 상위 %/백분위 추정 ───────── */
function estimateRank(totalScore: number): { topPercent: number; percentile: number } {
  const ratio = Math.min(1, Math.max(0, totalScore / 300))
  // 만점에 가까울수록 상위권. 단순 추정식(예시).
  const topPercent = Math.min(99, Math.max(1, Math.round((1 - ratio) * 90)))
  return { topPercent, percentile: 100 - topPercent }
}

/* ───────── 정답률 → 색 톤 ───────── */
function accentFor(rate: number): { bar: string; text: string } {
  if (rate >= 0.85) return { bar: "bg-emerald-500", text: "text-emerald-600" }
  if (rate >= 0.7) return { bar: "bg-amber-500", text: "text-amber-600" }
  if (rate >= 0.5) return { bar: "bg-orange-500", text: "text-orange-600" }
  return { bar: "bg-red-500", text: "text-red-600" }
}

const SUBJECT_META: Record<string, { icon: string }> = {
  국어: { icon: "📖" },
  영어: { icon: "🔤" },
  수학: { icon: "📐" },
}

/* ───────── Mogo 실데이터 → 페이지 뷰모델(StoredScore) 매핑 ─────────
 * 원점수(koreanRaw/englishRaw/mathRaw)·총점(totalStandardSum)은 실데이터.
 * 문항별 정답 수는 점수 엔드포인트가 제공하지 않으므로 0으로 둔다(정답률 미표기).
 */
// Mogo의 수학 선택과목 라벨(공백 없음 가능)을 Sakwan ElectiveKey로 정규화
function normalizeElective(sel?: string): StoredScore["elective"] {
  if (!sel) return undefined
  const s = sel.replace(/\s+/g, "")
  if (s === "확률과통계") return "확률과 통계"
  if (s === "미적분") return "미적분"
  if (s === "기하") return "기하"
  return undefined
}

function mogoScoreToStored(s: MogoStudentScore): StoredScore {
  const koreanRaw = Math.round(s.koreanRaw ?? 0)
  const englishRaw = Math.round(s.englishRaw ?? 0)
  const mathRaw = Math.round(s.mathRaw ?? 0)
  const totalScore = Math.round(s.totalStandardSum ?? koreanRaw + englishRaw + mathRaw)
  const when = s.createdAt ?? new Date().toISOString()
  const mkSection = (name: string, rawScore: number) => ({
    name,
    totalQuestions: 0,
    correct: 0,
    attempted: 0,
    rawScore,
    detail: [] as never[],
  })
  return {
    id: `mogo_${s.id}`,
    userId: String(s.studentId),
    track: "saagwan",
    year: s.mockExam?.year ?? new Date().getFullYear(),
    elective: normalizeElective(s.mathSelection),
    totalCorrect: 0,
    totalQuestions: 0,
    totalScore,
    gradedAt: when,
    createdAt: when,
    sections: [
      mkSection("국어", koreanRaw),
      mkSection("영어", englishRaw),
      mkSection("수학", mathRaw),
    ],
  }
}

export default function ScoreAnalysisPage() {
  const { user, isAuthenticated } = useAuth()
  const [scores, setScores] = useState<StoredScore[]>([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  // 데이터 출처: "mogo"(모고 백엔드 실데이터) | "local"(기존 로컬/예시)
  const [dataSource, setDataSource] = useState<"mogo" | "local">("local")
  const [mogoSummary, setMogoSummary] = useState<MogoAnalysisSummary | null>(null)

  useEffect(() => {
    let alive = true
    if (!user?.id) {
      setLoading(false)
      return
    }
    setLoading(true)

    // 로컬/예시 폴백 (기존 동작 그대로)
    const loadLocal = () =>
      loadScores(String(user.id)).then((arr) => {
        if (!alive) return
        setDataSource("local")
        setMogoSummary(null)
        setScores(arr)
        setSelectedIdx(0)
        setLoading(false)
      })

    // 1) 모고 백엔드 실데이터 우선 시도
    void fetchMogoLatestScore(user.id)
      .then(async (score) => {
        if (!alive) return
        // 사관 회차만 채택 (mockExam 정보가 있을 때만 필터, 없으면 그대로 사용)
        const usable = score && (!score.mockExam || isSaagwanExam(score))
        if (!usable || !score) {
          await loadLocal()
          return
        }
        // 실데이터 채택 → 뷰모델로 매핑
        setDataSource("mogo")
        setScores([mogoScoreToStored(score)])
        setSelectedIdx(0)
        setLoading(false)
        // 전국 석차·백분위 보강 (있으면)
        const summary = await fetchMogoAnalysisSummary(score.id)
        if (alive) setMogoSummary(summary)
      })
      .catch(() => {
        if (alive) void loadLocal()
      })

    return () => {
      alive = false
    }
  }, [user?.id])

  // 실제 성적이 없으면 예시 데이터 사용
  const isExample = scores.length === 0
  const list = isExample ? [EXAMPLE_SCORE] : scores
  const idx = Math.min(selectedIdx, list.length - 1)
  const current = list[idx]

  // loadScores는 newest-first → 회차 번호는 오래된 순으로 부여
  const roundName = useMemo(() => {
    if (isExample) return "T사관 모의 1회"
    return roundLabel(list.length - 1 - idx)
  }, [isExample, list.length, idx])

  const isMogo = dataSource === "mogo"
  const totalScore = current.totalScore
  const overallRate = current.totalQuestions > 0 ? current.totalCorrect / current.totalQuestions : 0

  // 전국 석차·백분위: 모고 요약(실측)이 있으면 사용, 없으면 기존 추정식
  const estimated = estimateRank(totalScore)
  const hasRealRank =
    isMogo && mogoSummary?.nationalRank != null && !!mogoSummary?.nationalTotal
  const topPercent = hasRealRank
    ? Math.min(99, Math.max(1, Math.round((mogoSummary!.nationalRank! / mogoSummary!.nationalTotal!) * 100)))
    : estimated.topPercent
  const percentile =
    isMogo && mogoSummary?.percentile != null
      ? Math.round(mogoSummary.percentile)
      : hasRealRank
        ? 100 - topPercent
        : estimated.percentile
  const rankNote = hasRealRank ? "실측" : "추정"

  // 취약 과목(정답률 최저)
  const weakest = useMemo(() => {
    return [...current.sections]
      .map((s) => ({ ...s, rate: s.totalQuestions > 0 ? s.correct / s.totalQuestions : 0 }))
      .sort((a, b) => a.rate - b.rate)[0]
  }, [current])

  // 작년 사관 평균/합격선 매칭 (사관학교만)
  const schoolRows = matchAll(totalScore).filter((m) => m.meta.track === "saagwan")

  const subjectLabel = current.elective ? `수학 · ${current.elective}` : "수학"

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-orange-900 py-16">
        <div className="container relative mx-auto max-w-5xl px-6">
          <Link
            href="/mock"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-orange-200 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> 모의고사 홈
          </Link>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <BarChart3 className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">성적분석</span>
            {isMogo ? (
              <span className="rounded bg-emerald-400/25 px-1.5 py-0.5 text-[10px] font-bold text-emerald-100">
                실데이터 · 모고 연동
              </span>
            ) : isExample ? (
              <span className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-100">예시</span>
            ) : null}
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            내 점수로 보는,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              전국에서 나의 위치.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-orange-100">
            국어·영어·수학 3과목 원점수와 정답률, 전국 석차·백분위(추정), 작년 사관 합격선 비교까지 한 화면에서.
          </p>
        </div>
      </section>

      {/* 회차 선택 */}
      {list.length > 1 && (
        <section className="border-b border-gray-100 bg-white py-8">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1">
              <Trophy className="h-4 w-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-700">회차 선택</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {list.map((s, i) => {
                const label = roundLabel(list.length - 1 - i)
                const on = i === idx
                return (
                  <button
                    key={s.id ?? i}
                    onClick={() => setSelectedIdx(i)}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all ${
                      on
                        ? "border-amber-400 bg-amber-500 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-amber-300"
                    }`}
                  >
                    {label}
                    <span className={`ml-1.5 text-xs font-normal ${on ? "text-amber-100" : "text-gray-400"}`}>
                      {s.totalScore}점
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {loading ? (
        <div className="container mx-auto max-w-5xl px-6 py-20 text-center text-gray-500">
          성적을 불러오는 중...
        </div>
      ) : (
        <>
          {/* 예시(미입력) 안내 — 실제 성적이 없을 때 오인 방지 */}
          {isExample && (
            <section className="border-b border-amber-200 bg-amber-50 py-6">
              <div className="container mx-auto max-w-5xl px-6">
                <div className="flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-white p-5">
                  <span className="text-2xl leading-none">⚠️</span>
                  <div>
                    <div className="text-base font-bold text-amber-800">
                      아직 입력된 정답(응시 성적)이 없습니다
                    </div>
                    <p className="mt-1 text-sm text-amber-700">
                      아래 화면은 실제 성적이 아니라 <strong>예시 데이터</strong>입니다.
                      {isAuthenticated
                        ? " 모의고사에 응시하고 정답을 제출하면 내 실제 성적으로 분석돼요."
                        : " 로그인 후 모의고사에 응시하면 내 실제 성적으로 분석돼요."}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 종합 성적 */}
          <section className="border-b border-gray-100 bg-white py-14">
            <div className="container mx-auto max-w-5xl px-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1">
                <Award className="h-4 w-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-700">종합 성적</span>
              </div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">이번 회차 종합</h2>

              <Card className="border-gray-200 bg-gradient-to-br from-white to-amber-50/40">
                <CardContent className="p-7">
                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {roundName} · 사관 종합
                        {isMogo ? (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">실데이터 · 모고 연동</span>
                        ) : isExample ? (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">예시</span>
                        ) : null}
                      </div>
                      <div className="text-5xl font-black text-amber-600">
                        {totalScore}
                        <span className="text-lg font-bold text-gray-400">/300</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        전체 정답 {current.totalCorrect}/{current.totalQuestions}문항 · 정답률 {Math.round(overallRate * 100)}%
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">전국 석차</div>
                        <div className="text-2xl font-black text-orange-600">상위 {topPercent}%</div>
                        <div className="text-[10px] text-gray-400">{rankNote}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">백분위</div>
                        <div className="text-2xl font-black text-slate-800">{percentile}</div>
                        <div className="text-[10px] text-gray-400">{rankNote}</div>
                      </div>
                    </div>
                  </div>

                  {/* 과목 미니 타일 */}
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {current.sections.map((s) => (
                      <div key={s.name} className="rounded-xl border border-gray-200 p-3 text-center">
                        <div className="text-xl font-black text-amber-600">{Math.round(s.rawScore)}</div>
                        <div className="text-[11px] text-gray-500">
                          {SUBJECT_META[s.name]?.icon ?? ""} {s.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 취약 유형 인사이트 */}
                  {weakest && (
                    <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                      💡
                      <span>
                        취약 과목: <strong>{weakest.name}</strong> (정답률 {Math.round(weakest.rate * 100)}%,{" "}
                        {weakest.correct}/{weakest.totalQuestions}문항). 다음 회차 전 집중 보완을 추천해요.
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 과목별 상세 */}
          <section className="bg-gradient-to-b from-white to-gray-50 py-14">
            <div className="container mx-auto max-w-5xl px-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1">
                <Target className="h-4 w-4 text-orange-700" />
                <span className="text-xs font-bold text-orange-700">과목별 상세</span>
              </div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">국어·영어·수학 과목별 성적</h2>

              <div className="grid gap-4 md:grid-cols-3">
                {current.sections.map((s) => {
                  const rate = s.totalQuestions > 0 ? s.correct / s.totalQuestions : 0
                  const tone = accentFor(rate)
                  return (
                    <Card key={s.name} className="border-2 border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-baseline justify-between text-lg">
                          <span>
                            {SUBJECT_META[s.name]?.icon ?? ""} {s.name === "수학" ? subjectLabel : s.name}
                          </span>
                          <span className="text-2xl font-black text-amber-600">{Math.round(s.rawScore)}</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          원점수 {Math.round(s.rawScore)}점 · 정답 {s.correct}/{s.totalQuestions}문항
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="text-gray-500">정답률</span>
                          <span className={`font-bold ${tone.text}`}>{Math.round(rate * 100)}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${rate * 100}%` }} />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                          <div className="rounded-lg bg-gray-50 p-2">
                            <div className="text-sm font-black text-gray-900">{s.correct}</div>
                            <div className="text-[10px] text-gray-500">정답 수</div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2">
                            <div className="text-sm font-black text-gray-900">
                              {s.totalQuestions - s.correct}
                            </div>
                            <div className="text-[10px] text-gray-500">오답 수</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>

          {/* 과목별 정답률 시각화 */}
          <section className="border-b border-gray-100 bg-white py-14">
            <div className="container mx-auto max-w-5xl px-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1">
                <TrendingUp className="h-4 w-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-700">정답률 비교</span>
              </div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">과목별 정답률 한눈에</h2>

              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-end justify-center gap-10" style={{ height: 260 }}>
                    {current.sections.map((s) => {
                      const rate = s.totalQuestions > 0 ? s.correct / s.totalQuestions : 0
                      const tone = accentFor(rate)
                      return (
                        <div key={s.name} className="flex w-16 flex-col items-center gap-1">
                          <span className={`text-sm font-black ${tone.text}`}>{Math.round(rate * 100)}%</span>
                          <div
                            className={`w-11 rounded-t-lg transition-all ${tone.bar}`}
                            style={{ height: `${Math.max(rate * 200, 8)}px` }}
                          />
                          <span className="mt-1 text-xs font-medium text-gray-700">
                            {SUBJECT_META[s.name]?.icon ?? ""} {s.name}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {s.correct}/{s.totalQuestions}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-emerald-500" /> 85%+
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-amber-500" /> 70~84%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-orange-500" /> 50~69%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded bg-red-500" /> ~49%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 내 점수 vs 작년 사관 평균/합격선 */}
          <section className="bg-gradient-to-b from-gray-50 to-white py-14">
            <div className="container mx-auto max-w-5xl px-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1">
                <BarChart3 className="h-4 w-4 text-orange-700" />
                <span className="text-xs font-bold text-orange-700">합격선 비교</span>
              </div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">내 점수 vs 작년 사관 평균·합격선</h2>

              <Card className="border-gray-200">
                <CardContent className="space-y-6 p-8">
                  {schoolRows.map(({ key, meta, pass, diff, cut }) => {
                    const avg = SAAGWAN_AVG[key as SchoolKey]?.[2025]
                    const myPct = (totalScore / 300) * 100
                    const cutPct = (cut / 300) * 100
                    const avgPct = avg ? (avg / 300) * 100 : null
                    return (
                      <div key={key}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-bold text-gray-900">
                            {meta.icon} {meta.name}{" "}
                            <span className="text-xs text-gray-400">
                              (2025 합격컷 {cut}
                              {avg ? ` · 평균 ${avg}` : ""})
                            </span>
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            }`}
                          >
                            {pass ? `✓ 합격선 +${diff}` : `✗ 합격선 ${diff}`}
                          </span>
                        </div>
                        <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                          <div
                            className={`absolute top-0 h-full ${pass ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${myPct}%` }}
                          />
                          {/* 합격선 마커 */}
                          <div
                            className="absolute top-0 h-full w-[2px] bg-gray-900"
                            style={{ left: `${cutPct}%` }}
                            title={`합격선 ${cut}`}
                          />
                          {/* 작년 평균 마커 */}
                          {avgPct !== null && (
                            <div
                              className="absolute top-0 h-full w-[2px] bg-blue-500"
                              style={{ left: `${avgPct}%` }}
                              title={`작년 평균 ${avg}`}
                            />
                          )}
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                            나 {totalScore}점
                          </span>
                        </div>
                      </div>
                    )
                  })}

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-[3px] bg-gray-900" /> 작년 합격선
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-[3px] bg-blue-500" /> 작년 사관 평균
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <Link href="/mock/past">
                  <Button size="lg" className="bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
                    기출로 실전 채점 다시 하기 <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <p className="mt-3 text-xs text-gray-500">
                    ※ 로그인하면 내 실제 응시 성적으로 분석돼요. (지금은 예시 데이터)
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
