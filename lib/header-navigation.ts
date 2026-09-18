import type { HeaderGroup, HeaderNavItem } from "@tskool/satellite-header"

type NavItem = { label: string; href: string }

const mainMenu: NavItem[] = [
  { label: "플래너", href: "/planner" },
  { label: "생기부 관리", href: "/sanggibu" },
  { label: "멘토링", href: "/mentoring" },
]

// 사관/경찰 모의 하위 메뉴 (응시 관련만 — 분석은 별도 '분석' 드롭다운)
const mockMenu: NavItem[] = [
  { label: "모의고사 홈", href: "/mock" },
  { label: "📚 기출 모의고사", href: "/mock/past" },
  { label: "✨ T사관 모의고사", href: "/mock/tsagwan" },
  { label: "📥 문제집 다운로드", href: "/mock/tsagwan/download" },
  { label: "✍️ 채점하기", href: "/mock/grade" },
]

// 모의고사 분석 하위 메뉴 (모고 앱에서 이식한 분석 기능)
const mockAnalysisMenu: NavItem[] = [
  { label: "🎖 1차 합불예측", href: "/1cha" },
  { label: "📊 성적분석", href: "/mock/score-analysis" },
  { label: "🎯 학교별 예측", href: "/mock/prediction" },
  { label: "📈 누적분석", href: "/mock/statistics" },
  { label: "🔍 취약분석", href: "/mock/weakness" },
  { label: "📝 오답노트", href: "/mock/wrong-answers" },
]

// 대학별 전형 안내(/admission) — 요강 원문 기준 입시정보
const admissionMenu: NavItem[] = [
  { label: "📋 전체 비교", href: "/admission" },
  { label: "🟢 육군사관학교", href: "/admission/army" },
  { label: "🔵 해군사관학교", href: "/admission/navy" },
  { label: "🔷 공군사관학교", href: "/admission/airforce" },
  { label: "🏥 국군간호사관학교", href: "/admission/nursing" },
  { label: "👮 경찰대학", href: "/admission/police" },
]

const classMenu: NavItem[] = [
  { label: "🟢 육사반", href: "/class/army" },
  { label: "🔷 공사반", href: "/class/airforce" },
  { label: "🔵 해사반", href: "/class/navy" },
  { label: "🏥 국간사반", href: "/class/nursing" },
  { label: "👮 경찰대반", href: "/class/police" },
]

// 인트로 = 사관 전체 프로모 페이지 모음
const promoCore: NavItem[] = [
  { label: "메인", href: "/" },
  { label: "사관/경찰 모의", href: "/mock" },
  { label: "플래너", href: "/planner" },
  { label: "생기부 관리", href: "/sanggibu" },
  { label: "멘토링", href: "/mentoring" },
  { label: "2차면접", href: "/interview" },
]


const tool = (title: string, url: string, description: string) => ({ title, url, description, app: "T사관" })
export const preparationGroups: HeaderGroup[] = [
  { id: "scores", label: "성적관리", title: "사관·경찰 시험 성적을 한곳에서", description: "채점부터 누적 성적과 오답까지 확인하세요.", guide: { label: "모의고사 시작하기", href: "/mock" }, tools: [
    tool("답안 채점", "/mock/grade", "사관·경찰 시험 형식에 맞춰 답안을 채점합니다."),
    tool("성적분석", "/mock/score-analysis", "과목별 성적과 응시 집단 내 위치를 확인합니다."),
    tool("누적분석", "/mock/statistics", "회차별 성적 변화를 살펴봅니다."),
    tool("취약분석", "/mock/weakness", "보완할 과목과 영역을 찾습니다."),
    tool("오답노트", "/mock/wrong-answers", "틀린 문항을 다시 학습합니다."),
  ] },
  { id: "learning", label: "학습관리", title: "필기와 2차 시험을 함께 준비", description: "학습 계획·학생부·면접 준비를 이어가세요.", guide: { label: "학습 플래너", href: "/planner" }, tools: [
    tool("플래너", "/planner", "과목별 학습 계획을 세웁니다."),
    tool("생기부 관리", "/sanggibu", "학교생활과 진로 준비를 정리합니다."),
    tool("멘토링", "/mentoring", "사관학교·경찰대 준비를 상담합니다."),
    tool("2차면접", "/interview", "지원 동기와 면접 답변을 준비합니다."),
  ] },
  { id: "prediction", label: "입시예측", title: "사관학교·경찰대 1차 지원 점검", description: "입력한 성적을 바탕으로 예측 결과를 확인하세요.", guide: { label: "1차 합불예측", href: "/1cha" }, tools: [
    tool("1차 합불예측", "/1cha", "학교별 1차 예측 결과를 확인합니다."),
    tool("학교별 예측", "/mock/prediction", "모의고사 성적으로 지원 학교를 살펴봅니다."),
  ], note: "예측은 참고 자료이며 최종 합격을 보장하지 않습니다." },
  { id: "admission", label: "입시정보", title: "5개 학교 모집요강 비교", description: "전형 일정·모집인원·필기·체력·면접 기준을 확인하세요.", guide: { label: "전체 비교", href: "/admission" }, tools: admissionMenu.slice(1).map(item => tool(item.label, item.href, "2027학년도 모집요강과 확인이 필요한 사항")) },
]
// 기존 콘텐츠 메뉴의 모든 목적지를 공통 패키지의 가로 스크롤 메뉴로 유지한다.
export const contentNav: HeaderNavItem[] = Array.from(new Map([
  ...promoCore, ...mainMenu, ...mockMenu, ...mockAnalysisMenu, ...admissionMenu, ...classMenu,
].map(item => [item.href, { ...item, match: "exact" as const }])).values())
