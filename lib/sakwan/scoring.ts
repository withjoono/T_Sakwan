/**
 * 채점 로직 — 사관·경찰 OMR 응시 결과 채점
 */

import {
  SAAGWAN_ANSWER_KEYS,
  SAAGWAN_SCORE_KEYS,
  POLICE_ANSWER_KEYS,
  SCORING_RULES,
  type Answer,
  type ElectiveKey,
} from "./answer-keys"

export type Track = "saagwan" | "police"

/** 사관 응시 답안 */
export interface SaagwanSubmission {
  track: "saagwan"
  year: number
  elective: ElectiveKey
  korean: Record<number, Answer | null>    // 1-30
  english: Record<number, Answer | null>   // 1-30
  math: Record<number, Answer | null>      // 1-30 (1-22 공통, 23-30 선택)
}

/** 경찰대 응시 답안 */
export interface PoliceSubmission {
  track: "police"
  year: number
  korean: Record<number, Answer | null>    // 1-45
  english: Record<number, Answer | null>   // 1-45
  math: Record<number, Answer | null>      // 1-25
}

export type Submission = SaagwanSubmission | PoliceSubmission

export interface SectionResult {
  name: string
  totalQuestions: number
  correct: number
  attempted: number
  rawScore: number
  detail: { num: number; userAnswer: Answer | null; correct: Answer; isCorrect: boolean }[]
}

export interface GradingResult {
  track: Track
  year: number
  /** T사관 모의고사 회차(1~5). 기출 응시엔 없음 — 회차 내 등수 산출에 사용 */
  round?: number
  elective?: ElectiveKey
  sections: SectionResult[]
  totalCorrect: number
  totalQuestions: number
  totalScore: number     // 0~300 (3과목 × 100점 가정)
  gradedAt: string       // ISO
}

function gradeSection(
  name: string,
  userAns: Record<number, Answer | null>,
  correctAns: Record<number, Answer>,
  /**
   * 배점 결정:
   *  - scoreMap 제공 시 → 문항별 실배점 사용 (정답 문항의 배점 합)
   *  - number 제공 시   → 문항당 균등 배점
   *  - 미제공 시        → 100 / 문항수 균등 배점
   */
  scoring?: Record<number, number> | number,
): SectionResult {
  const nums = Object.keys(correctAns).map(Number).sort((a, b) => a - b)
  const scoreMap = typeof scoring === "object" ? scoring : undefined
  const ppq = typeof scoring === "number" ? scoring : 100 / nums.length

  let correct = 0
  let attempted = 0
  let rawScore = 0
  const detail = nums.map((num) => {
    const ua = userAns[num] ?? null
    const ca = correctAns[num]
    const isCorrect = ua !== null && ua === ca
    if (ua !== null) attempted++
    if (isCorrect) {
      correct++
      rawScore += scoreMap ? scoreMap[num] ?? 0 : ppq
    }
    return { num, userAnswer: ua, correct: ca, isCorrect }
  })
  rawScore = Math.round(rawScore * 100) / 100
  return { name, totalQuestions: nums.length, correct, attempted, rawScore, detail }
}

export type SubjectName = "국어" | "영어" | "수학"

/**
 * 과목 1개만 채점 — 페이지별(과목별) 자가채점용.
 *
 * gradeSubmission이 사용하는 것과 **동일한** gradeSection 로직·정답키·배점을 그대로
 * 재사용하므로, 과목별 채점 결과를 합치면 전체 채점(gradeSubmission)과 정확히 일치합니다.
 * (즉 모고앱 연동 채점과도 동일한 정답/배점 기준을 사용)
 */
export function gradeSubject(
  track: Track,
  year: number,
  subject: SubjectName,
  answers: Record<number, Answer | null>,
  elective?: ElectiveKey,
): SectionResult {
  if (track === "saagwan") {
    const key = SAAGWAN_ANSWER_KEYS[year]
    if (!key) throw new Error(`사관 ${year} 정답표 없음`)
    const scoreKey = SAAGWAN_SCORE_KEYS[year]
    if (subject === "국어") return gradeSection("국어", answers, key.korean, scoreKey?.korean ?? 100 / 30)
    if (subject === "영어") return gradeSection("영어", answers, key.english, scoreKey?.english ?? 100 / 30)
    // 수학: 공통(1-22) + 선택(23-30) 합쳐서 채점
    const el = elective ?? "미적분"
    const mathCorrect: Record<number, Answer> = {
      ...key.math.common,
      ...(key.math.electives[el] || {}),
    }
    const mathScore: Record<number, number> | undefined = scoreKey && {
      ...scoreKey.math.common,
      ...(scoreKey.math.electives[el] || {}),
    }
    return gradeSection("수학", answers, mathCorrect, mathScore ?? 100 / 30)
  }
  const key = POLICE_ANSWER_KEYS[year]
  if (!key) throw new Error(`경찰대 ${year} 정답표 없음`)
  if (subject === "국어") return gradeSection("국어", answers, key.korean, 100 / 45)
  if (subject === "영어") return gradeSection("영어", answers, key.english, 100 / 45)
  return gradeSection("수학", answers, key.math, 100 / 25)
}

export function gradeSubmission(sub: Submission): GradingResult {
  if (sub.track === "saagwan") {
    const key = SAAGWAN_ANSWER_KEYS[sub.year]
    if (!key) throw new Error(`사관 ${sub.year} 정답표 없음`)
    const scoreKey = SAAGWAN_SCORE_KEYS[sub.year]

    // 수학: 공통(1-22) + 선택(23-30) 합쳐서 채점
    const mathCorrect: Record<number, Answer> = {
      ...key.math.common,
      ...(key.math.electives[sub.elective] || {}),
    }
    // 문항별 실배점 (정답표와 동일 구조)
    const mathScore: Record<number, number> | undefined = scoreKey && {
      ...scoreKey.math.common,
      ...(scoreKey.math.electives[sub.elective] || {}),
    }

    const sections = [
      gradeSection("국어", sub.korean, key.korean, scoreKey?.korean ?? 100 / 30),
      gradeSection("영어", sub.english, key.english, scoreKey?.english ?? 100 / 30),
      gradeSection("수학", sub.math, mathCorrect, mathScore ?? 100 / 30),
    ]
    const totalCorrect = sections.reduce((s, x) => s + x.correct, 0)
    const totalQuestions = sections.reduce((s, x) => s + x.totalQuestions, 0)
    const totalScore = Math.round(sections.reduce((s, x) => s + x.rawScore, 0))
    return {
      track: "saagwan",
      year: sub.year,
      elective: sub.elective,
      sections,
      totalCorrect,
      totalQuestions,
      totalScore,
      gradedAt: new Date().toISOString(),
    }
  } else {
    const key = POLICE_ANSWER_KEYS[sub.year]
    if (!key) throw new Error(`경찰대 ${sub.year} 정답표 없음`)
    const sections = [
      gradeSection("국어", sub.korean, key.korean, 100 / 45),
      gradeSection("영어", sub.english, key.english, 100 / 45),
      gradeSection("수학", sub.math, key.math, 100 / 25),
    ]
    const totalCorrect = sections.reduce((s, x) => s + x.correct, 0)
    const totalQuestions = sections.reduce((s, x) => s + x.totalQuestions, 0)
    const totalScore = Math.round(sections.reduce((s, x) => s + x.rawScore, 0))
    return {
      track: "police",
      year: sub.year,
      sections,
      totalCorrect,
      totalQuestions,
      totalScore,
      gradedAt: new Date().toISOString(),
    }
  }
}

// Use SCORING_RULES to silence unused-import warning in some lint configs
void SCORING_RULES
