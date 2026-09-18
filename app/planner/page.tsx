import type { Metadata } from "next"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, graph } from "@/lib/seo"
import PlannerClient from "./planner-client"

export const metadata: Metadata = {
  title: "사관·경찰 스터디플래너 — 반별 학습량 랭킹과 운동 인증 | T사관",
  description:
    "같은 학교를 준비하는 반 친구들과 어제 학습량이 매일 비교되는 플래너입니다. 육사반·공사반·해사반·국간사반·경찰대반 학습량 랭킹, 1주일 누적 운동 인증 랭킹, 합격생 멘토의 플래너 검사 피드백까지 한 화면에서 확인합니다. 체력은 면접 기간 벼락치기가 통하지 않습니다.",
  alternates: { canonical: abs("/planner") },
  openGraph: {
    url: abs("/planner"),
    title: "사관·경찰 스터디플래너 — 반별 학습량 랭킹과 운동 인증",
    description:
      "반별 학습량 랭킹, 운동 인증 누적 랭킹, 합격생 멘토의 플래너 검사 피드백.",
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["플래너", "/planner"],
          ]),
        )}
      />
      <PlannerClient />
    </>
  )
}
