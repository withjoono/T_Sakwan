/* ───────── T사관 모의고사 회차별 응시자 코호트 (예상치) ─────────
 * 실응시 데이터가 누적되기 전까지 "같은 회차 N명 중 내 등수 / 합격 예상컷"을
 * 보여주기 위한 표본 분포. 실측이 아니라 **예상치**이며, 화면에는 반드시
 * 예상치 배지와 안내문구를 함께 노출한다(components/cohort-position.tsx).
 *
 * 설계 원칙
 *  1) 결정적(deterministic): 회차 번호를 시드로 쓰는 PRNG → 새로고침·기기와 무관하게
 *     같은 회차면 항상 같은 분포. 등수가 흔들리면 신뢰를 잃는다.
 *  2) 합격컷은 지어내지 않는다: cutoffs.ts 의 실제 작년(2025) 합격선을 그대로 쓴다.
 *  3) 응시자의 2/3 이상이 기준교(육사) 합격권 — 본인이 불합격이어도 성립하도록
 *     본인을 제외한 표본만으로 정원을 채운다(ensurePassQuota).
 *
 * 실응시 데이터가 쌓이면 getRoundCohort()만 백엔드 집계로 교체하면 된다.
 */

import { SAAGWAN_CUTOFFS, SCHOOL_META, type SchoolKey } from "./cutoffs"

/** 합격컷 기준 연도 — cutoffs.ts 에 실 데이터가 있는 최신 연도 */
export const COHORT_YEAR = 2025

/** 합격권 판정 기준교 — 2/3 정원 보장은 이 학교 컷 기준 */
export const REFERENCE_SCHOOL: SchoolKey = "army"

/** 응시자 중 합격권이어야 하는 최소 비율 */
export const MIN_PASS_RATIO = 2 / 3

/* 표본 분포 파라미터 (300점 만점).
 * 사관 준비생 집단이라 일반 수험생보다 상위에 몰린다는 가정.
 * 평균 264 · 표준편차 18 → 육사컷 254 기준 약 71%가 합격권. */
const MEAN = 264
const SD = 18
const MIN_SCORE = 168
const MAX_SCORE = 300

/** 회차별 응시 인원 (본인 포함, 20~30명) */
const COHORT_SIZE: Record<number, number> = { 1: 22, 2: 26, 3: 24, 4: 29, 5: 27 }
const DEFAULT_SIZE = 24

/* ───────── 결정적 난수 ───────── */

/** mulberry32 — 시드 하나로 재현 가능한 난수열 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Box-Muller — 표준정규분포 표본 1개 */
function gauss(rnd: () => number): number {
  const u = Math.max(rnd(), 1e-9)
  const v = rnd()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

/**
 * 합격권 정원 보정 — 컷 미달 표본 중 상위부터 컷 언저리로 끌어올려
 * "응시자 2/3 이상 합격권"을 확정적으로 만족시킨다.
 * quota 는 본인 제외 표본만으로 계산하므로 본인 점수와 무관하게 성립한다.
 */
function ensurePassQuota(scores: number[], cut: number, quota: number, rnd: () => number): void {
  scores.sort((a, b) => b - a)
  let passCount = scores.filter((s) => s >= cut).length
  for (let i = passCount; i < scores.length && passCount < quota; i++) {
    scores[i] = cut + Math.floor(rnd() * 6) // 컷 ~ 컷+5
    passCount++
  }
  scores.sort((a, b) => b - a)
}

/* ───────── 코호트 ───────── */

export interface RoundCohort {
  round: number
  /** 응시 인원 (본인 포함) */
  size: number
  /** 본인을 제외한 응시자 점수 (내림차순) */
  others: number[]
  /** 합격 예상컷 (기준교 실제 작년 합격선) */
  cut: number
  cutSchool: { key: SchoolKey; name: string; short: string; icon: string }
  /** 표본 요약 */
  mean: number
  max: number
  min: number
}

const cache = new Map<number, RoundCohort>()

/** 회차별 응시자 코호트. 같은 회차면 항상 같은 결과. */
export function getRoundCohort(round: number): RoundCohort {
  const cached = cache.get(round)
  if (cached) return cached

  const size = COHORT_SIZE[round] ?? DEFAULT_SIZE
  const cut = SAAGWAN_CUTOFFS[REFERENCE_SCHOOL][COHORT_YEAR]
  const rnd = mulberry32(Math.imul(round || 1, 2654435761))

  const others: number[] = []
  for (let i = 0; i < size - 1; i++) {
    others.push(clamp(Math.round(MEAN + SD * gauss(rnd)), MIN_SCORE, MAX_SCORE))
  }
  // 본인이 불합격이어도 전체의 2/3가 합격권이 되도록 표본만으로 정원을 채운다
  ensurePassQuota(others, cut, Math.ceil(size * MIN_PASS_RATIO), rnd)

  const meta = SCHOOL_META[REFERENCE_SCHOOL]
  const cohort: RoundCohort = {
    round,
    size,
    others,
    cut,
    cutSchool: { key: REFERENCE_SCHOOL, name: meta.name, short: meta.short, icon: meta.icon },
    mean: Math.round(others.reduce((a, b) => a + b, 0) / others.length),
    max: others[0],
    min: others[others.length - 1],
  }
  cache.set(round, cohort)
  return cohort
}

export interface CohortPosition extends RoundCohort {
  myScore: number
  /** 1등부터 */
  rank: number
  /** 상위 몇 % (1~100) */
  topPercent: number
  /** 나를 포함한 합격권 인원 */
  passCount: number
  /** 합격권 비율 (0~100) */
  passRate: number
  /** 내가 합격권인지 */
  iPass: boolean
  /** 합격 예상컷과의 점수차 (+면 상회) */
  diff: number
  /** 점수 구간별 인원 (나 포함) — 미니 히스토그램용 */
  buckets: { from: number; to: number; count: number; mine: boolean }[]
}

const BUCKET_EDGES = [180, 210, 230, 250, 270, 300]

/** 내 점수를 코호트에 넣어 등수·합격권을 계산 */
export function positionInCohort(round: number, myScore: number): CohortPosition {
  const cohort = getRoundCohort(round)
  const { others, cut, size } = cohort

  const rank = others.filter((s) => s > myScore).length + 1
  const passCount = others.filter((s) => s >= cut).length + (myScore >= cut ? 1 : 0)
  const all = [...others, myScore]

  const buckets = BUCKET_EDGES.slice(0, -1).map((from, i) => {
    const to = BUCKET_EDGES[i + 1]
    const last = i === BUCKET_EDGES.length - 2
    const inRange = (s: number) => s >= from && (last ? s <= to : s < to)
    return {
      from,
      to,
      count: all.filter(inRange).length,
      mine: inRange(myScore),
    }
  })

  return {
    ...cohort,
    myScore,
    rank,
    topPercent: clamp(Math.round((rank / size) * 100), 1, 100),
    passCount,
    passRate: Math.round((passCount / size) * 100),
    iPass: myScore >= cut,
    diff: myScore - cut,
    buckets,
  }
}
