import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, faqPage, graph } from "@/lib/seo"
import {
  ADMISSION_UPDATED,
  DISCLAIMER,
  MEDICAL_DISCLAIMER,
  SCHOOL_SLUGS,
  SIMULTANEOUS_EXAM,
  getSchool,
} from "@/lib/admission"
import type { AdmissionSchool } from "@/lib/admission"
import {
  AdmissionCTA,
  AdmissionHero,
  AlertBox,
  Bullets,
  FactGrid,
  FaqList,
  Section,
  SchoolSwitcher,
  SourceNote,
  SubHeading,
  Table,
  Toc,
} from "../_components"

export function generateStaticParams() {
  return SCHOOL_SLUGS.map((school) => ({ school }))
}

function describe(s: AdmissionSchool) {
  return [
    s.headline,
    `모집정원 ${s.quotaTotal}.`,
    `1차 합격 배수, 전형별 배점, 내신 환산표, 체력 과락선, 신체검사 기준까지 요강 원문 기준으로 정리했습니다.`,
  ].join(" ")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ school: string }>
}): Promise<Metadata> {
  const { school } = await params
  const s = getSchool(school)
  if (!s) return {}

  const path = `/admission/${s.slug}`
  const title = `2027 ${s.name} 전형 안내 — 일정·1차 필기·모집인원·배점·체력 | T사관`
  const description = describe(s)

  return {
    title,
    description,
    alternates: { canonical: abs(path) },
    openGraph: {
      url: abs(path),
      title: `2027 ${s.name} 전형 안내 — 요강 원문 기준`,
      description,
    },
  }
}

function toc(s: AdmissionSchool) {
  return [
    { id: "summary", label: "한눈에 보기" },
    { id: "schedule", label: "전형 일정" },
    { id: "exam", label: "1차 필기시험" },
    { id: "quota", label: "모집인원·전형 구조" },
    { id: "weights", label: "전형별 반영 배점" },
    { id: "record", label: `학생부(내신)${s.korhist ? "·한국사" : ""}` },
    { id: "fitness", label: "체력검정" },
    { id: "medical", label: "신체검사" },
    { id: "interview", label: "면접" },
    { id: "changes", label: "2027학년도 변경사항" },
    { id: "y2028", label: "2028학년도 대비" },
    { id: "venues", label: "고사장" },
    { id: "faq", label: "자주 묻는 질문" },
  ]
}

export default async function SchoolAdmissionPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school } = await params
  const s = getSchool(school)
  if (!s) return notFound()

  const path = `/admission/${s.slug}`
  const isPolice = s.slug === "police"

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["입시 총정리", "/admission"],
            [s.name, path],
          ]),
          faqPage(s.faq),
          {
            "@type": "Article",
            "@id": abs(`${path}#article`),
            headline: `2027학년도 ${s.name} 전형 안내`,
            description: describe(s),
            inLanguage: "ko-KR",
            url: abs(path),
            dateModified: ADMISSION_UPDATED,
            publisher: { "@id": abs("/#organization") },
            isPartOf: { "@id": abs("/#website") },
          },
        )}
      />

      <AdmissionHero
        badge={`${s.icon} ${s.name} · ${s.cohort}`}
        title={`2027학년도 ${s.name} 전형 안내`}
        lead={s.headline}
        gradient={s.heroGradient}
        updated={ADMISSION_UPDATED}
      />

      <SchoolSwitcher current={s.slug} />

      <Section id="summary" title="한눈에 보기" lead={s.distinctive}>
        <FactGrid items={s.keyFacts} />
        <AlertBox tone="warn" title={SIMULTANEOUS_EXAM.headline}>
          <p>{SIMULTANEOUS_EXAM.detail}</p>
          <p>
            <Link href="/admission" className="font-semibold underline underline-offset-4">
              5개 기관 접수·시험 일정 비교표 보기 →
            </Link>
          </p>
        </AlertBox>
        <Toc items={toc(s)} />
      </Section>

      <Section
        id="schedule"
        title="전형 일정"
        lead={`원서접수는 ${s.applyPeriod}, 1차 필기시험은 ${s.examDate}입니다.`}
        tone="muted"
      >
        <Table data={s.schedule} />
      </Section>

      <Section id="exam" title="1차 필기시험" lead={s.exam.lead}>
        <AlertBox tone="warn" title={s.exam.entry} />
        <SubHeading>시험 시간표</SubHeading>
        <Table data={s.exam.timetable} />
        <SubHeading>출제범위</SubHeading>
        <Table data={s.exam.scope} />
        <SubHeading>1차 합격 배수</SubHeading>
        <Table data={s.exam.multiplier} />
        <SubHeading>점수 산출</SubHeading>
        <Bullets items={s.exam.scoring} />
      </Section>

      <Section id="quota" title="모집인원과 전형 구조" tone="muted">
        <Table data={s.quota} />
        <Bullets items={s.quotaNotes} />
      </Section>

      <Section id="weights" title="전형별 반영 배점">
        <Table data={s.weights} />
        <Bullets items={s.weightsNotes} />
      </Section>

      <Section id="record" title={`학생부(내신)${s.korhist ? "·한국사" : ""} 반영`} lead={s.record.lead} tone="muted">
        <AlertBox tone="note" title="1등급과 9등급의 차이는 총점에서 이만큼입니다.">
          <p>{s.record.impact}</p>
        </AlertBox>
        <SubHeading>교과 등급별 환산점수</SubHeading>
        <Table data={s.record.grade} />
        {s.record.attendance && (
          <>
            <SubHeading>출결</SubHeading>
            <Table data={s.record.attendance} dense />
          </>
        )}
        <Bullets items={s.record.notes} />
        <SubHeading>{s.korhist ? "한국사능력검정시험 가산점" : "한국사 반영"}</SubHeading>
        {s.korhist && <Table data={s.korhist} dense />}
        <Bullets items={s.korhistNotes} />
      </Section>

      <Section id="fitness" title="체력검정" lead={s.fitness.lead}>
        <AlertBox tone="warn" title={s.fitness.cutoff} />
        <Table data={s.fitness.table} />
        <Bullets items={s.fitness.notes} />
      </Section>

      <Section id="medical" title="신체검사" lead={s.medical.lead} tone="muted">
        <Table data={s.medical.table} />
        <Bullets items={s.medical.notes} />
        <AlertBox tone="info" title={MEDICAL_DISCLAIMER} />
      </Section>

      <Section id="interview" title="면접" lead={s.interview.lead}>
        <Table data={s.interview.table} />
        <Bullets items={s.interview.notes} />
      </Section>

      <Section id="changes" title="2027학년도 변경사항" tone="muted">
        {s.changes2027.items.length > 0 ? (
          <>
            <Bullets items={s.changes2027.items} marker="▸" />
            <p className="text-[13px] leading-relaxed text-muted-foreground">{s.changes2027.note}</p>
          </>
        ) : (
          <AlertBox tone="info" title="요강에 「변경사항」 절이 없습니다.">
            <p>{s.changes2027.note}</p>
          </AlertBox>
        )}
        {s.uncertain.length > 0 && (
          <>
            <SubHeading>⚠️ 요강 확인이 필요한 항목</SubHeading>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              요강 자체가 서로 다르게 적어 두었거나, 원문 판독이 불확실한 값입니다. 아는 척하지 않고 그대로
              남겨 둡니다.
            </p>
            <Bullets items={s.uncertain} marker="⚠" />
          </>
        )}
      </Section>

      <Section id="y2028" title="2028학년도 대비">
        {s.y2028.confirmed.length > 0 ? (
          <>
            <AlertBox tone="info" title="현재 확정 고지된 내용">
              <ul className="space-y-1">
                {s.y2028.confirmed.map((c) => (
                  <li key={c}>· {c}</li>
                ))}
              </ul>
            </AlertBox>
            <Bullets items={s.y2028.pending} />
          </>
        ) : (
          <>
            <AlertBox tone="info" title="2028학년도 시행계획은 아직 공개 전입니다. 공개 즉시 이 페이지를 갱신합니다." />
            <Bullets items={s.y2028.pending} />
          </>
        )}
        <p className="text-sm leading-relaxed text-muted-foreground">
          5개 기관 전체의 2028학년도 확정·미확정 항목과 공고 시 확인할 체크리스트는{" "}
          <Link href="/admission#y2028" className="font-medium text-foreground underline underline-offset-4">
            입시 총정리 허브
          </Link>
          에 모아 두었습니다.
        </p>
      </Section>

      <Section id="venues" title="고사장" tone="muted">
        <Table data={s.venues} dense />
      </Section>

      <Section id="faq" title="자주 묻는 질문">
        <FaqList items={s.faq} />
      </Section>

      <AdmissionCTA cta={s.cta} />

      <Section title={`${s.short} 준비, 다음 단계`} tone="muted">
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href={`/class/${s.slug}`} className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary">
            <div className="text-sm font-semibold text-foreground">{s.short}반 클래스</div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              학교별 반에서 학습량·모의고사 성적을 같은 목표를 가진 사람들과 비교합니다.
            </p>
          </Link>
          <Link href="/mock" className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary">
            <div className="text-sm font-semibold text-foreground">전용 모의고사</div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {isPolice ? "경찰대 형식(45·45·25문항)" : "사관학교 형식(30문항 3과목)"} 그대로 응시하고 채점합니다.
            </p>
          </Link>
          <Link href="/1cha" className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary">
            <div className="text-sm font-semibold text-foreground">1차 합불예측</div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              제출 분포를 바탕으로 1차 통과 가능성을 계산합니다.
            </p>
          </Link>
        </div>
      </Section>

      <SchoolSwitcher current={s.slug} />

      <SourceNote
        sourceDoc={s.sourceDoc}
        updated={ADMISSION_UPDATED}
        disclaimer={DISCLAIMER}
        extra={MEDICAL_DISCLAIMER}
        homepage={s.homepage}
        contact={s.contact}
      />
    </>
  )
}
