import { Bullets, FaqList, Section, SubHeading, Table } from "@/app/admission/_components"
import { FeatureGuide, SCHOOL_LINKS } from "@/components/feature-guide"
import { EXAM_COMPARE, SCHOOL_LIST, SIMULTANEOUS_EXAM } from "@/lib/admission"

export const MOCK_FAQ = [
  {
    q: "사관학교와 경찰대 1차 시험은 문항 수와 시간이 같나요?",
    a: "다릅니다. 사관학교 4곳은 국어·영어 각 30문항 50분, 수학 30문항 100분이고, 경찰대는 국어·영어 각 45문항 60분, 수학 25문항 80분입니다. 경찰대는 국어·영어 문항당 시간이 1분 20초로 사관학교(1분 40초)보다 빠듯합니다.",
  },
  {
    q: "경찰대 수학에도 선택과목이 있나요?",
    a: "없습니다. 경찰대 수학은 수학Ⅰ·Ⅱ만 출제하고, 사관학교 4곳은 수학Ⅰ·Ⅱ에 선택과목 1개를 더합니다.",
  },
  {
    q: "1차 시험은 몇 시까지 입실해야 하나요?",
    a: "사관학교 4곳은 09:00, 경찰대는 08:30이 입장 마감입니다. 마감 이후에는 응시할 수 없습니다.",
  },
]

/** /mock — 시험 형식·시간표. */
export function MockGuide() {
  return (
    <FeatureGuide
      eyebrow="1차 시험 형식 안내"
      title="사관학교·경찰대 1차 시험은 이렇게 치릅니다"
      lead="T사관 모의고사는 실제 1차 시험과 같은 과목·문항 수·시간으로 응시합니다. 아래는 각 학교 2027학년도 모집요강의 시험 형식과 교시별 시간표입니다."
      links={[["1차 기출 OMR 채점", "/mock/past"], ["1차 합불 예측", "/1cha"], ...SCHOOL_LINKS]}
    >
      <Section title="사관학교 4곳과 경찰대 비교" lead={SIMULTANEOUS_EXAM.headline}>
        <Table data={EXAM_COMPARE} />
      </Section>
      <Section title="학교별 1차 시험 시간표">
        {SCHOOL_LIST.map((s) => (
          <div key={s.slug} className="flex flex-col gap-3">
            <SubHeading>
              {s.icon} {s.name} — {s.examDate}
            </SubHeading>
            <p className="text-sm leading-7 text-[#637788]">{s.exam.lead}</p>
            <Table data={s.exam.timetable} dense />
          </div>
        ))}
      </Section>
      <Section title="자주 묻는 질문">
        <FaqList items={MOCK_FAQ} />
      </Section>
    </FeatureGuide>
  )
}

/** /mock/past — 출제범위·배수. */
export function PastGuide() {
  return (
    <FeatureGuide
      eyebrow="기출 학습 가이드"
      title="기출을 풀기 전에 확인할 학교별 출제범위"
      lead="사관학교와 경찰대는 출제범위와 점수 산출 방식이 다릅니다. 기출을 실전처럼 풀려면 지망 학교의 범위와 환산 방식부터 알아야 합니다. 아래는 각 학교 2027학년도 모집요강 기준입니다."
      links={[["모의고사", "/mock"], ["1차 합불 예측", "/1cha"], ...SCHOOL_LINKS]}
    >
      <Section title="학교별 출제범위">
        {SCHOOL_LIST.map((s) => (
          <div key={s.slug} className="flex flex-col gap-3">
            <SubHeading>
              {s.icon} {s.name}
            </SubHeading>
            <Table data={s.exam.scope} dense />
          </div>
        ))}
      </Section>
      <Section title="학교별 점수 산출 방식" lead="채점 후 원점수를 아래 산식으로 환산해 작년 합격선과 비교합니다.">
        {SCHOOL_LIST.map((s) => (
          <div key={s.slug} className="flex flex-col gap-3">
            <SubHeading>
              {s.icon} {s.short}
            </SubHeading>
            <Bullets items={s.exam.scoring} />
          </div>
        ))}
      </Section>
      <Section title="자주 묻는 질문">
        <FaqList items={MOCK_FAQ} />
      </Section>
    </FeatureGuide>
  )
}
