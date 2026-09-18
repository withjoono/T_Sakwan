import type { Metadata } from "next"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, graph } from "@/lib/seo"
import MockHubClient from "./mock-hub-client"

export const metadata: Metadata = {
  title: "사관학교·경찰대 모의고사 — 기출 응시와 전국 석차 | T사관",
  description:
    "2022~2026년 사관학교·경찰대 1차 기출을 전용 OMR로 응시하면 자동 채점 후 작년 합격선과 바로 매칭됩니다. T사관이 직접 출제한 신유형 실전 모의고사는 7월 총 5회로, 전국 석차와 취약 단원 리포트를 제공합니다. 문과·이과 교차지원 시뮬레이션도 함께 확인하세요.",
  alternates: { canonical: abs("/mock") },
  openGraph: {
    url: abs("/mock"),
    title: "사관학교·경찰대 모의고사 — 기출 응시와 전국 석차",
    description:
      "기출 OMR 자동 채점·합격선 매칭, T사관 실전 모의 7월 5회, 전국 석차와 취약 리포트.",
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["모의고사", "/mock"],
          ]),
        )}
      />
      <MockHubClient />
    </>
  )
}
