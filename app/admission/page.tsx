import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, faqPage, graph, SITE_NAME } from "@/lib/seo"
import {
  ADMISSION_UPDATED,
  APPLY_COMPARE,
  DISCLAIMER,
  EXAM_COMPARE,
  FITNESS_COMPARE,
  HUB_FAQ,
  KORHIST_COMPARE,
  QUOTA_COMPARE,
  RECORD_IMPACT,
  SCHOOL_LIST,
  SIMULTANEOUS_EXAM,
  SOURCE_LINE,
  Y2028_STATUS,
} from "@/lib/admission"
import {
  AdmissionCTA,
  AdmissionHero,
  AlertBox,
  Bullets,
  FaqList,
  Section,
  SchoolSwitcher,
  SourceNote,
  Table,
  Toc,
} from "./_components"

const PATH = "/admission"

const TITLE = "2027 사관학교·경찰대 대학별 전형 안내 — 요강 원문 그대로 | T사관"
const DESCRIPTION =
  "육사·해사·공사·국간사·경찰대 2027학년도 전형을 대학별로 정리했습니다. 원서접수는 사관학교 6.19~6.29, 경찰대는 5.4~5.28. 1차 시험은 8월 1일 토요일로 다섯 곳이 같은 날입니다. 모집인원·배점·내신 영향력·체력 과락선까지 요강 원문 기준."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: abs(PATH) },
  openGraph: {
    url: abs(PATH),
    title: "2027 사관학교·경찰대 대학별 전형 안내 — 요강 원문 그대로",
    description: DESCRIPTION,
  },
}

const TOC = [
  { id: "same-day", label: "8월 1일 동시 시험과 접수 시기" },
  { id: "schools", label: "대학별 페이지 5개" },
  { id: "quota", label: "모집인원·전형 구조 비교" },
  { id: "exam", label: "1차 필기 구조 — 사관 vs 경찰대" },
  { id: "record", label: "내신 영향력 비교" },
  { id: "fitness", label: "체력 과락선 비교" },
  { id: "korhist", label: "한국사 반영 비교" },
  { id: "y2028", label: "2028학년도 현재 상태" },
  { id: "faq", label: "자주 묻는 질문" },
]

export default function AdmissionHubPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["입시 총정리", PATH],
          ]),
          faqPage(HUB_FAQ),
          {
            "@type": "Article",
            "@id": abs(`${PATH}#article`),
            headline: "2027학년도 사관학교·경찰대 대학별 전형 안내",
            description: DESCRIPTION,
            inLanguage: "ko-KR",
            url: abs(PATH),
            dateModified: ADMISSION_UPDATED,
            publisher: { "@id": abs("/#organization") },
            isPartOf: { "@id": abs("/#website") },
          },
        )}
      />

      <AdmissionHero
        badge={`${SITE_NAME} 입시 총정리`}
        title="2027 사관학교·경찰대 전형 안내, 요강 원문 그대로"
        lead="육군·해군·공군사관학교, 국군간호사관학교, 경찰대학의 2027학년도 전형을 대학별로 정리했습니다. 이 페이지의 모든 숫자는 각 학교가 공표한 모집요강 원문에서 직접 가져왔습니다."
        updated={ADMISSION_UPDATED}
      />

      <SchoolSwitcher />

      <Section id="same-day" title="먼저 알아야 할 것 — 8월 1일, 다섯 곳이 같은 날 시험을 봅니다">
        <AlertBox tone="warn" title={SIMULTANEOUS_EXAM.headline}>
          <p>{SIMULTANEOUS_EXAM.detail}</p>
        </AlertBox>
        <Table data={APPLY_COMPARE} />
        <AlertBox tone="note" title="경찰대를 쓸지 말지는 5월에 이미 결정됩니다.">
          <p>
            사관학교 원서접수가 시작되는 6월 19일보다 3주 앞서 경찰대 접수가 끝납니다. 6월에 이 사실을 알게 된
            학생은 이미 선택지 하나를 잃은 상태입니다. 두 곳을 모두 고려한다면 늦어도 4월에는 방향을 정해야
            합니다.
          </p>
        </AlertBox>
        <Toc items={TOC} />
      </Section>

      <Section
        id="schools"
        title="대학별 전형 안내"
        lead="학교 하나당 한 페이지입니다. 일정·1차 필기·모집인원·배점·내신·체력·신체검사·2027 변경사항·2028 대비를 그 학교 기준으로만 모아 두었습니다."
        tone="muted"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {SCHOOL_LIST.map((s) => (
            <Link
              key={s.slug}
              href={`/admission/${s.slug}`}
              className="group rounded-2xl border bg-card p-5 transition-colors hover:border-primary"
            >
              <div className="flex items-baseline gap-2">
                <span aria-hidden="true">{s.icon}</span>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary">{s.name}</h3>
                <span className="text-xs text-muted-foreground">{s.cohort}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{s.quotaTotal}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.distinctive}</p>
              <p className="mt-3 text-[13px] text-muted-foreground">
                원서접수 {s.applyPeriod.split(" / ").map((p) => p.replaceAll("2026.", "")).join(" / ")} · 1차{" "}
                {s.examDate.replace("2026.", "")}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="quota"
        title="모집인원과 전형 구조"
        lead="다섯 곳을 합쳐 875명입니다. 사관학교 4곳은 우선선발과 종합선발로 나뉘고, 경찰대만 구분 없이 수능이 절반입니다."
      >
        <Table data={QUOTA_COMPARE} />
      </Section>

      <Section
        id="exam"
        title="1차 필기 — 같은 날인데 문제 구조가 다릅니다"
        lead="사관학교 4곳은 시간표와 과목 구성이 사실상 같습니다. 경찰대만 다릅니다."
        tone="muted"
      >
        <Table data={EXAM_COMPARE} />
        <AlertBox tone="note" title="“사관학교 준비하다가 경찰대도 같이”가 안 되는 구조입니다.">
          <p>
            국어·영어는 경찰대가 문항당 20% 빠듯하고, 수학은 선택과목이 없어 범위가 좁은 대신 주관식 5문항이
            있습니다. 같은 실력이어도 시간 배분 훈련을 따로 해야 합니다.
          </p>
        </AlertBox>
      </Section>

      <Section
        id="record"
        title="내신 영향력 — 학교마다 8배 차이가 납니다"
        lead="“내신 3~4등급인데 되나요”는 상담에서 가장 많이 받는 질문입니다. 답이 하나가 아닙니다. 아래는 각 학교 요강의 등급별 환산표로 직접 계산한 1등급과 9등급의 총점 차이입니다."
      >
        <Table data={RECORD_IMPACT} />
        <AlertBox tone="note" title="내신이 약하다면 육사 적성우수와 해사 일반우선처럼 1차 필기 비중이 큰 전형을 봐야 합니다.">
          <p>
            육사 적성우수는 1등급과 9등급의 차이가 1,000점 중 7점(0.7%)입니다. 국간사 일반우선은 500점 중
            27점(5.4%), 공사 학교장추천은 1,000점 중 48점(4.8%)입니다. 같은 내신으로도 어느 학교·전형을
            고르느냐에 따라 결과가 갈립니다.
          </p>
        </AlertBox>
      </Section>

      <Section
        id="fitness"
        title="체력 과락선 — 공사와 해사가 47초 차이"
        lead="목표 학교를 정하지 않고 체력을 준비하면 기준이 맞지 않습니다."
        tone="muted"
      >
        <Table data={FITNESS_COMPARE} />
      </Section>

      <Section id="korhist" title="한국사 반영 — 사관학교는 가산점, 경찰대는 감점">
        <Table data={KORHIST_COMPARE} />
      </Section>

      <Section id="y2028" title="2028학년도 — 현재 확정된 것은 한 건뿐입니다" tone="muted">
        <AlertBox tone="info" title={Y2028_STATUS.headline} />
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">확정 고지된 것</p>
          <Bullets items={Y2028_STATUS.confirmed} />
          <p className="pt-2 text-sm font-semibold text-foreground">아직 공개 전인 것</p>
          <Bullets items={Y2028_STATUS.pending} />
          <p className="pt-2 text-sm font-semibold text-foreground">시행계획이 나오면 이 순서로 확인합니다</p>
          <Bullets items={Y2028_STATUS.checklist} marker="□" />
        </div>
      </Section>

      <Section id="faq" title="자주 묻는 질문">
        <FaqList items={HUB_FAQ} />
      </Section>

      <AdmissionCTA
        cta={{
          kind: "mock",
          title: "내 점수는 지금 어디쯤일까",
          body: "실제 1차 시험과 같은 형식으로 풀고, 같은 회차를 본 사람들 사이에서 내 위치를 확인합니다.",
          href: "/mock",
          label: "T사관 전용 모의고사 보기",
        }}
      />

      <SchoolSwitcher />

      <SourceNote sourceDoc={SOURCE_LINE.replace("출처: ", "")} updated={ADMISSION_UPDATED} disclaimer={DISCLAIMER} />
    </>
  )
}
