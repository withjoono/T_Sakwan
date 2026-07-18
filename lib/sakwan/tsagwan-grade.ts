/**
 * T사관 2027 모의고사(5회) 채점 — Mogo 백엔드 연결 클라이언트 (프런트 전용)
 *
 * 백엔드가 확정한 계약(2026-07-18):
 *  - 회차 → mockExamId:  GET /api/mock-exams/code/TSK2027R{N}  → data.id
 *      ⚠ 기존 sakwanExamCode(year)=H3YY07 은 기출/분석용. 이 5회 채점에는 TSK2027R{N} 를 써야 한다.
 *  - 채점:  POST /api/mock-exams/grade  — 제출당 4콜
 *      { mockExamId, subject:"국어", answers:[{questionNumber,answer}] }                 // Q1-30
 *      { mockExamId, subject:"영어", answers:[...] }                                       // Q1-30
 *      { mockExamId, subject:"수학", answers:[...] }                                       // Q1-22, subjectDetail 없음
 *      { mockExamId, subject:"수학", subjectDetail:"미적분", answers:[...] }               // Q23-30 (기하/미적분/확률과통계)
 *      · 수학 공통 콜은 응답에 math 전체 행을 반환 → 응답의 totalScore 무시하고
 *        results[].earnedScore 합산으로 계산한다. (syncSaagwanResultToMogo 분할과 동일)
 *      · 선택과목 라벨은 공백 없이: 미적분 | 기하 | 확률과통계
 *  - 취약분석 적재(선택): POST /api/wrong-answers/grade — 같은 4분할, studentId 포함
 *
 * Sakwan 은 프런트 + 이 연결부만 담당한다. 채점 로직/정답 DB 는 Mogo 백엔드 소유. [[mogo-backend-design]]
 */

import { MOGO_API_URL } from "./mogo"

/** 사관 수학 선택과목 — Sakwan 표기(공백 있음) */
export type Elective = "확률과 통계" | "미적분" | "기하"

/** OMR 제출 (한 회차) — 문항번호 → 답(객관식 1~5 / 주관식 정수) */
export interface TsagwanSubmission {
  round: number // 1~5
  elective: Elective
  korean: Record<number, number | null> // 1~30
  english: Record<number, number | null> // 1~30
  math: Record<number, number | null> // 1~30 (1~22 공통, 23~30 선택)
}

export interface GradedQuestion {
  subject: string // "국어" | "영어" | "수학"
  subjectDetail?: string // 수학 선택과목(공백 없음)
  questionNumber: number
  studentAnswer: number | null
  correctAnswer: number
  isCorrect: boolean
  earnedScore: number
}

export interface TsagwanGradeResult {
  round: number
  mockExamId: number
  korean: number
  english: number
  math: number
  total: number // 0~300
  questions: GradedQuestion[] // 전 문항 채점 상세 (오답노트/취약분석용)
  wrong: GradedQuestion[] // 틀린 문항만
}

/* ───────────── 내부 유틸 ───────────── */

function authHeaders(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" }
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("accessToken")
    if (token) h.Authorization = `Bearer ${token}`
  }
  return h
}

/** Mogo 채점용 선택과목 라벨(공백 제거): "확률과 통계" → "확률과통계" */
function electiveForMogo(e: Elective): string {
  return e.replace(/\s+/g, "")
}

/** 회차별 코드 — 백엔드 등록 형식 */
export function tsagwanExamCode(round: number): string {
  return `TSK2027R${round}`
}

const examIdCache = new Map<number, number>()

/** 회차(1~5) → mockExamId. 실패 시 null. */
export async function resolveTsagwanExamId(round: number): Promise<number | null> {
  const cached = examIdCache.get(round)
  if (cached != null) return cached
  try {
    const res = await fetch(`${MOGO_API_URL}/api/mock-exams/code/${tsagwanExamCode(round)}`, {
      headers: authHeaders(),
    })
    if (!res.ok) return null
    const json: unknown = await res.json()
    const id =
      json && typeof json === "object" && "data" in json
        ? (json as { data?: { id?: number } }).data?.id
        : (json as { id?: number } | null)?.id
    if (typeof id !== "number") return null
    examIdCache.set(round, id)
    return id
  } catch {
    return null
  }
}

type AnswerItem = { questionNumber: number; answer: number }

function toAnswers(rec: Record<number, number | null>, from?: number, to?: number): AnswerItem[] {
  return Object.entries(rec)
    .filter(([num, v]) => {
      if (v == null) return false
      const n = Number(num)
      if (from != null && n < from) return false
      if (to != null && n > to) return false
      return true
    })
    .map(([num, v]) => ({ questionNumber: Number(num), answer: v as number }))
}

interface GradeApiResultItem {
  questionNumber: number
  studentAnswer?: number | null
  correctAnswer: number
  isCorrect: boolean
  earnedScore?: number
  score?: number
}
interface GradeApiResponse {
  results?: GradeApiResultItem[]
  totalScore?: number
  earnedScore?: number
}

/** 한 과목(분할) 채점 호출. 실패 시 null. */
async function gradeSubjectCall(
  mockExamId: number,
  subject: string,
  answers: AnswerItem[],
  subjectDetail?: string,
): Promise<GradeApiResultItem[] | null> {
  if (answers.length === 0) return []
  try {
    const res = await fetch(`${MOGO_API_URL}/api/mock-exams/grade`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ mockExamId, subject, subjectDetail, answers }),
    })
    if (!res.ok) return null
    const json: unknown = await res.json()
    const body = (json && typeof json === "object" && "data" in json
      ? (json as { data: GradeApiResponse }).data
      : json) as GradeApiResponse
    return body.results ?? []
  } catch {
    return null
  }
}

/** 제출한 문항만 골라 채점 상세로 매핑(응답이 전체 행을 줄 수 있어 필터) */
function pick(
  results: GradeApiResultItem[],
  submitted: AnswerItem[],
  subject: string,
  subjectDetail: string | undefined,
): GradedQuestion[] {
  const submittedNums = new Set(submitted.map((a) => a.questionNumber))
  const byNum = new Map(results.map((r) => [r.questionNumber, r]))
  return submitted.map((a) => {
    const r = byNum.get(a.questionNumber)
    return {
      subject,
      subjectDetail,
      questionNumber: a.questionNumber,
      studentAnswer: a.answer,
      correctAnswer: r?.correctAnswer ?? 0,
      isCorrect: r?.isCorrect ?? false,
      earnedScore: r?.earnedScore ?? r?.score ?? 0,
    }
  }).filter((q) => submittedNums.has(q.questionNumber))
}

const sum = (qs: GradedQuestion[]) => qs.reduce((acc, q) => acc + (q.earnedScore || 0), 0)

/**
 * 한 회차 OMR 제출을 Mogo 백엔드로 채점. 4분할 호출 → 과목별/총점 합산.
 * 채점 불가(엔드포인트 미배포/네트워크/미등록 회차) 시 null 반환 → 호출부는 폴백 처리.
 */
export async function gradeTsagwanRound(
  submission: TsagwanSubmission,
): Promise<TsagwanGradeResult | null> {
  const mockExamId = await resolveTsagwanExamId(submission.round)
  if (mockExamId == null) return null

  const detail = electiveForMogo(submission.elective)
  const korAns = toAnswers(submission.korean, 1, 30)
  const engAns = toAnswers(submission.english, 1, 30)
  const mathCommon = toAnswers(submission.math, 1, 22)
  const mathElective = toAnswers(submission.math, 23, 30)

  const [kor, eng, mcom, msel] = await Promise.all([
    gradeSubjectCall(mockExamId, "국어", korAns),
    gradeSubjectCall(mockExamId, "영어", engAns),
    gradeSubjectCall(mockExamId, "수학", mathCommon),
    gradeSubjectCall(mockExamId, "수학", mathElective, detail),
  ])

  // 하나라도 실패(null)면 채점 실패로 간주
  if (kor == null || eng == null || mcom == null || msel == null) return null

  const korQ = pick(kor, korAns, "국어", undefined)
  const engQ = pick(eng, engAns, "영어", undefined)
  const mcomQ = pick(mcom, mathCommon, "수학", undefined)
  const mselQ = pick(msel, mathElective, "수학", detail)

  const korean = sum(korQ)
  const english = sum(engQ)
  const math = sum(mcomQ) + sum(mselQ)
  const questions = [...korQ, ...engQ, ...mcomQ, ...mselQ]

  return {
    round: submission.round,
    mockExamId,
    korean,
    english,
    math,
    total: korean + english + math,
    questions,
    wrong: questions.filter((q) => !q.isCorrect),
  }
}

/** SectionResult(스코어링 계약) 호환 구조 — OMR 페이지가 그대로 렌더 */
export interface TsagwanSectionResult {
  name: string
  totalQuestions: number
  correct: number
  attempted: number
  rawScore: number
  detail: { num: number; userAnswer: number | null; correct: number; isCorrect: boolean }[]
}

/**
 * OMR 페이지의 "과목별 채점"용 — 한 과목을 Mogo 백엔드로 채점해 SectionResult로 반환.
 * 수학은 공통(no-detail) + 선택(detail) 2콜을 합쳐 30문항 한 섹션으로 만든다.
 * 실패 시 null (호출부는 로컬 폴백 없이 "채점 불가" 처리).
 */
export async function gradeTsagwanSubject(
  round: number,
  subject: "국어" | "영어" | "수학",
  answers: Record<number, number | null>,
  elective: Elective,
): Promise<TsagwanSectionResult | null> {
  const mockExamId = await resolveTsagwanExamId(round)
  if (mockExamId == null) return null

  let graded: GradedQuestion[]
  if (subject === "수학") {
    const detail = electiveForMogo(elective)
    const common = toAnswers(answers, 1, 22)
    const sel = toAnswers(answers, 23, 30)
    const [c, s] = await Promise.all([
      gradeSubjectCall(mockExamId, "수학", common),
      gradeSubjectCall(mockExamId, "수학", sel, detail),
    ])
    if (c == null || s == null) return null
    graded = [...pick(c, common, "수학", undefined), ...pick(s, sel, "수학", detail)]
  } else {
    const items = toAnswers(answers, 1, 30)
    const r = await gradeSubjectCall(mockExamId, subject, items)
    if (r == null) return null
    graded = pick(r, items, subject, undefined)
  }

  const totalQuestions = subject === "수학" ? 30 : 30
  return {
    name: subject,
    totalQuestions,
    correct: graded.filter((q) => q.isCorrect).length,
    attempted: graded.length,
    rawScore: sum(graded),
    detail: graded.map((q) => ({
      num: q.questionNumber,
      userAnswer: q.studentAnswer,
      correct: q.correctAnswer,
      isCorrect: q.isCorrect,
    })),
  }
}

/**
 * (선택) 취약분석 적재 — 오답노트/취약분석이 Mogo에 쌓이도록 studentId 포함 4분할 전송.
 * 베스트에포트: 실패해도 채점 결과 표시엔 영향 없음.
 */
export async function syncTsagwanWrongAnswers(
  studentId: string | number,
  submission: TsagwanSubmission,
): Promise<void> {
  const mockExamId = await resolveTsagwanExamId(submission.round)
  if (mockExamId == null) return
  const sid = String(studentId)
  const detail = electiveForMogo(submission.elective)

  const post = (subjectAreaName: string, subjectName: string | undefined, answers: AnswerItem[]) => {
    if (answers.length === 0) return Promise.resolve()
    return fetch(`${MOGO_API_URL}/api/wrong-answers/grade`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        studentId: sid,
        mockExamId,
        subjectAreaName,
        subjectName,
        answers: answers.map((a) => ({ questionNumber: a.questionNumber, selectedAnswer: a.answer })),
      }),
    }).catch(() => undefined)
  }

  await Promise.allSettled([
    post("국어", undefined, toAnswers(submission.korean, 1, 30)),
    post("영어", undefined, toAnswers(submission.english, 1, 30)),
    post("수학", undefined, toAnswers(submission.math, 1, 22)),
    post("수학", detail, toAnswers(submission.math, 23, 30)),
  ])
}
