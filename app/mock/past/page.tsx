import type { Metadata } from "next"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, graph } from "@/lib/seo"
import PastExamClient from "./past-exam-client"

export const metadata: Metadata = {
  title: "사관학교·경찰대 1차 기출 2022–2026 — OMR 자동 채점 | T사관",
  description:
    "사관학교와 경찰대 1차 기출을 2022년부터 2026년까지 연도별로 골라 실전처럼 응시합니다. 국어 30문항·영어 30문항·수학 30문항(공통 객관식 1–15, 공통 주관식 16–22, 선택과목 23–30)의 사관학교 전용 형식 그대로, 답안만 OMR에 입력하면 자동 채점과 작년 합격선 매칭까지 즉시 확인됩니다.",
  alternates: { canonical: abs("/mock/past") },
  openGraph: {
    url: abs("/mock/past"),
    title: "사관학교·경찰대 1차 기출 2022–2026 — OMR 자동 채점",
    description:
      "2022–2026 기출을 전용 OMR로 응시 → 자동 채점 → 작년 합격선 매칭까지 한 화면에서.",
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
            ["역대 기출", "/mock/past"],
          ]),
        )}
      />
      <PastExamClient />
    </>
  )
}
