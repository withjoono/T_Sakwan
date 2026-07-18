/**
 * 사관 모의고사 분석 — Mogo 백엔드 연결 레이어 (프런트 전용)
 *
 * 설계 원칙 (2026-07-18 확정):
 *  - 사관 모의고사의 채점/분석 로직과 데이터는 전적으로 **Mogo 백엔드**가 소유한다.
 *  - Sakwan 앱은 프런트(UI) + 이 "연결부분"만 담당한다. 백엔드 로직은 mogo-backend에 둔다.
 *  - 따라서 이 파일은 mogo-backend REST 엔드포인트를 호출하는 얇은 클라이언트일 뿐이며,
 *    응답 타입은 mogo-backend가 반환하는 계약(contract)을 그대로 미러링한다.
 *
 * 인증: Hub SSO accessToken (Authorization: Bearer) — [[project-config]] 참고.
 * 안정성: 모든 호출은 실패(CORS/네트워크/미배포) 시 null 또는 빈 값을 반환해 UI를 깨뜨리지 않는다.
 *         (엔드포인트가 아직 사관용으로 열리지 않았을 수 있으므로, 페이지는 항상 예시 폴백을 준비한다.)
 *
 * 엔드포인트 출처: mogo-frontend가 이미 사용하는 mogo-backend API 표면.
 *  - /api/scores/student/:studentId, /api/scores/student/:studentId/latest
 *  - /api/analysis/summary|achievement|combination/:scoreId
 *  - /api/statistics/cumulative|trend/:studentId
 *  - /api/weakness-analysis/student/:studentId/subjects|exams
 *  - /api/wrong-answers/student/:studentId
 *  - /api/targets/:userId
 */

import { MOGO_API_URL } from "./mogo"

/* ───────────── 공통 GET 헬퍼 ───────────── */

function getToken(): string {
  if (typeof window === "undefined") return ""
  return window.localStorage.getItem("accessToken") || ""
}

/**
 * mogo-backend GET 호출. 실패 시 null.
 * 응답이 { data: T } 또는 T(raw) 두 형태 모두 흡수한다.
 */
async function mogoGet<T>(path: string): Promise<T | null> {
  if (typeof window === "undefined") return null
  const token = getToken()
  if (!token) return null
  try {
    const res = await fetch(`${MOGO_API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const json: unknown = await res.json()
    if (json && typeof json === "object" && "data" in json) {
      return (json as { data: T }).data
    }
    return json as T
  } catch {
    return null
  }
}

/* ───────────── 계약 타입 (mogo-backend 응답 미러) ─────────────
 * 사관은 국어·영어·수학 3과목만 사용한다. (탐구/한국사/제2외국어 필드는 사관 미사용)
 */

export interface MogoStudentScore {
  id: number
  studentId: number
  mockExamId: number
  koreanRaw?: number
  koreanStandard?: number
  koreanPercentile?: number
  koreanGrade?: number
  englishRaw?: number
  englishGrade?: number
  mathSelection?: string
  mathRaw?: number
  mathStandard?: number
  mathPercentile?: number
  mathGrade?: number
  totalStandardSum?: number
  totalPercentileSum?: number
  createdAt?: string
  mockExam?: { id: number; name: string; year?: number; month?: number; type?: string; code?: string }
}

/** 성적분석 요약 (/api/analysis/summary/:scoreId) */
export interface MogoAnalysisSummary {
  scoreId: number
  totalStandardSum?: number
  totalPercentileSum?: number
  nationalRank?: number
  nationalTotal?: number
  percentile?: number
  subjects?: Array<{
    subject: string
    raw?: number
    standard?: number
    percentile?: number
    grade?: number
  }>
}

/** 학업성취도/조합 분석 (achievement / combination) — 구조가 유동적이라 느슨하게 */
export type MogoAnalysisAchievement = Record<string, unknown>
export type MogoAnalysisCombination = Record<string, unknown>

/** 누적분석 (/api/statistics/cumulative/:studentId) */
export interface MogoCumulativeStat {
  examCount?: number
  bestTotal?: number
  avgTotal?: number
  recentDelta?: number
  subjectAverages?: Record<string, number>
}

/** 성적 추이 (/api/statistics/trend/:studentId) */
export interface MogoTrendPoint {
  mockExamId: number
  examName?: string
  date?: string
  totalStandardSum?: number
  koreanStandard?: number
  mathStandard?: number
  englishGrade?: number
}

/** 취약분석 — 과목별 (/api/weakness-analysis/student/:studentId/subjects) */
export interface MogoWeaknessSubject {
  subject: string
  subjectDetail?: string
  totalQuestions: number
  correctCount: number
  correctRate: number // 0~100
  weakUnits?: Array<{ unit: string; correctRate: number; count?: number }>
}

/** 오답노트 항목 (/api/wrong-answers/student/:studentId) */
export interface MogoWrongAnswer {
  id: number
  mockExamId: number
  examName?: string
  subject: string
  subjectDetail?: string
  questionNumber: number
  studentAnswer?: number | null
  correctAnswer: number
  unit?: string
  difficulty?: string
  isBookmarked?: boolean
  isReviewed?: boolean
}

/** 지망 대학/학교 (/api/targets/:userId) — 사관은 육/해/공/국간사/경찰 매핑에 활용 */
export interface MogoTarget {
  id: number
  userId: number
  departmentCode?: string
  universityName?: string
  departmentName?: string
}

/* ───────────── 사관 모의고사 필터 ─────────────
 * mogo-backend에서 사관 회차는 code = H3{YY}07 (mogo.ts sakwanExamCode) 형식으로 등록된다.
 * 필요 시 아래 헬퍼로 사관 회차만 걸러낸다.
 */
export function isSaagwanExam(s: { mockExam?: { type?: string; code?: string } }): boolean {
  const type = s.mockExam?.type
  const code = s.mockExam?.code
  return type === "saagwan" || (typeof code === "string" && /^H3\d{2}07$/.test(code))
}

/* ───────────── 연결 함수 (feature별) ───────────── */

/** 학생의 전체 점수 목록 */
export function fetchMogoStudentScores(studentId: string | number) {
  return mogoGet<MogoStudentScore[]>(`/api/scores/student/${studentId}`).then((v) => v ?? [])
}

/** 학생의 최신 점수 1건 */
export function fetchMogoLatestScore(studentId: string | number) {
  return mogoGet<MogoStudentScore>(`/api/scores/student/${studentId}/latest`)
}

/** 성적분석 — 요약 */
export function fetchMogoAnalysisSummary(scoreId: string | number) {
  return mogoGet<MogoAnalysisSummary>(`/api/analysis/summary/${scoreId}`)
}

/** 성적분석 — 학업성취도 */
export function fetchMogoAnalysisAchievement(scoreId: string | number) {
  return mogoGet<MogoAnalysisAchievement>(`/api/analysis/achievement/${scoreId}`)
}

/** 성적분석 — 과목 조합 */
export function fetchMogoAnalysisCombination(scoreId: string | number) {
  return mogoGet<MogoAnalysisCombination>(`/api/analysis/combination/${scoreId}`)
}

/** 누적분석 */
export function fetchMogoCumulative(studentId: string | number) {
  return mogoGet<MogoCumulativeStat>(`/api/statistics/cumulative/${studentId}`)
}

/** 성적 추이 */
export function fetchMogoTrend(studentId: string | number) {
  return mogoGet<MogoTrendPoint[]>(`/api/statistics/trend/${studentId}`).then((v) => v ?? [])
}

/** 취약분석 — 과목별 */
export function fetchMogoWeaknessSubjects(studentId: string | number) {
  return mogoGet<MogoWeaknessSubject[]>(
    `/api/weakness-analysis/student/${studentId}/subjects`,
  ).then((v) => v ?? [])
}

/** 오답노트 */
export function fetchMogoWrongAnswers(studentId: string | number) {
  return mogoGet<MogoWrongAnswer[]>(`/api/wrong-answers/student/${studentId}`).then((v) => v ?? [])
}

/** 지망 학교(타겟) */
export function fetchMogoTargets(userId: string | number) {
  return mogoGet<MogoTarget[]>(`/api/targets/${userId}`).then((v) => v ?? [])
}
