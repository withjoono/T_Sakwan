/**
 * 대학별 전형 안내(/admission) 데이터 타입.
 *
 * 원칙 3가지 — 고치기 전에 반드시 읽을 것.
 *
 * 1. **여기 적히는 숫자는 전부 각 학교 2027학년도 모집요강 원문에서 온다.**
 *    3자 분석 자료(학원·블로그·요약 PDF)를 출처로 쓰지 않는다. 2026-09 교차검증에서
 *    3자 자료와 요강이 어긋난 사례가 3건 나왔다(공사 체력 과락선 1분 차이 등).
 *    구조화 정리본은 `docs/admission/요강정리-*.md`, 원본 PDF는
 *    `E:\Dev\github\Susi\2028_susi\Sakwan` 에 있다.
 *
 * 2. **요강에 없는 것은 없다고 쓴다.** 추정·반올림·연도 환산 금지.
 *    "요강에 명시 없음"이라고 화면에 그대로 적는 편이 낫다.
 *
 * 3. **요강 자체가 모순되거나 판독이 불확실한 값은 `uncertain` 에 남긴다.**
 *    지우지 말 것. 모르는 것을 아는 척하지 않는 게 이 페이지군의 자산이다.
 */

export type SchoolSlug = "army" | "navy" | "airforce" | "nursing" | "police"

/** 표 하나. 셀은 전부 문자열 — 숫자 포맷을 요강 표기 그대로 유지하기 위해서다. */
export type DataTable = {
  head: string[]
  rows: string[][]
  /** 표 아래 각주. 요강 원문의 단서 조항을 여기에 둔다. */
  notes?: string[]
}

export type KeyFact = {
  label: string
  value: string
  note?: string
}

export type Faq = { q: string; a: string }

/** 전환 목표 3종. 페이지당 하나만 배치한다. */
export type CtaKind = "mock" | "signup" | "consult"

export type AdmissionCta = {
  kind: CtaKind
  title: string
  body: string
  href: string
  label: string
}

export type AdmissionSchool = {
  slug: SchoolSlug
  /** 정식 명칭 */
  name: string
  /** 줄임말 — 표·본문에서 쓴다 */
  short: string
  /** 2027학년도 입학 기수 */
  cohort: string
  icon: string
  /** hero 배경 gradient (tailwind class 조각) */
  heroGradient: string

  /** 검색 결과에서 그대로 인용되도록 쓴 한 문장 직답. */
  headline: string
  /** 이 학교를 다른 4곳과 가르는 한 가지. */
  distinctive: string

  quotaTotal: string
  homepage: { label: string; url: string }
  contact?: string
  /** 인용한 요강 문서명. 화면 하단 출처 블록에 그대로 찍는다. */
  sourceDoc: string

  keyFacts: KeyFact[]

  schedule: DataTable
  /** 원서접수 시작일 — 허브 비교표에서 쓴다. */
  applyPeriod: string
  /** 1차 시험일 */
  examDate: string

  exam: {
    lead: string
    entry: string
    timetable: DataTable
    scope: DataTable
    multiplier: DataTable
    scoring: string[]
  }

  quota: DataTable
  quotaNotes: string[]

  weights: DataTable
  weightsNotes: string[]

  record: {
    lead: string
    /** 1등급과 9등급의 총점 차이 — 상담에서 가장 많이 묻는 값. */
    impact: string
    grade: DataTable
    attendance: DataTable | null
    notes: string[]
  }

  korhist: DataTable | null
  korhistNotes: string[]

  fitness: {
    lead: string
    /** 과락선 한 줄. 허브 비교표에서도 쓴다. */
    cutoff: string
    table: DataTable
    notes: string[]
  }

  medical: {
    lead: string
    table: DataTable
    notes: string[]
  }

  interview: {
    lead: string
    table: DataTable
    notes: string[]
  }

  /** 요강이 "변경사항"으로 직접 명시한 것만. 없으면 빈 배열 + note 로 그 사실을 쓴다. */
  changes2027: { items: string[]; note: string }

  /** 2028학년도. 시행계획 공고 전이므로 확정분만 싣는다. */
  y2028: { confirmed: string[]; pending: string[] }

  venues: DataTable

  /** 요강 내부 모순·판독 불확실 — 화면에 ⚠️ 로 노출한다. */
  uncertain: string[]

  faq: Faq[]
  cta: AdmissionCta
}
