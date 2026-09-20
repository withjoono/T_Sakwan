import type { HeaderGroup, HeaderNavItem } from "@tskool/satellite-header"

const tool = (title: string, url: string, description: string) => ({ title, url, description, app: "T사관" })
export const preparationGroups: HeaderGroup[] = [
  { id: "scores", label: "성적관리", title: "사관·경찰 시험 성적을 한곳에서", description: "채점부터 누적 성적과 오답까지 확인하세요.", guide: { label: "모의고사 시작하기", href: "/mock" }, tools: [
    tool("기출 모의고사", "/mock/past", "지난 시험으로 실전 감각을 점검합니다."),
    tool("T사관 모의고사", "/mock/tsagwan", "전용 모의고사 회차를 선택합니다."),
    tool("문제집 다운로드", "/mock/tsagwan/download", "구매한 모의고사 자료를 확인합니다."),
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
  { id: "admission", label: "입시정보", title: "5개 학교 모집요강 비교", description: "전형 일정·모집인원·필기·체력·면접 기준을 확인하세요.", guide: { label: "전체 비교", href: "/admission" }, tools: [
    tool("육군사관학교", "/admission/army", "육사 전형 일정과 선발 기준"),
    tool("해군사관학교", "/admission/navy", "해사 전형 일정과 선발 기준"),
    tool("공군사관학교", "/admission/airforce", "공사 전형 일정과 선발 기준"),
    tool("국군간호사관학교", "/admission/nursing", "국간사 전형 일정과 선발 기준"),
    tool("경찰대학", "/admission/police", "경찰대 전형 일정과 선발 기준"),
    tool("학교별 클래스", "/#schools", "목표 학교에 맞는 반을 찾아보세요."),
  ] },
]
// 상위 목적지 7개만 노출. 세부 기능은 상단 준비 도구와 각 화면 안에 둔다.
export const contentNav: HeaderNavItem[] = [
  { href: "/", label: "홈" },
  { href: "/admission", label: "전형안내", match: "prefix" },
  { href: "/mock", label: "모의고사", match: "prefix" },
  { href: "/1cha", label: "1차 합불예측", match: "prefix" },
  { href: "/planner", label: "학습관리", match: "prefix" },
  { href: "/mentoring", label: "멘토링", match: "prefix" },
  { href: "/interview", label: "면접준비", match: "prefix" },
]
