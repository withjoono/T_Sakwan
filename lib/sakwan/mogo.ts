/**
 * Mogo 앱 연동 헬퍼
 *
 * Mogo 운영본은 수정하지 않고, 기존 deep-link / API만 활용합니다.
 * (설계서: Mogo_연동_설계서.md 참조)
 */

export const MOGO_URL = process.env.NEXT_PUBLIC_MOGO_URL || "https://mogomogo.kr"
export const MOGO_API_URL =
  process.env.NEXT_PUBLIC_MOGO_API_URL ||
  "https://mogo-backend-dot-ts-back-nest-479305.du.r.appspot.com"

export type Grade = "고1" | "고2" | "고3"

/**
 * Mogo의 모의고사 입력 폼으로 진입하는 deep-link 생성.
 *
 * 사용 예:
 *   buildMogoInputLink({ year: 2026, grade: '고3', month: 5 })
 *   → https://mogomogo.kr/main/input/form?year=2026&grade=고3&month=5
 *
 * 사관·경찰 회차가 Mogo에 별도로 추가되기 전까지는, 가장 가까운 일반 모의고사로 진입합니다.
 * Phase 3에서 Mogo에 type=saagwan 지원이 추가되면 type 파라미터를 옵션으로 붙일 수 있습니다.
 */
export function buildMogoInputLink(opts: {
  year?: number
  grade?: Grade
  month?: number
  type?: "saagwan" | "police"
}) {
  const now = new Date()
  const year = opts.year ?? now.getFullYear()
  const grade = opts.grade ?? "고3"
  const month = opts.month ?? now.getMonth() + 1

  const params = new URLSearchParams({
    year: String(year),
    grade,
    month: String(month),
  })
  if (opts.type) params.set("type", opts.type)

  return `${MOGO_URL}/main/input/form?${params.toString()}`
}

/**
 * Mogo 점수 분석 페이지 deep-link
 */
export function buildMogoAnalysisLink() {
  return `${MOGO_URL}/main/score-analysis`
}

/* ───────────── API 호출 ───────────── */

export interface MogoScoreRecord {
  id: number
  studentId: number
  mockExamId: number
  mockExam?: { id: number; name: string; year?: number; month?: number; type?: string }
  totalStandardSum?: number
  koreanStandard?: number
  mathStandard?: number
  englishGrade?: number
  createdAt?: string
}

/**
 * mogo-backend에서 학생의 점수 목록을 가져옵니다.
 *
 * 인증: Hub SSO accessToken 사용 (Authorization: Bearer)
 * 실패 시 빈 배열 반환 (UI를 깨뜨리지 않음 — CORS 차단 등 모든 케이스 흡수)
 */
export async function fetchMogoScores(studentId: string | number): Promise<MogoScoreRecord[]> {
  if (typeof window === "undefined") return []
  const token = window.localStorage.getItem("accessToken") || ""
  if (!token) return []

  try {
    const res = await fetch(`${MOGO_API_URL}/api/scores/student/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return []
    const json: unknown = await res.json()
    // API 응답이 { data: [...] } 또는 [...] 두 형태 모두 흡수
    if (Array.isArray(json)) return json as MogoScoreRecord[]
    if (json && typeof json === "object" && "data" in json) {
      const data = (json as { data: unknown }).data
      if (Array.isArray(data)) return data as MogoScoreRecord[]
    }
    return []
  } catch {
    return []
  }
}
