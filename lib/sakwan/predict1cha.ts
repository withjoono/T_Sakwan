/**
 * 사관 1차 합불 예측 — 표시용 헬퍼
 *
 * 환산·판정 로직은 전부 mogo-backend(`src/onecha`)로 이관했다.
 * 표준점수의 모수(평균·표준편차)가 전체 제출 분포에서 나오므로 클라이언트가 계산할 수 없고,
 * 합격선을 내려보내면 노출되기 때문이다.
 *
 * 이 파일에는 서버 응답을 화면에 그리기 위한 라벨·포맷터만 남긴다.
 * 설계서: 사관_1차_환산점수_예측_설계서.md
 */

import type { SchoolVerdict, SummaryData } from "./onecha-store"

export type Segment = "pass" | "borderline" | "risk"

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export const SEGMENT_META: Record<
  Segment,
  {
    label: string
    emoji: string
    tone: "emerald" | "amber" | "red"
    headline: string
    sub: string
  }
> = {
  pass: {
    label: "합격 예상",
    emoji: "✅",
    tone: "emerald",
    headline: "올해 1차, 합격권입니다",
    sub: "1차는 통과 — 이제 2차 면접에서 갈립니다.",
  },
  borderline: {
    label: "경계선",
    emoji: "⚠️",
    tone: "amber",
    headline: "합격선 위아래, 아직 안 갈렸습니다",
    sub: "몇 점 차이로 뒤집히는 구간 — 2차 준비 여부가 당락을 가릅니다.",
  },
  risk: {
    label: "불합격 위험",
    emoji: "🔴",
    tone: "red",
    headline: "올해 1차 통과는 어려워 보입니다",
    sub: "방향부터 다시 — 지금 시작하면 내년이 바뀝니다.",
  },
}

export const CONFIDENCE_LABEL: Record<string, string> = {
  low: "표본 부족 · 예년 기준 위주",
  medium: "표본 반영 중",
  high: "올해 제출 데이터 충분",
}

/** 척도별 표기 — 육사만 50점 만점 반영 기본점수를 쓴다 */
export const SCALE_LABEL: Record<string, string> = {
  standard_sum: "표준점수 합산",
  kma_50: "반영 기본점수(50점 만점)",
}

/** 소수 자리를 척도에 맞춰 정리 (육사 50점 척도는 소수 셋째 자리까지 반영) */
export function formatScore(value: number, scale: string): string {
  return scale === "kma_50" ? value.toFixed(2) : value.toFixed(1)
}

export function formatDiff(diff: number, scale: string): string {
  const sign = diff >= 0 ? "+" : "−"
  return `${sign}${formatScore(Math.abs(diff), scale)}`
}

/** 지망 학교 판정을 목록에서 골라낸다 */
export function verdictOf(schools: SchoolVerdict[], target: string): SchoolVerdict | undefined {
  return schools.find((s) => s.school === target)
}

export type Bin = { score: number; count: number; isMine: boolean; aboveCut: boolean }

/**
 * 서버 분포 요약을 히스토그램 막대로 변환.
 * 분포는 표준점수 합산 기준이므로, 컷도 표준점수 합산 척도일 때만 합격권 음영을 표시한다.
 */
export function toBins(
  summary: SummaryData,
  myStandardSum: number,
  cut: number | null,
  scale: string,
): Bin[] {
  const size = summary.bucketSize || 5
  const keys = Object.keys(summary.buckets).map(Number)
  const lo = keys.length ? Math.min(...keys, myStandardSum) : myStandardSum - 60
  const hi = keys.length ? Math.max(...keys, myStandardSum) : myStandardSum + 60
  const start = Math.floor((lo - size * 2) / size) * size
  const end = Math.ceil((hi + size * 2) / size) * size
  const myBucket = Math.floor(myStandardSum / size) * size
  const showCut = scale === "standard_sum" && cut !== null

  const bins: Bin[] = []
  for (let s = start; s <= end; s += size) {
    bins.push({
      score: s,
      count: summary.buckets[String(s)] ?? 0,
      isMine: s === myBucket,
      aboveCut: showCut ? s >= (cut as number) : false,
    })
  }
  return bins
}
