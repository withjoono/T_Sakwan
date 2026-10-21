import { Bullets, FaqList, Section, SubHeading, Table } from "@/app/admission/_components"
import { FeatureGuide, SCHOOL_LINKS } from "@/components/feature-guide"
import { EXAM_COMPARE, HUB_FAQ, QUOTA_COMPARE, SCHOOL_LIST, SIMULTANEOUS_EXAM } from "@/lib/admission"

export const ONECHA_FAQ = [HUB_FAQ[4], HUB_FAQ[0], HUB_FAQ[2]]

export default function OneChaGuide() {
  return (
    <FeatureGuide
      eyebrow="1차 합불 예측 가이드"
      title="사관학교 1차 시험, 합격과 불합격은 어떻게 갈리나"
      lead="가채점 원점수만으로는 합격 여부를 알 수 없습니다. 사관학교 4곳은 원점수를 표준점수로 환산한 뒤 계열·성별 모집단위별로 정해진 배수 안에 들어야 1차를 통과하고, 경찰대는 원점수 총점으로 일괄 6배수를 뽑습니다. 아래는 각 학교 2027학년도 모집요강에 적힌 기준입니다."
      links={[["1차 기출 OMR 채점", "/mock/past"], ["모의고사", "/mock"], ...SCHOOL_LINKS]}
    >
      <Section title="5개 기관 1차 시험 비교" lead={SIMULTANEOUS_EXAM.headline}>
        <Table data={EXAM_COMPARE} />
      </Section>
      <Section
        title="모집단위별 1차 합격 배수"
        lead="1차 합격 인원은 모집정원에 배수를 곱해 정합니다. 같은 점수라도 지원한 계열·성별에 따라 결과가 달라지는 이유입니다."
      >
        <Table data={QUOTA_COMPARE} />
      </Section>
      <Section
        title="학교별 1차 점수 산출 방식"
        lead="T사관 합불 예측 계산기는 아래 산식을 그대로 적용해 가채점 원점수를 환산합니다."
      >
        {SCHOOL_LIST.map((s) => (
          <div key={s.slug} className="flex flex-col gap-3">
            <SubHeading>
              {s.icon} {s.name}
            </SubHeading>
            <Bullets items={s.exam.scoring} />
          </div>
        ))}
      </Section>
      <Section title="합불 예측 계산기 사용 순서">
        <Bullets
          marker="→"
          items={[
            "지망 학교를 고릅니다. 학교마다 환산 산식과 배수가 다르므로 지원할 학교 기준으로 계산해야 합니다.",
            "인문·자연 계열과 성별 모집단위를 고릅니다. 배수가 모집단위별로 달라집니다.",
            "국어·영어·수학 가채점 원점수를 입력합니다. 수학은 공통과목과 선택과목을 나눠 넣습니다.",
            "환산 점수와 예상 합격선까지 남은 점수를 확인합니다. 예측은 참고용이며 실제 합격선은 응시자 분포에 따라 해마다 달라집니다.",
          ]}
        />
      </Section>
      <Section title="자주 묻는 질문">
        <FaqList items={ONECHA_FAQ} />
      </Section>
    </FeatureGuide>
  )
}
