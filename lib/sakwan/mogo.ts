/**
 * Mogo 앱 연동 헬퍼
 *
 * 조회(fetchMogoScores)는 Mogo 운영본을 그대로 활용합니다.
 * 사관 응시 결과 동기화(syncSaagwanResultToMogo)는 mogo-backend에 사관 5개 회차용
 * ExamAnswer/CORS를 추가한 뒤(2026-07-06) 취약분석 연동을 위해 새로 붙인 write 경로입니다.
 * (설계서: Mogo_연동_설계서.md 참조 — 단, 해당 문서의 "Mogo 무수정" 원칙은 이 write 경로로 갱신됨)
 */

import type { SaagwanSubmission } from "./scoring"
import type { Answer } from "./answer-keys"

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

/* ───────────── 사관 응시 결과 → mogo-backend 동기화 (취약분석 연동) ───────────── */

interface GradeAnswerItem {
  questionNumber: number
  selectedAnswer: number
}

const mockExamIdCache = new Map<number, number>()

/** 사관 회차 코드: mogo-backend에 이미 등록된 형식 (H3{연도뒤2자리}07) */
export function sakwanExamCode(year: number): string {
  return `H3${String(year).slice(2)}07`
}

/** DB_import 시트의 수학 선택과목 라벨은 공백이 없다 ("확률과통계") — API 호출 시 정규화 필요 */
function normalizeElectiveForMogo(elective: string): string {
  return elective.replace(/\s+/g, "")
}

async function resolveMockExamId(year: number): Promise<number | null> {
  const cached = mockExamIdCache.get(year)
  if (cached != null) return cached
  try {
    const res = await fetch(`${MOGO_API_URL}/api/mock-exams/code/${sakwanExamCode(year)}`)
    if (!res.ok) return null
    const json: unknown = await res.json()
    const id =
      json && typeof json === "object" && "data" in json
        ? (json as { data?: { id?: number } }).data?.id
        : (json as { id?: number } | null)?.id
    if (typeof id !== "number") return null
    mockExamIdCache.set(year, id)
    return id
  } catch {
    return null
  }
}

function toGradeAnswers(
  rec: Record<number, Answer | null>,
  from?: number,
  to?: number,
): GradeAnswerItem[] {
  return Object.entries(rec)
    .filter(([num, value]) => {
      if (value == null) return false
      const n = Number(num)
      if (from != null && n < from) return false
      if (to != null && n > to) return false
      return true
    })
    .map(([num, value]) => ({ questionNumber: Number(num), selectedAnswer: value as number }))
}

/** 실패해도 throw하지 않음 — 베스트에포트 동기화 */
async function postGrade(
  studentId: string,
  mockExamId: number,
  subjectAreaName: string,
  subjectName: string | undefined,
  answers: GradeAnswerItem[],
): Promise<boolean> {
  if (answers.length === 0) return true
  try {
    const res = await fetch(`${MOGO_API_URL}/api/wrong-answers/grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, mockExamId, subjectAreaName, subjectName, answers }),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * 사관 응시 결과를 mogo-backend StudentAnswer로 적재해 취약분석(H3YY07 MockExam)과 연동합니다.
 *
 * 수학은 공통(1-22, subjectName 없음)과 선택과목(23-30, subjectName=선택과목)을
 * 반드시 별도 호출로 보내야 합니다 — mogo-backend가 subjectAreaName+subjectName을
 * AND 조건으로 정답을 조회하므로 하나로 합치면 공통 문항이 누락됩니다.
 *
 * 베스트에포트: 실패해도 Sakwan 자체 채점/결과 표시에는 영향을 주지 않습니다.
 */
export async function syncSaagwanResultToMogo(
  studentId: string | number,
  submission: SaagwanSubmission,
): Promise<void> {
  const mockExamId = await resolveMockExamId(submission.year)
  if (!mockExamId) return

  const sid = String(studentId)
  const elective = normalizeElectiveForMogo(submission.elective)

  await Promise.allSettled([
    postGrade(sid, mockExamId, "국어", undefined, toGradeAnswers(submission.korean)),
    postGrade(sid, mockExamId, "영어", undefined, toGradeAnswers(submission.english)),
    postGrade(sid, mockExamId, "수학", undefined, toGradeAnswers(submission.math, 1, 22)),
    postGrade(sid, mockExamId, "수학", elective, toGradeAnswers(submission.math, 23, 30)),
  ])
}
