import { Bullets, FaqList, Section, Table } from "@/app/admission/_components"
import { FeatureGuide, SCHOOL_LINKS } from "@/components/feature-guide"
import { APPLY_COMPARE, FITNESS_COMPARE, HUB_FAQ, SIMULTANEOUS_EXAM, Y2028_STATUS } from "@/lib/admission"

export const PLANNER_FAQ = [HUB_FAQ[1], HUB_FAQ[5], HUB_FAQ[0]]

export default function PlannerGuide() {
  return (
    <FeatureGuide
      eyebrow="수험 일정 가이드"
      title="사관학교·경찰대 준비, 1년 계획은 이 날짜에서 거꾸로 세웁니다"
      lead="원서접수, 1차 필기, 체력검정 기준을 알아야 공부량과 운동량을 나눌 수 있습니다. 아래는 각 학교 2027학년도 모집요강의 일정과 체력 기준입니다."
      links={[["모의고사", "/mock"], ["1차 합불 예측", "/1cha"], ...SCHOOL_LINKS]}
    >
      <Section title="원서접수와 1차 시험 일정" lead={SIMULTANEOUS_EXAM.detail}>
        <Table data={APPLY_COMPARE} />
      </Section>
      <Section title="체력검정 과락 기준" lead="운동 인증 목표는 지망 학교의 과락선보다 여유 있게 잡으세요.">
        <Table data={FITNESS_COMPARE} />
      </Section>
      <Section title="2028학년도 수험생이 확인할 것" lead={Y2028_STATUS.headline}>
        <Bullets items={[...Y2028_STATUS.confirmed, ...Y2028_STATUS.pending]} />
        <Bullets marker="☐" items={Y2028_STATUS.checklist} />
      </Section>
      <Section title="자주 묻는 질문">
        <FaqList items={PLANNER_FAQ} />
      </Section>
    </FeatureGuide>
  )
}
