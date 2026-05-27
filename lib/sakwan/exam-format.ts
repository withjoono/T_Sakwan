/**
 * 사관학교 / 경찰대 모의고사 시험 형식 정의
 *
 * Mogo가 사용하는 수능 형식과 다르므로, Sakwan에서 별도로 관리합니다.
 * Mogo에 사관·경찰 전용 입력 폼이 추가되기 전까지의 "단일 진실 공급원(SSOT)".
 */

export type Section = {
  name: string                       // "국어" | "영어" | "수학" 등
  totalQuestions: number             // 총 문항 수
  parts: {
    label: string                    // "공통 객관식" 등
    range: [number, number]          // 문항 번호 시작-끝
    type: "객관식" | "주관식"
    note?: string                    // "선택과목별 분기" 등
  }[]
  electives?: string[]               // 선택과목 (있을 경우)
  rawMaxScore?: number               // 원점수 만점 (가정)
}

/**
 * 사관학교 1차 시험 (육사·공사·해사·국간사 공통 형식 가정)
 *
 * 출처: 사용자 제공 (2026-05-28)
 *  - 국어 30 객관식
 *  - 영어 30 객관식
 *  - 수학 30 (공통 1-15 객관식, 16-22 주관식, 선택 23-28 객관식, 29-30 주관식)
 */
export const SAAGWAN_EXAM_FORMAT: { sections: Section[]; totalDuration?: string } = {
  totalDuration: "각 80분 내외 (학교별 상이)",
  sections: [
    {
      name: "국어",
      totalQuestions: 30,
      parts: [{ label: "전체", range: [1, 30], type: "객관식" }],
      rawMaxScore: 100,
    },
    {
      name: "영어",
      totalQuestions: 30,
      parts: [{ label: "전체", range: [1, 30], type: "객관식" }],
      rawMaxScore: 100,
    },
    {
      name: "수학",
      totalQuestions: 30,
      parts: [
        { label: "공통 객관식", range: [1, 15], type: "객관식" },
        { label: "공통 주관식", range: [16, 22], type: "주관식" },
        { label: "선택 객관식", range: [23, 28], type: "객관식", note: "선택과목별 분기" },
        { label: "선택 주관식", range: [29, 30], type: "주관식", note: "선택과목별 분기" },
      ],
      electives: ["확률과 통계", "미적분", "기하"],
      rawMaxScore: 100,
    },
  ],
}

/**
 * 경찰대 1차 시험 (확인 필요 — 추후 보강)
 *
 * 경찰대는 국어/영어/수학 3과목 (사관과 유사하나 세부 문항수·배점 다를 가능성).
 * TODO: 실 모집요강 기반 검증
 */
export const POLICE_EXAM_FORMAT: { sections: Section[]; totalDuration?: string } = {
  totalDuration: "확인 필요",
  sections: [
    { name: "국어", totalQuestions: 45, parts: [{ label: "전체", range: [1, 45], type: "객관식" }], rawMaxScore: 100 },
    { name: "영어", totalQuestions: 45, parts: [{ label: "전체", range: [1, 45], type: "객관식" }], rawMaxScore: 100 },
    { name: "수학", totalQuestions: 25, parts: [{ label: "전체", range: [1, 25], type: "객관식·주관식 혼합" as any }], rawMaxScore: 100 },
  ],
}

/**
 * 트랙별 시험 형식 가져오기
 */
export function getExamFormat(track: "saagwan" | "police") {
  return track === "saagwan" ? SAAGWAN_EXAM_FORMAT : POLICE_EXAM_FORMAT
}
