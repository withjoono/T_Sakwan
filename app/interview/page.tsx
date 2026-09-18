import type { Metadata } from "next"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, graph } from "@/lib/seo"
import InterviewClient from "./interview-client"

export const metadata: Metadata = {
  title: "사관학교·경찰대 2차 면접 대비 — 학교별 면접 방식과 빈출 질문 100선 | T사관",
  description:
    "2차 전형은 AI 인성 면접 → 신체검사 → 체력검정 → 면접관 대면 4단계로 진행됩니다. 육사 20분, 해사·국간사 25분, 공사·경찰대 30분으로 학교마다 소요 시간과 평가축이 다릅니다. 국가관·리더십·시사 카테고리별 빈출 질문 100선과 합격생 모의면접까지 한 페이지에서 준비하세요.",
  alternates: { canonical: abs("/interview") },
  openGraph: {
    url: abs("/interview"),
    title: "사관학교·경찰대 2차 면접 대비 — 학교별 면접 방식과 빈출 질문 100선",
    description:
      "면접 4단계 구조, 학교별 소요 시간·평가축 비교표, 빈출 질문 100선, 합격생 모의면접.",
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["2차 면접", "/interview"],
          ]),
        )}
      />
      <InterviewClient />
    </>
  )
}
