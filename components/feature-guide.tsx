import Link from "next/link"
import type { ReactNode } from "react"
import { ADMISSION_UPDATED, DISCLAIMER, SOURCE_LINE } from "@/lib/admission"

/**
 * 기능 페이지(/1cha·/mock·/sanggibu·/planner·/interview) 하단 정보 블록.
 *
 * 서버 컴포넌트다. 기능 화면은 클라이언트 컴포넌트라 HTML 본문이 얇아서
 * 검색엔진이 "내용 없는 페이지"로 본다. 여기서 요강 기반 설명을 빌드 시점 HTML 에 넣는다.
 * 숫자는 반드시 lib/admission 데이터에서 가져온다 — 손으로 숫자를 적지 말 것.
 */
export function FeatureGuide({
  eyebrow,
  title,
  lead,
  children,
  links,
}: {
  eyebrow: string
  title: string
  lead: string
  children: ReactNode
  links: [label: string, href: string][]
}) {
  return (
    <div className="admission-redesign border-t border-[#e0e5e7]">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-14 sm:px-6">
        <header className="mb-2">
          <p className="text-xs font-bold tracking-widest text-[#52697c]">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1f3346] sm:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-[#637788]">{lead}</p>
        </header>
        {children}
        <nav aria-label="관련 페이지" className="guide-section">
          <h2 className="mb-4 text-lg font-bold">함께 보면 좋은 페이지</h2>
          <ul className="flex flex-wrap gap-2">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block rounded-md border border-[#dae2e5] bg-[#fcfcfa] px-3 py-2 text-sm text-[#2d455b] hover:border-[#94aebf]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs leading-6 text-[#7b8892]">
          {SOURCE_LINE} · 자료 확인 {ADMISSION_UPDATED}
          <br />
          {DISCLAIMER}
        </p>
      </div>
    </div>
  )
}

export const SCHOOL_LINKS: [string, string][] = [
  ["2027 전형 전체 비교", "/admission"],
  ["육군사관학교 전형", "/admission/army"],
  ["해군사관학교 전형", "/admission/navy"],
  ["공군사관학교 전형", "/admission/airforce"],
  ["국군간호사관학교 전형", "/admission/nursing"],
  ["경찰대학 전형", "/admission/police"],
]
