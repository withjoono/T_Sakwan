import { Bullets, Section, SubHeading, Table } from "@/app/admission/_components"
import { FeatureGuide, SCHOOL_LINKS } from "@/components/feature-guide"
import { FITNESS_COMPARE, SCHOOL_LIST } from "@/lib/admission"

export default function InterviewGuide() {
  return (
    <FeatureGuide
      eyebrow="2차 시험 요강 정리"
      title="학교별 2차 면접, 모집요강에는 이렇게 적혀 있습니다"
      lead="면접 구성과 판정 방식은 학교마다 다릅니다. 아래는 각 학교 2027학년도 모집요강에 적힌 면접·체력 기준을 그대로 옮긴 것입니다."
      links={[["생기부 진단", "/sanggibu"], ["합격생 멘토링", "/mentoring"], ...SCHOOL_LINKS]}
    >
      <Section title="학교별 면접 구성과 판정">
        {SCHOOL_LIST.map((s) => (
          <div key={s.slug} className="flex flex-col gap-3">
            <SubHeading>
              {s.icon} {s.name}
            </SubHeading>
            <p className="text-sm leading-7 text-[#637788]">{s.interview.lead}</p>
            <Table data={s.interview.table} dense />
            <Bullets items={s.interview.notes} />
          </div>
        ))}
      </Section>
      <Section title="면접과 함께 보는 체력검정 기준">
        <Table data={FITNESS_COMPARE} />
      </Section>
    </FeatureGuide>
  )
}
