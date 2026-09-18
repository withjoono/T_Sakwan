/**
 * 검색·AI 검색 노출용 공통 상수와 JSON-LD 헬퍼.
 *
 * 여기 적는 값은 반드시 사이트 화면에 실제로 적혀 있는 것과 일치해야 한다.
 * (불일치하면 구조화 데이터가 통째로 무시된다.)
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tsakwan.kr"
export const SITE_NAME = "T사관"

/**
 * 손으로 올리는 콘텐츠 갱신일.
 * 빌드마다 오늘 날짜를 넣지 말 것 — 내용이 그대로인데 매번 "수정됨"을 주장하면
 * AI 검색의 신선도 판단에서 신뢰도만 깎인다. 본문을 실제로 고쳤을 때만 바꾼다.
 */
export const CONTENT_UPDATED = "2026-09-13"

/** 절대 URL. sitemap·JSON-LD는 상대경로를 허용하지 않는다. */
export const abs = (p: string) => `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`

/** 운영 주체. 값은 SiteFooter 에 표기된 사업자 정보와 동일하게 유지할 것. */
export const ORGANIZATION = {
  "@type": "EducationalOrganization",
  "@id": abs("/#organization"),
  name: "(주)거북스쿨",
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: abs("/logo.png"),
  telephone: "+82-42-484-3356",
  address: {
    "@type": "PostalAddress",
    streetAddress: "화랑로 211 성북구 기술창업센터 105호",
    addressLocality: "성북구",
    addressRegion: "서울특별시",
    addressCountry: "KR",
  },
} as const

export const WEBSITE = {
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "ko-KR",
  publisher: { "@id": abs("/#organization") },
} as const

export function breadcrumb(items: [string, string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  }
}

/** Google 의 Course 리치 결과는 name·description·provider 가 필수. */
export function course(o: {
  name: string
  description: string
  path: string
  mode?: "online" | "onsite" | "blended"
}) {
  return {
    "@type": "Course",
    "@id": abs(`${o.path}#course`),
    name: o.name,
    description: o.description,
    url: abs(o.path),
    inLanguage: "ko-KR",
    provider: { "@id": abs("/#organization") },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: o.mode ?? "blended",
      inLanguage: "ko-KR",
    },
  }
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  }
}

/** @id 로 서로 참조해 중복 선언을 피한다. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes }
}
