import type { Metadata } from "next"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, graph } from "@/lib/seo"
import OneChaClient from "./onecha-client"

export const metadata: Metadata = {
  title: "2027 사관학교 1차 합불 예측 — 가채점 환산점수 계산기 | T사관",
  description:
    "사관학교 1차 합격은 원점수가 아니라 모집요강 산식으로 환산한 표준점수로 갈립니다. 육사·해사·공사·국간사 중 지망 학교와 인문/자연 계열, 성별 모집단위를 고르고 국어·영어·수학(공통 74점 + 선택 26점) 가채점 원점수를 넣으면 예상 합격선까지 몇 점 남았는지 계산합니다.",
  alternates: { canonical: abs("/1cha") },
  openGraph: {
    url: abs("/1cha"),
    title: "2027 사관학교 1차 합불 예측 — 가채점 환산점수 계산기",
    description:
      "가채점 원점수를 모집요강 산식 그대로 환산해 예상 합격선까지 몇 점 남았는지 알려드립니다.",
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["1차 합불 예측", "/1cha"],
          ]),
        )}
      />
      <OneChaClient />
    </>
  )
}
