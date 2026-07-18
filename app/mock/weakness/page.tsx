"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { loadScores, type StoredScore } from "@/lib/sakwan/scores-store"
import {
  fetchMogoWeaknessSubjects,
  type MogoWeaknessSubject,
} from "@/lib/sakwan/mogo-analysis"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Languages,
  Lightbulb,
  Target,
  TrendingDown,
} from "lucide-react"

/* ─────────────────────────── 타입 ─────────────────────────── */
interface SubjectStat {
  name: string
  correct: number
  total: number
  rate: number // 0~100
}

interface MathSplit {
  common: SubjectStat // 공통 1-22
  elective: SubjectStat // 선택 23-30
}

interface WeakTopic {
  subject: string
  name: string
  rate: number
  advice: string
}

/* ─────────────────────────── 예시(폴백) 데이터 ─────────────────────────── */
const EXAMPLE_SUBJECTS: SubjectStat[] = [
  { name: "국어", correct: 28, total: 30, rate: 93 },
  { name: "영어", correct: 26, total: 30, rate: 85 },
  { name: "수학", correct: 23, total: 30, rate: 77 },
]

const EXAMPLE_MATH: MathSplit = {
  common: { name: "수학 공통", correct: 18, total: 22, rate: 82 },
  elective: { name: "수학 선택", correct: 5, total: 8, rate: 60 },
}

// 사관 세부 유형 매핑은 없으므로 큐레이션된 예시 유형 (항상 "예시" 라벨)
const EXAMPLE_WEAK_TOPICS: WeakTopic[] = [
  { subject: "수학", name: "미적분 — 극한", rate: 32, advice: "극한의 정의·좌우극한 개념부터 다시 정리하고 기출 20문항 반복" },
  { subject: "국어", name: "비문학 — 사회", rate: 41, advice: "지문 구조도 그리기 훈련 + 사회/경제 제재 어휘 정리" },
  { subject: "수학", name: "기하 — 회전체", rate: 48, advice: "회전체 단면·부피 공식 암기 후 도형 시각화 연습" },
]

/* ─────────────────────────── 헬퍼 ─────────────────────────── */
// 정답률 색상 티어: green ≥80 / amber 60-79 / red <60
type Tier = "good" | "mid" | "weak"
function tierOf(rate: number): Tier {
  return rate >= 80 ? "good" : rate >= 60 ? "mid" : "weak"
}
const TIER_META: Record<Tier, { bar: string; text: string; soft: string; label: string }> = {
  good: { bar: "bg-emerald-500", text: "text-emerald-600", soft: "bg-emerald-50", label: "안정" },
  mid: { bar: "bg-amber-500", text: "text-amber-600", soft: "bg-amber-50", label: "보완 권장" },
  weak: { bar: "bg-red-500", text: "text-red-600", soft: "bg-red-50", label: "취약" },
}

const SUBJECT_ICON: Record<string, typeof BookOpen> = {
  국어: BookOpen,
  영어: Languages,
  수학: Calculator,
}

/* 여러 회차 응시 결과를 과목별로 누적 집계 */
function aggregate(scores: StoredScore[]): { subjects: SubjectStat[]; math: MathSplit | null } {
  const acc = new Map<string, { correct: number; total: number }>()
  let mathCommonC = 0,
    mathCommonT = 0,
    mathElecC = 0,
    mathElecT = 0

  for (const s of scores) {
    for (const sec of s.sections) {
      const cur = acc.get(sec.name) ?? { correct: 0, total: 0 }
      cur.correct += sec.correct
      cur.total += sec.totalQuestions
      acc.set(sec.name, cur)

      // 수학: 공통(num ≤ 22) vs 선택(num ≥ 23)으로 detail 분리
      if (sec.name === "수학" && Array.isArray(sec.detail)) {
        for (const d of sec.detail) {
          if (d.num <= 22) {
            mathCommonT++
            if (d.isCorrect) mathCommonC++
          } else {
            mathElecT++
            if (d.isCorrect) mathElecC++
          }
        }
      }
    }
  }

  const order = ["국어", "영어", "수학"]
  const subjects: SubjectStat[] = [...acc.entries()]
    .map(([name, v]) => ({
      name,
      correct: v.correct,
      total: v.total,
      rate: v.total ? Math.round((v.correct / v.total) * 100) : 0,
    }))
    .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))

  const math: MathSplit | null =
    mathCommonT + mathElecT > 0
      ? {
          common: {
            name: "수학 공통",
            correct: mathCommonC,
            total: mathCommonT,
            rate: mathCommonT ? Math.round((mathCommonC / mathCommonT) * 100) : 0,
          },
          elective: {
            name: "수학 선택",
            correct: mathElecC,
            total: mathElecT,
            rate: mathElecT ? Math.round((mathElecC / mathElecT) * 100) : 0,
          },
        }
      : null

  return { subjects, math }
}

/* ─────────────────────────── 페이지 ─────────────────────────── */
export default function WeaknessPage() {
  const { user, isAuthenticated } = useAuth()
  const [scores, setScores] = useState<StoredScore[] | null>(null)
  const [mogoSubjects, setMogoSubjects] = useState<MogoWeaknessSubject[] | null>(null)

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    void (async () => {
      // 1) 우선 Mogo 백엔드 취약분석(과목별)을 시도한다.
      const mogo = await fetchMogoWeaknessSubjects(user.id)
      if (cancelled) return
      if (mogo && mogo.length > 0) {
        setMogoSubjects(mogo)
        return
      }
      // 2) 비어있으면 기존 로컬 응시 결과 집계로 폴백.
      const arr = await loadScores(String(user.id))
      if (cancelled) return
      setScores(arr)
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  // Mogo 실데이터 → 로컬 집계 → 예시 폴백
  const { subjects, math, dataSource, examCount } = useMemo(() => {
    // 1) Mogo 취약분석(과목별)이 있으면 PRIMARY.
    if (mogoSubjects && mogoSubjects.length > 0) {
      const order = ["국어", "영어", "수학"]
      const subs: SubjectStat[] = mogoSubjects
        .map((m) => ({
          name: m.subject,
          correct: m.correctCount,
          total: m.totalQuestions,
          rate: Math.round(m.correctRate),
        }))
        .sort((a, b) => {
          const ia = order.indexOf(a.name)
          const ib = order.indexOf(b.name)
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
        })
      // 수학 공통/선택 분리는 Mogo 과목별 계약에 없으므로 해당 섹션은 생략.
      return { subjects: subs, math: null as MathSplit | null, dataSource: "mogo" as const, examCount: 0 }
    }
    // 2) 로컬 응시 결과 집계.
    if (scores && scores.length > 0) {
      const agg = aggregate(scores)
      if (agg.subjects.length > 0) {
        return { subjects: agg.subjects, math: agg.math, dataSource: "local" as const, examCount: scores.length }
      }
    }
    // 3) 예시 폴백.
    return {
      subjects: EXAMPLE_SUBJECTS,
      math: EXAMPLE_MATH as MathSplit | null,
      dataSource: "example" as const,
      examCount: 0,
    }
  }, [mogoSubjects, scores])

  const isExample = dataSource === "example"
  const isMogo = dataSource === "mogo"

  // 취약 유형 TOP: Mogo weakUnits를 과목 전반으로 flatten → 정답률 오름차순.
  // 없으면 큐레이션 예시로 폴백.
  const { weakTopics, weakTopicsAreExample } = useMemo(() => {
    if (isMogo && mogoSubjects) {
      const flat: WeakTopic[] = []
      for (const m of mogoSubjects) {
        for (const u of m.weakUnits ?? []) {
          flat.push({
            subject: m.subject,
            name: u.unit,
            rate: Math.round(u.correctRate),
            advice: `${u.unit} 유형 집중 복습 · 오답 다시 풀이로 정답률 끌어올리기`,
          })
        }
      }
      flat.sort((a, b) => a.rate - b.rate)
      if (flat.length > 0) return { weakTopics: flat, weakTopicsAreExample: false }
    }
    return { weakTopics: EXAMPLE_WEAK_TOPICS, weakTopicsAreExample: true }
  }, [isMogo, mogoSubjects])

  const overall = useMemo(() => {
    const total = subjects.reduce((s, x) => s + x.total, 0)
    const correct = subjects.reduce((s, x) => s + x.correct, 0)
    return {
      total,
      correct,
      rate: total ? Math.round((correct / total) * 100) : 0,
    }
  }, [subjects])

  const weakestSubject = useMemo(
    () => [...subjects].sort((a, b) => a.rate - b.rate)[0],
    [subjects],
  )

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
            <TrendingDown className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">T사관 취약분석</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            내가 약한 곳부터,{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              정확히 짚어드려요.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-orange-100">
            응시 결과를 과목별 정답률로 분해하고, 수학 공통·선택을 나눠 분석합니다. 다음 회차 전 무엇부터 보완할지 알려드려요.
          </p>
          {isExample && (
            <div className="mt-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-orange-100">
                <AlertTriangle className="h-4 w-4 text-amber-300" />
                아직 응시 데이터가 없어 예시 리포트를 보여드려요. 기출을 응시하면 내 데이터로 채워집니다.
              </span>
            </div>
          )}
          {isMogo && (
            <div className="mt-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                실데이터 · 모고 연동
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-6 py-14">
        {/* 취약 요약 */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">취약 요약</h2>
            {isExample && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">예시</span>
            )}
            {isMogo && (
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                실데이터 · 모고 연동
              </span>
            )}
          </div>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* 종합 지표 */}
                <div className="grid grid-cols-3 gap-3 lg:w-1/2">
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <div className="text-2xl font-black text-gray-900">{overall.total}</div>
                    <div className="mt-1 text-xs text-gray-400">전체 문항</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <div className="text-2xl font-black text-emerald-600">{overall.correct}</div>
                    <div className="mt-1 text-xs text-gray-400">정답 수</div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 text-center">
                    <div className={`text-2xl font-black ${TIER_META[tierOf(overall.rate)].text}`}>
                      {overall.rate}%
                    </div>
                    <div className="mt-1 text-xs text-gray-400">전체 정답률</div>
                  </div>
                </div>

                {/* 가장 약한 곳 강조 */}
                <div className="flex flex-col justify-center gap-3 lg:w-1/2">
                  {weakestSubject && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                      <div className="mb-0.5 text-xs font-bold text-red-700">가장 취약한 과목</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-red-600">{weakestSubject.name}</span>
                        <span className="text-sm font-bold text-red-500">정답률 {weakestSubject.rate}%</span>
                      </div>
                      <div className="mt-0.5 text-xs text-red-500/80">
                        {weakestSubject.correct}/{weakestSubject.total} 문항 정답
                      </div>
                    </div>
                  )}
                  {weakTopics[0] && (
                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                      <div className="mb-0.5 flex items-center gap-1.5 text-xs font-bold text-orange-700">
                        가장 취약한 유형
                        {weakTopicsAreExample ? (
                          <span className="rounded bg-orange-100 px-1 py-px text-[9px] font-bold text-orange-600">예시</span>
                        ) : (
                          <span className="rounded bg-emerald-100 px-1 py-px text-[9px] font-bold text-emerald-700">실데이터</span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-orange-600">
                          {weakTopics[0].subject} {weakTopics[0].name}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-orange-500/80">정답률 {weakTopics[0].rate}%</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                {isExample
                  ? "분석 대상: 예시 데이터"
                  : isMogo
                    ? "분석 대상: 모고 취약분석 실데이터"
                    : `분석 대상: 전체 누적 ${examCount}회 응시 기준`}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 과목별 정답률 */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">과목별 정답률</h2>
            <p className="mt-1 text-sm text-gray-500">
              <span className="font-semibold text-emerald-600">80%+</span> 안정 ·{" "}
              <span className="font-semibold text-amber-600">60–79%</span> 보완 ·{" "}
              <span className="font-semibold text-red-600">60% 미만</span> 취약
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {subjects.map((s) => {
              const tier = tierOf(s.rate)
              const meta = TIER_META[tier]
              const Icon = SUBJECT_ICON[s.name] ?? BookOpen
              return (
                <Card key={s.name} className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.soft}`}>
                          <Icon className={`h-5 w-5 ${meta.text}`} />
                        </span>
                        <span className="text-lg font-bold text-gray-900">{s.name}</span>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.soft} ${meta.text}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className={`text-3xl font-black ${meta.text}`}>{s.rate}%</span>
                      <span className="text-xs text-gray-400">
                        {s.correct}/{s.total} 정답
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${s.rate}%` }} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* 수학 공통 vs 선택 */}
        {math && (
          <section className="mb-12">
            <div className="mb-6 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">수학 공통 vs 선택</h2>
            </div>

            <Card className="border-gray-200">
              <CardContent className="space-y-5 p-6">
                {[math.common, math.elective].map((m) => {
                  const tier = tierOf(m.rate)
                  const meta = TIER_META[tier]
                  return (
                    <div key={m.name} className="flex items-center gap-4">
                      <div className="w-20 flex-shrink-0 text-sm font-bold text-gray-700">{m.name}</div>
                      <div className="flex-1">
                        <div className="h-7 w-full overflow-hidden rounded-lg bg-gray-100">
                          <div
                            className={`flex h-full items-center justify-end rounded-lg px-2 ${meta.bar}`}
                            style={{ width: `${Math.max(m.rate, 8)}%` }}
                          >
                            <span className="text-xs font-bold text-white">{m.rate}%</span>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {m.correct}/{m.total} 문항 정답 · {m.name === "수학 공통" ? "1–22번" : "23–30번"}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                  <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                  <span>
                    {math.elective.rate < math.common.rate
                      ? "선택과목 정답률이 공통보다 낮습니다. 선택과목(미적분·기하·확률과 통계) 개념·유형 보완이 우선입니다."
                      : "공통 영역에서 실점이 큽니다. 1–22번 기본 유형의 계산 정확도부터 다지세요."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 취약 유형 TOP */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">취약 유형 TOP</h2>
            {weakTopicsAreExample ? (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">예시</span>
            ) : (
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                실데이터 · 모고 연동
              </span>
            )}
          </div>
          <p className="mb-6 text-sm text-gray-500">
            {weakTopicsAreExample
              ? "사관 기출은 문항별 세부 유형 데이터가 아직 없어, 대표 취약 유형을 예시로 제공합니다. T사관 모의 응시가 쌓이면 실데이터로 대체됩니다."
              : "모고 취약분석에서 집계된 단원별 정답률을 낮은 순으로 보여드립니다."}
          </p>

          <div className="space-y-3">
            {weakTopics.map((t, i) => (
              <Card key={t.name} className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-sm font-black text-red-600">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                          {t.subject}
                        </span>
                        <span className="text-base font-bold text-gray-900">{t.name}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full rounded-full bg-red-500" style={{ width: `${t.rate}%` }} />
                        </div>
                        <span className="w-12 flex-shrink-0 text-right text-sm font-bold text-red-600">{t.rate}%</span>
                      </div>
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-500">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                        <span>{t.advice}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 학습 추천 / 다음 회차 보완 포인트 */}
        <section>
          <Card className="border-none bg-gradient-to-br from-slate-900 to-orange-900 text-white">
            <CardContent className="p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1">
                <Lightbulb className="h-4 w-4 text-amber-200" />
                <span className="text-xs font-bold text-amber-100">다음 회차 보완 포인트</span>
              </div>
              <h2 className="mb-4 text-2xl font-bold">이번 주 학습 추천</h2>
              <ul className="space-y-2.5 text-orange-50">
                {weakestSubject && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300" />
                    <span>
                      가장 약한 <strong className="text-white">{weakestSubject.name}</strong>(정답률{" "}
                      {weakestSubject.rate}%)부터 집중 — 오답 문항 다시 풀이 후 유형 정리
                    </span>
                  </li>
                )}
                {math && math.elective.rate < 70 && (
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300" />
                    <span>
                      수학 <strong className="text-white">선택 영역</strong>(정답률 {math.elective.rate}%) 23–30번 유형 집중 훈련
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300" />
                  <span>
                    취약 유형 <strong className="text-white">{weakTopics[0].subject} {weakTopics[0].name}</strong> —{" "}
                    {weakTopics[0].advice}
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/mock/past">
                  <Button size="lg" className="bg-amber-500 px-6 py-5 font-bold text-white hover:bg-amber-600">
                    기출 다시 응시하기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/mock/tsagwan">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-transparent px-6 py-5 font-bold text-white hover:bg-white/10"
                  >
                    T사관 모의 신청
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {!isAuthenticated && (
          <p className="mt-8 text-center text-xs text-gray-400">
            ※ 로그인하면 실제 응시 결과가 자동으로 취약분석에 반영됩니다.
          </p>
        )}
      </div>
    </div>
  )
}
