import { notFound } from "next/navigation"
import ClassPageClient from "./class-page-client"

export type ClassData = {
  slug: string
  name: string
  shortName: string
  icon: string
  tagline: string
  message: string
  heroGradient: string
  accentColor: string
  badge: string
  schedule: { phase: string; date: string }[]
  subjects: { name: string; detail: string }[]
  fitness: { name: string; standard: string }[]
  interview: { name: string; detail: string }[]
  physical?: { name: string; detail: string }[]
  cutoffs: { year: number; cut: number }[]
  mentors: { initial: string; name: string; school: string; intro: string }[]
}

const CLASSES: Record<string, ClassData> = {
  army: {
    slug: "army",
    name: "육군사관학교",
    shortName: "육사반",
    icon: "🟢",
    tagline: "정원이 가장 많고, 리더십·체력 균형이 핵심",
    message: "1차 점수만으로는 부족합니다. 체력과 면접 리더십까지 1년 단위로.",
    heroGradient: "from-green-700 via-emerald-800 to-slate-900",
    accentColor: "green",
    badge: "정원 가장 많음",
    schedule: [
      { phase: "원서 접수", date: "2026.06 ~ 07" },
      { phase: "1차 필기시험", date: "2026.07" },
      { phase: "체력검정·신체검사", date: "2026.08" },
      { phase: "2차 면접", date: "2026.09 ~ 10" },
      { phase: "최종 발표", date: "2026.11" },
    ],
    subjects: [
      { name: "국어", detail: "사관학교 특화 비문학 + 화법" },
      { name: "수학", detail: "이과 수학 기준 (미적분 포함)" },
      { name: "영어", detail: "수능 기조 + 사관 빈출 주제" },
      { name: "공간능력", detail: "전개도·블록·도형 회전" },
      { name: "한국사·국사", detail: "근현대사 중심" },
    ],
    fitness: [
      { name: "1.5km 달리기", standard: "남 7'30\" 이내 / 여 8'30\" 이내" },
      { name: "윗몸일으키기", standard: "1분 / 남 70회 / 여 50회 이상" },
      { name: "팔굽혀펴기", standard: "2분 / 남 60회 / 여 30회 이상" },
    ],
    interview: [
      { name: "AI 인성 면접", detail: "표정·발화 패턴 자동 분석" },
      { name: "면접관 대면", detail: "국가관·리더십·시사 이슈" },
      { name: "심층 면접", detail: "지원 동기 + 학교생활 검증" },
    ],
    cutoffs: [
      { year: 2021, cut: 248 },
      { year: 2022, cut: 252 },
      { year: 2023, cut: 250 },
      { year: 2024, cut: 256 },
      { year: 2025, cut: 254 },
    ],
    mentors: [
      { initial: "김", name: "김O준", school: "육사 24기", intro: "1차 점프 60→78점" },
      { initial: "박", name: "박O서", school: "육사 23기", intro: "재수 끝에 합격" },
      { initial: "이", name: "이O민", school: "육사 25기", intro: "체력 8주 단축" },
    ],
  },
  airforce: {
    slug: "airforce",
    name: "공군사관학교",
    shortName: "공사반",
    icon: "🔷",
    tagline: "시력·신체 기준 사전 체크, 1차 컷 가장 높음",
    message: "신체검사 통과가 첫 관문입니다. 지원 전 시력·BMI부터 확인하세요.",
    heroGradient: "from-sky-700 via-blue-800 to-slate-900",
    accentColor: "sky",
    badge: "1차 컷 高",
    schedule: [
      { phase: "원서 접수", date: "2026.06 ~ 07" },
      { phase: "1차 필기시험", date: "2026.07" },
      { phase: "신체검사·체력검정", date: "2026.08" },
      { phase: "2차 면접", date: "2026.10" },
      { phase: "최종 발표", date: "2026.11" },
    ],
    subjects: [
      { name: "국어", detail: "수능 기조" },
      { name: "수학", detail: "이과 수학 (미적분 + 기하)" },
      { name: "영어", detail: "1등급 컷 가장 높음" },
      { name: "공간능력", detail: "조종 적성 직결 — 변별력 ↑" },
      { name: "한국사", detail: "근현대사" },
    ],
    fitness: [
      { name: "1.5km 달리기", standard: "남 6'59\" 이내 / 여 8'09\" 이내" },
      { name: "윗몸일으키기", standard: "1분 / 남 75회 / 여 55회 이상" },
      { name: "팔굽혀펴기", standard: "2분 / 남 70회 / 여 40회 이상" },
    ],
    interview: [
      { name: "AI 인성 면접", detail: "표정·발화 패턴 자동 분석" },
      { name: "면접관 대면", detail: "항공·안보 이슈, 조종사 적성" },
      { name: "심층 면접", detail: "리더십·팀워크" },
    ],
    physical: [
      { name: "시력", detail: "교정시력 0.5 이상 / 굴절률 ±5.0D 이내" },
      { name: "신장·체중", detail: "조종 분야 162.5~195cm, BMI 17~33" },
      { name: "기타", detail: "색각·청력·치아 등 항공 적성 기준 적용" },
    ],
    cutoffs: [
      { year: 2021, cut: 261 },
      { year: 2022, cut: 264 },
      { year: 2023, cut: 263 },
      { year: 2024, cut: 270 },
      { year: 2025, cut: 268 },
    ],
    mentors: [
      { initial: "정", name: "정O호", school: "공사 73기", intro: "시력 변수 미리 체크" },
      { initial: "한", name: "한O은", school: "공사 74기", intro: "공간능력 만점 비결" },
      { initial: "윤", name: "윤O아", school: "공사 73기", intro: "면접 시사 답변 설계" },
    ],
  },
  navy: {
    slug: "navy",
    name: "해군사관학교",
    shortName: "해사반",
    icon: "🔵",
    tagline: "정보가 가장 부족한 트랙 — 멘토 가치 ↑",
    message: "공사·육사에 비해 정보가 적습니다. 합격생 멘토의 가치가 가장 큰 반.",
    heroGradient: "from-blue-700 via-indigo-800 to-slate-900",
    accentColor: "blue",
    badge: "정보 부족 트랙",
    schedule: [
      { phase: "원서 접수", date: "2026.06 ~ 07" },
      { phase: "1차 필기시험", date: "2026.07" },
      { phase: "체력검정·신체검사", date: "2026.08" },
      { phase: "2차 면접", date: "2026.10" },
      { phase: "최종 발표", date: "2026.11" },
    ],
    subjects: [
      { name: "국어", detail: "수능 기조" },
      { name: "수학", detail: "이과 수학 (미적분/기하)" },
      { name: "영어", detail: "수능 기조" },
      { name: "공간능력", detail: "함정 운용 적성" },
      { name: "한국사", detail: "해전사 빈출" },
    ],
    fitness: [
      { name: "1.5km 달리기", standard: "남 7'20\" 이내 / 여 8'20\" 이내" },
      { name: "윗몸일으키기", standard: "1분 / 남 72회 / 여 52회 이상" },
      { name: "팔굽혀펴기", standard: "2분 / 남 65회 / 여 35회 이상" },
      { name: "수영", standard: "25m 이상 (자유형 또는 평영)" },
    ],
    interview: [
      { name: "AI 인성 면접", detail: "표정·발화 패턴 분석" },
      { name: "면접관 대면", detail: "해양·안보 이슈" },
      { name: "심층 면접", detail: "장기 항해 적응성·리더십" },
    ],
    cutoffs: [
      { year: 2021, cut: 254 },
      { year: 2022, cut: 258 },
      { year: 2023, cut: 256 },
      { year: 2024, cut: 262 },
      { year: 2025, cut: 260 },
    ],
    mentors: [
      { initial: "조", name: "조O린", school: "해사 80기", intro: "실전 가이드" },
      { initial: "강", name: "강O찬", school: "해사 79기", intro: "비수도권 1년 합격" },
      { initial: "임", name: "임O율", school: "해사 81기", intro: "신체 기준 통과 코칭" },
    ],
  },
  nursing: {
    slug: "nursing",
    name: "국군간호사관학교",
    shortName: "국간사반",
    icon: "🏥",
    tagline: "여학생 비율 높음, 면접·인성 비중 ↑",
    message: "필기는 기본, 면접·인성에서 최종 결정. 정보가 적어 멘토링이 결정적입니다.",
    heroGradient: "from-pink-600 via-rose-700 to-slate-900",
    accentColor: "pink",
    badge: "면접·인성 핵심",
    schedule: [
      { phase: "원서 접수", date: "2026.06 ~ 07" },
      { phase: "1차 필기시험", date: "2026.07" },
      { phase: "체력검정·신체검사", date: "2026.08" },
      { phase: "2차 면접", date: "2026.10" },
      { phase: "최종 발표", date: "2026.11" },
    ],
    subjects: [
      { name: "국어", detail: "수능 기조" },
      { name: "수학", detail: "문과·이과 모두 가능" },
      { name: "영어", detail: "수능 기조" },
      { name: "한국사", detail: "근현대사" },
    ],
    fitness: [
      { name: "1.5km 달리기", standard: "남 7'30\" 이내 / 여 8'30\" 이내" },
      { name: "윗몸일으키기", standard: "1분 / 여 50회 이상" },
      { name: "팔굽혀펴기", standard: "2분 / 여 30회 이상" },
    ],
    interview: [
      { name: "AI 인성 면접", detail: "표정·발화 패턴 분석" },
      { name: "면접관 대면", detail: "간호사로서의 사명·국가관" },
      { name: "심층 면접", detail: "공감 능력·의료 윤리 사례" },
    ],
    cutoffs: [
      { year: 2021, cut: 246 },
      { year: 2022, cut: 250 },
      { year: 2023, cut: 248 },
      { year: 2024, cut: 253 },
      { year: 2025, cut: 251 },
    ],
    mentors: [
      { initial: "오", name: "오O진", school: "국간사 67기", intro: "면접·인성 노하우" },
      { initial: "신", name: "신O아", school: "국간사 66기", intro: "내성적 → 면접 자신감" },
      { initial: "백", name: "백O연", school: "국간사 68기", intro: "체력 1년 빌드업" },
    ],
  },
  police: {
    slug: "police",
    name: "경찰대학교",
    shortName: "경찰대반",
    icon: "👮",
    tagline: "경쟁률 최고. 체력·면접에서 갈립니다.",
    message: "정원 50명. 1차는 동점자 다수, 결국 체력 PT와 면접에서 결정됩니다.",
    heroGradient: "from-indigo-700 via-blue-900 to-slate-900",
    accentColor: "indigo",
    badge: "경쟁률 최고",
    schedule: [
      { phase: "원서 접수", date: "2026.06 ~ 07" },
      { phase: "1차 필기시험", date: "2026.07" },
      { phase: "체력검사·신체검사", date: "2026.10" },
      { phase: "2차 면접", date: "2026.11" },
      { phase: "최종 발표", date: "2026.12" },
    ],
    subjects: [
      { name: "국어", detail: "수능 기조 + 법치·시사" },
      { name: "수학", detail: "이과·문과 모두 가능" },
      { name: "영어", detail: "수능 기조" },
      { name: "한국사", detail: "근현대사 + 법제사" },
    ],
    fitness: [
      { name: "50m 달리기", standard: "남 8.4초 / 여 9.7초 이내" },
      { name: "윗몸일으키기", standard: "1분 / 남 60회 / 여 50회 이상" },
      { name: "팔굽혀펴기", standard: "1분 / 남 58회 / 여 50회 이상 (정자세)" },
      { name: "악력", standard: "남 64kg / 여 44kg 이상" },
      { name: "왕복오래달리기", standard: "남 90회 / 여 70회 이상" },
    ],
    interview: [
      { name: "AI 인성 면접", detail: "표정·발화 패턴 분석" },
      { name: "면접관 대면", detail: "법치의식·시사·자기소개" },
      { name: "심층 면접", detail: "윤리 딜레마 상황 판단" },
    ],
    cutoffs: [
      { year: 2021, cut: 265 },
      { year: 2022, cut: 270 },
      { year: 2023, cut: 268 },
      { year: 2024, cut: 274 },
      { year: 2025, cut: 272 },
    ],
    mentors: [
      { initial: "유", name: "유O재", school: "경찰대 41기", intro: "재수 후 합격" },
      { initial: "남", name: "남O석", school: "경찰대 40기", intro: "체력 PT 1점차 합격" },
      { initial: "권", name: "권O희", school: "경찰대 41기", intro: "여학생 경쟁률 전략" },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(CLASSES).map((slug) => ({ slug }))
}

export default async function ClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = CLASSES[slug]
  if (!data) return notFound()
  return <ClassPageClient data={data} />
}
