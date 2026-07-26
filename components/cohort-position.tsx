"use client"

/* ───────── 회차 내 "내 위치" 카드 (예상치) ─────────
 * 같은 회차 응시자 N명 중 내 등수 · 상위 % · 합격 예상컷 대비 위치.
 * 표본은 lib/sakwan/cohort.ts 의 예상 분포이므로 배지와 안내문구를 항상 함께 노출한다.
 */

import { Card, CardContent } from "@/components/ui/card"
import { positionInCohort } from "@/lib/sakwan/cohort"
import { CheckCircle2, Info, Trophy, Users, XCircle } from "lucide-react"

const COHORT_CUT_NOTE = "2025학년도 실제 1차 합격선"

export default function CohortPosition({ round, score }: { round: number; score: number }) {
  const p = positionInCohort(round, score)
  const maxBucket = Math.max(...p.buckets.map((b) => b.count), 1)

  return (
    <Card className="border-2 border-purple-200">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-700" />
          <h2 className="text-lg font-bold text-gray-900">내 위치</h2>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">예상치</span>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5" /> T사관 모의 {p.round}회 응시 {p.size}명
          </span>
        </div>

        {/* 등수 · 상위 % · 총점 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-xs text-gray-500">내 등수</div>
            <div className="text-2xl font-black text-purple-700">
              {p.rank}
              <span className="ml-0.5 text-sm font-bold text-gray-400">/ {p.size}</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-xs text-gray-500">상위</div>
            <div className="text-2xl font-black text-purple-700">{p.topPercent}%</div>
          </div>
          <div className="rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-xs text-gray-500">내 총점</div>
            <div className="text-2xl font-black text-red-700">
              {p.myScore}
              <span className="ml-0.5 text-sm font-bold text-gray-400">/ 300</span>
            </div>
          </div>
        </div>

        {/* 합격 예상컷 */}
        <div
          className={`mt-4 flex flex-col items-start justify-between gap-2 rounded-xl border p-4 sm:flex-row sm:items-center ${
            p.iPass ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="text-sm">
            <span className="font-bold text-gray-900">
              합격 예상컷 {p.cutSchool.icon} {p.cutSchool.short} {p.cut}점
            </span>
            <span className="ml-2 text-xs text-gray-500">{COHORT_CUT_NOTE}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm font-bold ${
              p.iPass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}
          >
            {p.iPass ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {p.diff >= 0 ? `+${p.diff}점 · 합격권` : `${p.diff}점 · 합격권 미달`}
          </span>
        </div>

        {/* 점수 분포 미니 히스토그램 */}
        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-bold text-gray-500">응시자 점수 분포</span>
            <span className="text-xs text-gray-500">
              합격권 <strong className="text-emerald-700">{p.passCount}명</strong> ({p.passRate}%)
            </span>
          </div>
          <div className="flex items-end gap-1.5">
            {p.buckets.map((b) => (
              <div key={b.from} className="flex flex-1 flex-col items-center gap-1">
                <span className={`text-[10px] font-bold ${b.mine ? "text-purple-700" : "text-gray-400"}`}>
                  {b.count}
                </span>
                <div
                  className={`w-full rounded-t ${b.mine ? "bg-purple-500" : b.from >= p.cut ? "bg-emerald-300" : "bg-gray-200"}`}
                  style={{ height: `${Math.max(4, (b.count / maxBucket) * 56)}px` }}
                />
                <span className="text-[9px] text-gray-400">{b.from}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-400">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm bg-purple-500" /> 내 구간
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm bg-emerald-300" /> 합격권 구간
            </span>
            <span>표본 평균 {p.mean}점 · 최고 {p.max}점</span>
          </div>
        </div>

        {/* 예상치 안내 — 항상 노출 */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
          <span>
            응시자 표본을 기반으로 한 <strong>예상치</strong>입니다. 합격 예상컷은 {COHORT_CUT_NOTE}이며,
            실응시 데이터가 누적되면 실제 집계로 교체됩니다.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
