import { getSchool, SCHOOL_SLUGS, ADMISSION_UPDATED } from "@/lib/admission"
import { Table, Bullets } from "@/app/admission/_components"
import type { AdmissionSchool, SchoolSlug } from "@/lib/admission/types"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ClassPageClient from "./class-page-client"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, course, graph } from "@/lib/seo"

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
  mentors: { initial: string; name: string; school: string; intro: string }[]
}

const CLASSES: Record<SchoolSlug, Omit<ClassData, "name" | "tagline" | "message" | "badge">> = {
  army: {
    slug: "army",
    shortName: "육사반",
    icon: "🟢",
    heroGradient: "from-green-700 via-emerald-800 to-slate-900",
    accentColor: "green",
    mentors: [
      { initial: "김", name: "김O준", school: "육사 24기", intro: "1차 점프 60→78점" },
      { initial: "박", name: "박O서", school: "육사 23기", intro: "재수 끝에 합격" },
      { initial: "이", name: "이O민", school: "육사 25기", intro: "체력 8주 단축" },
    ],
  },
  airforce: {
    slug: "airforce",
    shortName: "공사반",
    icon: "🔷",
    heroGradient: "from-sky-700 via-blue-800 to-slate-900",
    accentColor: "sky",
    mentors: [
      { initial: "정", name: "정O호", school: "공사 73기", intro: "시력 변수 미리 체크" },
      { initial: "한", name: "한O은", school: "공사 74기", intro: "공간능력 만점 비결" },
      { initial: "윤", name: "윤O아", school: "공사 73기", intro: "면접 시사 답변 설계" },
    ],
  },
  navy: {
    slug: "navy",
    shortName: "해사반",
    icon: "🔵",
    heroGradient: "from-blue-700 via-indigo-800 to-slate-900",
    accentColor: "blue",
    mentors: [
      { initial: "조", name: "조O린", school: "해사 80기", intro: "실전 가이드" },
      { initial: "강", name: "강O찬", school: "해사 79기", intro: "비수도권 1년 합격" },
      { initial: "임", name: "임O율", school: "해사 81기", intro: "신체 기준 통과 코칭" },
    ],
  },
  nursing: {
    slug: "nursing",
    shortName: "국간사반",
    icon: "🏥",
    heroGradient: "from-pink-600 via-rose-700 to-slate-900",
    accentColor: "pink",
    mentors: [
      { initial: "오", name: "오O진", school: "국간사 67기", intro: "면접·인성 노하우" },
      { initial: "신", name: "신O아", school: "국간사 66기", intro: "내성적 → 면접 자신감" },
      { initial: "백", name: "백O연", school: "국간사 68기", intro: "체력 1년 빌드업" },
    ],
  },
  police: {
    slug: "police",
    shortName: "경찰대반",
    icon: "👮",
    heroGradient: "from-indigo-700 via-blue-900 to-slate-900",
    accentColor: "indigo",
    mentors: [
      { initial: "유", name: "유O재", school: "경찰대 41기", intro: "재수 후 합격" },
      { initial: "남", name: "남O석", school: "경찰대 40기", intro: "체력 PT 1점차 합격" },
      { initial: "권", name: "권O희", school: "경찰대 41기", intro: "여학생 경쟁률 전략" },
    ],
  },
}

export function generateStaticParams() {
  return SCHOOL_SLUGS.map((slug) => ({ slug }))
}

/** 모집요강 데이터에서 설명문과 화면을 함께 생성한다. */
function describe(data: ClassData, school: AdmissionSchool) {
  return `${school.headline} ${data.shortName}에서 전형 일정·1차 출제범위·체력검정·면접 기준을 확인하고 모의고사를 준비하세요.`
}

function getClass(slug: string) {
  if (!SCHOOL_SLUGS.some((item) => item === slug)) return undefined
  const school = getSchool(slug)
  if (!school) return undefined
  const data = {
    ...CLASSES[school.slug],
    name: school.name,
    tagline: school.distinctive,
    message: school.headline,
    badge: "2027학년도 모집요강",
  }
  return { school, data }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getClass(slug)
  if (!entry) return {}
  const { data, school } = entry

  const path = `/class/${data.slug}`
  const title = `${data.name} 준비 ${data.shortName} — 전형 일정·1차 과목·체력검정·면접 | T사관`
  const description = describe(data, school)

  return {
    title,
    description,
    alternates: { canonical: abs(path) },
    openGraph: {
      url: abs(path),
      title: `${data.name} 준비 ${data.shortName} — 전형 일정·1차 과목·체력검정·면접`,
      description,
    },
  }
}

export default async function ClassPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = getClass(slug)
  if (!entry) return notFound()
  const { data, school } = entry

  const path = `/class/${data.slug}`

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            [data.shortName, path],
          ]),
          course({
            name: `${data.name} 대비 ${data.shortName}`,
            description: describe(data, school),
            path,
          }),
        )}
      />
      <ClassPageClient data={data} sourceDoc={school.sourceDoc} updated={ADMISSION_UPDATED}
        uncertain={school.uncertain} panels={{
          schedule: <Table data={school.schedule} />,
          subject: <><p>{school.exam.lead}</p><Table data={school.exam.timetable} /><Table data={school.exam.scope} /></>,
          fitness: <><p>{school.fitness.lead}</p><p className="font-semibold">{school.fitness.cutoff}</p><Table data={school.fitness.table} /><Bullets items={school.fitness.notes} /></>,
          interview: <><p>{school.interview.lead}</p><Table data={school.interview.table} /><Bullets items={school.interview.notes} /></>,
          physical: <><p>{school.medical.lead}</p><Table data={school.medical.table} /><Bullets items={school.medical.notes} /></>,
        }} />
    </>
  )
}
