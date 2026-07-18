/* ───────── T사관 모의고사 상품 · 결제/다운로드 공용 설정 ─────────
 * 결제(checkout)와 다운로드(download) 페이지가 함께 사용하는 단일 소스.
 * 실제 PG 연동 전까지는 결제 완료 상태를 localStorage에 저장해 다운로드를 개방한다.
 */

export type PlanId = "package"

export type Plan = {
  id: PlanId
  name: string
  price: number
  desc: string
  /** 결제 시 함께 제공되는 혜택 목록 */
  benefits: string[]
  /** 이 플랜 결제 시 다운로드 가능한 모의고사 회차(1~5) */
  rounds: number[]
}

export const PLANS: Record<PlanId, Plan> = {
  package: {
    id: "package",
    name: "7월 5회 패키지",
    price: 180000,
    desc: "7월 전 회차(1~5회) 응시권 + 문제지 다운로드. 기출까지 풀며 현재 위치 파악과 취약 분석을 한 번에.",
    benefits: [
      "T사관 모의고사 1~5회 문제지 전체 다운로드",
      "사관학교 기출문제까지 함께 풀이",
      "전국 석차·백분위로 현재 위치 파악",
      "단원별 정답률·취약 유형 분석 리포트",
    ],
    rounds: [1, 2, 3, 4, 5],
  },
}

export const KRW = (n: number) => n.toLocaleString("ko-KR") + "원"

/* ───────── T사관 모의고사 회차별 자료 (5회) ─────────
 * 각 회차: 문제지(questions) / 답지(answers) / 해설서(solutions) — 과목별 PDF.
 * 문제지는 결제 시 바로, 답지·해설서는 "플랫폼에 점수 입력" 완료 후 다운로드가 열립니다.
 * TODO: 2~5회 자료 업로드 후 배열을 채우세요. (빈 배열이면 "준비중"으로 표시)
 */
export type SubjectFile = { subject: string; href: string }
export type MockRound = {
  round: number
  label: string
  date: string
  dow: string
  openIso: string // 회차 오픈일(YYYY-MM-DD) — 이 날짜 이후부터 다운로드 오픈
  questions: SubjectFile[]
  answers: SubjectFile[]
  solutions: SubjectFile[]
}

// 회차별 파일 경로 생성 (문제지·답지·해설서 각 국·수·영).
// 2~5회 수학 답지는 xlsx 공통(1~22)만 채워진 정답표 — 선택과목은 해설서 참조.
function buildRound(
  round: number,
  label: string,
  date: string,
  dow: string,
  openIso: string,
): MockRound {
  const base = `/downloads/2027-sagwan/${String(round).padStart(2, "0")}`
  return {
    round,
    label,
    date,
    dow,
    openIso,
    questions: [
      { subject: "국어", href: `${base}/korean-question.pdf` },
      { subject: "수학", href: `${base}/math-question.pdf` },
      { subject: "영어", href: `${base}/english-question.pdf` },
    ],
    answers: [
      { subject: "국어", href: `${base}/korean-answer.pdf` },
      { subject: "수학", href: `${base}/math-answer.pdf` },
      { subject: "영어", href: `${base}/english-answer.pdf` },
    ],
    solutions: [
      { subject: "국어", href: `${base}/korean-solution.pdf` },
      { subject: "수학", href: `${base}/math-solution.pdf` },
      { subject: "영어", href: `${base}/english-solution.pdf` },
    ],
  }
}

export const MOCK_ROUNDS: MockRound[] = [
  buildRound(1, "1회", "7/11", "토", "2026-07-11"),
  buildRound(2, "2회", "7/18", "토", "2026-07-18"),
  buildRound(3, "3회", "7/21", "화", "2026-07-21"),
  buildRound(4, "4회", "7/25", "토", "2026-07-25"),
  buildRound(5, "5회", "7/28", "화", "2026-07-28"),
]

/** 회차 오픈 여부 — 지정 날짜(openIso) 이후부터 오픈 */
export function isRoundOpen(r: MockRound, now: Date = new Date()): boolean {
  const open = new Date(r.openIso + "T00:00:00")
  return now.getTime() >= open.getTime()
}

/* ───────── 사관학교 기출문제 공식 다운로드 링크 ───────── */
export type PastExamLink = { name: string; icon: string; desc: string; href: string }
export const PAST_EXAM_LINKS: PastExamLink[] = [
  {
    name: "육군사관학교 (육사)",
    icon: "🎖",
    desc: "육사 입학안내 · 1차시험 기출문제 공식 다운로드 (국어·영어·수학)",
    href: "https://www.kma.ac.kr:461/kma/2170/subview.do",
  },
]

/* ───────── 수동 전체개방 계정(결제 확인 후 부여) ─────────
 * 실제 결제 백엔드 연동 전까지, 결제가 확인된 계정을 이메일로 등록하면
 * 로그인 시 전 회차(결제·오픈일 게이트 모두 통과)를 이용할 수 있다.
 * 이메일은 소문자로 등록.
 */
export const GRANTED_EMAILS: string[] = [
  "hhtae0423@gmail.com",
]

export function isGrantedEmail(email?: string | null): boolean {
  return !!email && GRANTED_EMAILS.includes(email.trim().toLowerCase())
}

/* ───────── 결제 게이트 토글 ─────────
 * true  = 결제창 활성화: 미결제 사용자에게 결제 유도(GRANTED_EMAILS 계정은 결제 완료로 처리).
 * false = 결제창을 걷어냄: 모든 사용자가 결제 없이 다운로드 가능(오픈일·채점 게이트는 유지).
 */
export const PAYMENT_ENABLED = true

/* ───────── 결제 상태(localStorage) ───────── */
const PAID_KEY = "tsagwan_paid_v1"

export type PaidState = { plan: PlanId; rounds: number[]; at: number }

export function savePaid(state: PaidState) {
  try {
    localStorage.setItem(PAID_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

export function loadPaid(): PaidState | null {
  try {
    const raw = localStorage.getItem(PAID_KEY)
    return raw ? (JSON.parse(raw) as PaidState) : null
  } catch {
    return null
  }
}

/* ───────── 회차별 점수 입력(자가채점) 상태 ─────────
 * "플랫폼에 점수를 입력"하면(=채점 완료) 해당 회차의 답지·해설서 다운로드가 열린다.
 */
export type RoundScore = { korean: number; math: number; english: number; at: number }

const roundScoreKey = (round: number) => `tsagwan_round_score_${round}`

export function saveRoundScore(round: number, score: Omit<RoundScore, "at">) {
  try {
    localStorage.setItem(roundScoreKey(round), JSON.stringify({ ...score, at: Date.now() }))
  } catch {
    /* ignore */
  }
}

export function loadRoundScore(round: number): RoundScore | null {
  try {
    const raw = localStorage.getItem(roundScoreKey(round))
    return raw ? (JSON.parse(raw) as RoundScore) : null
  } catch {
    return null
  }
}
