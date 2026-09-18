import type { Metadata } from "next"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, course, graph } from "@/lib/seo"
import MentoringClient from "./mentoring-client"

const DESCRIPTION =
  "육·공·해·국간사·경찰대 실제 합격생이 한 명의 수험생을 맡아 주 1회 화상으로 플래너 실행 여부와 주간 학습 부분 테스트, 체력검정 준비 상태를 점검합니다. 월 1회 학부모 상담과 월 1회 학생 상담이 포함되며, 정규 프로그램은 월 48만원입니다."

export const metadata: Metadata = {
  title: "사관·경찰대 합격생 1:1 멘토링 — 주 1회 화상 관리 | T사관",
  description: DESCRIPTION,
  alternates: { canonical: abs("/mentoring") },
  openGraph: {
    url: abs("/mentoring"),
    title: "사관·경찰대 합격생 1:1 멘토링 — 주 1회 화상 관리",
    description:
      "합격생 멘토가 주 1회 화상으로 플래너·학습 테스트·체력을 관리하고, 월 1회 학부모·학생 상담을 진행합니다.",
  },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["멘토링", "/mentoring"],
          ]),
          course({
            name: "사관 멘토링 정규 프로그램",
            description: DESCRIPTION,
            path: "/mentoring",
            mode: "online",
          }),
        )}
      />
      <MentoringClient />
    </>
  )
}
