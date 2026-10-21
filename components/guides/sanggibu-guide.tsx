import { Bullets, FaqList, Section, SubHeading, Table } from "@/app/admission/_components"
import { FeatureGuide, SCHOOL_LINKS } from "@/components/feature-guide"
import { HUB_FAQ, KORHIST_COMPARE, RECORD_IMPACT, SCHOOL_LIST } from "@/lib/admission"

export const SANGGIBU_FAQ = [HUB_FAQ[3], HUB_FAQ[6], HUB_FAQ[7]]

export default function SanggibuGuide() {
  return (
    <FeatureGuide
      eyebrow="학생부 반영 가이드"
      title="사관학교·경찰대는 학생부를 얼마나 반영하나"
      lead="학생부의 무게는 학교와 전형마다 크게 다릅니다. 내신 1등급과 9등급의 총점 차이가 1%가 안 되는 전형도 있고 5%를 넘는 전형도 있습니다. 생기부 진단을 받기 전에 지망 학교의 반영 방식부터 확인하세요. 아래는 각 학교 2027학년도 모집요강 기준입니다."
      links={[["2차 면접 대비", "/interview"], ["합격생 멘토링", "/mentoring"], ...SCHOOL_LINKS]}
    >
      <Section title="내신 1등급과 9등급의 총점 차이" lead="교과 성적만 비교한 값입니다.">
        <Table data={RECORD_IMPACT} />
      </Section>
      <Section title="학교별 학생부 반영 방식">
        {SCHOOL_LIST.map((s) => (
          <div key={s.slug} className="flex flex-col gap-3">
            <SubHeading>
              {s.icon} {s.name}
            </SubHeading>
            <Bullets items={[s.record.lead, s.record.impact, ...s.record.notes]} />
          </div>
        ))}
      </Section>
      <Section title="한국사능력검정시험 가산점">
        <Table data={KORHIST_COMPARE} />
      </Section>
      <Section title="자주 묻는 질문">
        <FaqList items={SANGGIBU_FAQ} />
      </Section>
    </FeatureGuide>
  )
}
