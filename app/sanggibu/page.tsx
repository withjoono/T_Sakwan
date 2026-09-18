import type { Metadata } from "next"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, graph } from "@/lib/seo"
import SanggibuClient from "./sanggibu-client"

export const metadata: Metadata = {
  title: "사관·경찰대 생기부 AI 진단 — 면접관 키워드로 4대 평가축 분석 | T사관",
  description:
    "일반 대입과 평가 기준이 완전히 다른 사관학교·경찰대 생활기록부를 리더십·통솔력, 국가관·안보의식, 체육 활동·체력, 학업 역량 네 개 축으로 자동 분류합니다. 생기부 PDF를 올리면 키워드를 추출하고 합격생 통계 기반 동아리·봉사·독서·수상 활동을 추천합니다. AI 진단 1회 무료.",
  alternates: { canonical: abs("/sanggibu") },
  openGraph: {
    url: abs("/sanggibu"),
    title: "사관·경찰대 생기부 AI 진단 — 면접관 키워드로 4대 평가축 분석",
    description:
      "리더십·국가관·체력·학업 역량 4대 축 자동 분류와 합격생 기반 활동 추천. AI 진단 1회 무료.",
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["생기부 진단", "/sanggibu"],
          ]),
        )}
      />
      <SanggibuClient />
    </>
  )
}
