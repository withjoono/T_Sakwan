/**
 * 사관 1차 합불 예측 — mogo-backend 연동
 *
 * 저장·환산·판정은 전부 백엔드(mogo-backend `src/onecha`)가 담당한다.
 * 이 파일은 호출과 익명 ID 관리만 한다.
 *
 * 서버가 계산을 갖는 이유
 *   - 표준점수 환산의 모수(평균·표준편차)가 전체 제출 분포에서 나온다 → 서버만 알 수 있다
 *   - 합격선(컷)을 클라이언트로 내려보내면 노출·조작된다
 *
 * 설계서: 사관_1차_환산점수_예측_설계서.md
 */

import { MOGO_API_URL } from "./mogo"

const BASE = `${MOGO_API_URL}/api/tsagwan/1cha`

const LS_ANON = "onecha_anon_id"
const LS_UNLOCK = "onecha_unlocked"
const LS_LAST = "onecha_last_input_v2"

export type Track = "인문" | "자연"
export type Gender = "남" | "여"
export type MathSelect = "확률과통계" | "미적분" | "기하"

/** 계열별 선택 가능한 수학 과목 (모집요강: 자연계열은 확률과통계 불가) */
export const MATH_SELECT_BY_TRACK: Record<Track, MathSelect[]> = {
  인문: ["확률과통계", "미적분", "기하"],
  자연: ["미적분", "기하"],
}

/** 1차시험 원점수 배점 — 수학 100점은 공통 74 + 선택 26 */
export const RAW_MAX = { kor: 100, eng: 100, mathCommon: 74, mathSelect: 26 } as const

export const SCHOOLS = [
  "육군사관학교",
  "해군사관학교",
  "공군사관학교",
  "국군간호사관학교",
] as const
export type School = (typeof SCHOOLS)[number]

export const SCHOOL_SHORT: Record<School, { short: string; icon: string }> = {
  육군사관학교: { short: "육사", icon: "🟢" },
  해군사관학교: { short: "해사", icon: "🔵" },
  공군사관학교: { short: "공사", icon: "🔷" },
  국군간호사관학교: { short: "국간사", icon: "🏥" },
}

export type OnechaInput = {
  track: Track
  gender: Gender
  targetSchool: School
  korRaw: number
  engRaw: number
  mathComRaw: number
  mathSelName: MathSelect
  mathSelRaw: number
}

export type SchoolVerdict = {
  school: School
  scale: "standard_sum" | "kma_50"
  myScore: number
  scoreMax: number
  cut: number | null
  diff: number | null
  prob: number | null
  segment: "pass" | "borderline" | "risk" | null
  note?: string
}

export type Estimate = {
  year: number
  track: Track
  gender: Gender
  standard: { kor: number; eng: number; math: number; sum: number }
  rawTotal: number
  schools: SchoolVerdict[]
  topPercent: number
  respondents: number
  unitRespondents: number
  confidence: "low" | "medium" | "high"
}

export type SummaryData = {
  year: number
  total: number
  buckets: Record<string, number>
  bucketSize: number
  confidence: string
}

/* ── 익명 ID / 잠금 ─────────────────────────────────────────────── */

export function getAnonId(): string {
  if (typeof window === "undefined") return "ssr"
  let id = window.localStorage.getItem(LS_ANON)
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `anon_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
    window.localStorage.setItem(LS_ANON, id)
  }
  return id
}

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(LS_UNLOCK) === "1"
}

function setUnlocked() {
  if (typeof window !== "undefined") window.localStorage.setItem(LS_UNLOCK, "1")
}

/** 새로고침 후에도 결과를 다시 볼 수 있게 마지막 입력만 로컬 보관 */
export function saveLastInput(input: OnechaInput) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LS_LAST, JSON.stringify(input))
}

export function loadLastInput(): OnechaInput | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(LS_LAST)
  if (!raw) return null
  try {
    return JSON.parse(raw) as OnechaInput
  } catch {
    return null
  }
}

/* ── API ────────────────────────────────────────────────────────── */

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.success) {
    const message =
      (Array.isArray(json?.message) ? json.message[0] : json?.message) ??
      `요청에 실패했습니다 (${res.status})`
    throw new Error(message)
  }
  return json.data as T
}

/** 가채점 제출 → 환산점수 + 학교별 합불 판정 */
export async function submitScores(input: OnechaInput): Promise<Estimate> {
  saveLastInput(input)
  return post<Estimate>("/submissions", { anonId: getAnonId(), ...input })
}

/** 저장 없이 재계산 (입력을 바꿔가며 볼 때) */
export async function estimateScores(input: OnechaInput): Promise<Estimate> {
  return post<Estimate>("/estimate", { anonId: getAnonId(), ...input })
}

/** 모집단위 분포 (히스토그램용) */
export async function fetchSummary(track: Track, gender: Gender): Promise<SummaryData> {
  const params = new URLSearchParams({ track, gender })
  const res = await fetch(`${BASE}/summary?${params}`)
  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.success) {
    return { year: 0, total: 0, buckets: {}, bucketSize: 5, confidence: "low" }
  }
  return json.data as SummaryData
}

export type LeadInput = {
  name: string
  phone: string
  target: School
  segment: string
  consent: boolean
}

/** 상세 결과 게이트 — 연락처 리드 */
export async function submitLead(lead: LeadInput): Promise<void> {
  await post("/leads", { anonId: getAnonId(), source: "1cha", ...lead })
  setUnlocked()
}
