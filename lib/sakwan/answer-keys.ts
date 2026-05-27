/**
 * 사관·경찰대 기출 정답표
 *
 * placeholder 데이터. 실제 정답으로 교체해야 합니다.
 * 키: `{track}-{year}` (예: 'saagwan-2025', 'police-2026')
 *
 * 형식:
 *   각 과목별 문항 번호 → 정답 번호(1~5) 또는 주관식 답(문자열)
 *   객관식: 1|2|3|4|5
 *   주관식: 0~999 사이 정수 (수학 주관식 답안)
 *
 * 사관 수학 선택과목(확통/미적/기하)은 각 elective 키로 분리.
 */

export type Answer = number  // 1-5 (객관식) | 0-999 (주관식)
export type ElectiveKey = "확률과 통계" | "미적분" | "기하"

export interface SaagwanAnswerKey {
  korean: Record<number, Answer>      // 1-30, 객관식
  english: Record<number, Answer>     // 1-30, 객관식
  math: {
    common: Record<number, Answer>    // 1-22 (1-15 객관식, 16-22 주관식)
    electives: Record<ElectiveKey, Record<number, Answer>>  // 23-30 (23-28 객관식, 29-30 주관식)
  }
}

export interface PoliceAnswerKey {
  korean: Record<number, Answer>      // 1-45, 객관식 (확정 형식 추후 보강)
  english: Record<number, Answer>     // 1-45, 객관식
  math: Record<number, Answer>        // 1-25, 객관식 + 주관식 혼합
}

/**
 * 사관학교 기출 — placeholder 정답표
 * 모두 1번으로 채워져 있음. 실제 정답으로 교체 필요.
 */
function makeSaagwanPlaceholder(): SaagwanAnswerKey {
  const fill = (n: number, val: Answer = 1) =>
    Object.fromEntries(Array.from({ length: n }, (_, i) => [i + 1, val])) as Record<number, Answer>
  return {
    korean: fill(30),
    english: fill(30),
    math: {
      common: fill(22),
      electives: {
        "확률과 통계": Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 23, 1])),
        "미적분":     Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 23, 2])),
        "기하":       Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 23, 3])),
      },
    },
  }
}

function makePolicePlaceholder(): PoliceAnswerKey {
  const fill = (n: number, val: Answer = 1) =>
    Object.fromEntries(Array.from({ length: n }, (_, i) => [i + 1, val])) as Record<number, Answer>
  return { korean: fill(45), english: fill(45), math: fill(25) }
}

export const SAAGWAN_ANSWER_KEYS: Record<number, SaagwanAnswerKey> = {
  2022: makeSaagwanPlaceholder(),
  2023: makeSaagwanPlaceholder(),
  2024: makeSaagwanPlaceholder(),
  2025: makeSaagwanPlaceholder(),
  2026: makeSaagwanPlaceholder(),
}

export const POLICE_ANSWER_KEYS: Record<number, PoliceAnswerKey> = {
  2022: makePolicePlaceholder(),
  2023: makePolicePlaceholder(),
  2024: makePolicePlaceholder(),
  2025: makePolicePlaceholder(),
  2026: makePolicePlaceholder(),
}

/**
 * 배점 (사관·경찰 동일 가정)
 * - 객관식: 3점/문항
 * - 주관식: 4점/문항
 * 실제 배점은 회차별로 다르므로 추후 회차별 정의 가능.
 */
export const SCORING_RULES = {
  saagwan: {
    korean:  { objective: 100 / 30 },        // 30문항 100점
    english: { objective: 100 / 30 },
    math:    { common_obj: 3, common_sub: 4, elective_obj: 3, elective_sub: 6 },
  },
  police: {
    korean:  { objective: 100 / 45 },
    english: { objective: 100 / 45 },
    math:    { all: 100 / 25 },
  },
}

/**
 * 정답표 보유 여부 — UI에서 "정답 미입력" 안내용
 * placeholder는 모두 1로 채워진 가짜이므로 false 처리하는 것이 안전.
 */
export const ANSWER_KEY_AVAILABLE: Record<string, boolean> = {
  "saagwan-2022": false,
  "saagwan-2023": false,
  "saagwan-2024": false,
  "saagwan-2025": false,
  "saagwan-2026": false,
  "police-2022":  false,
  "police-2023":  false,
  "police-2024":  false,
  "police-2025":  false,
  "police-2026":  false,
}
