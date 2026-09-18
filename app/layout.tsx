import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "@tskool/satellite-header/styles.css"
import { DomainRedirect } from "./domain-redirect"
import { SiteFooter } from "@/components/site-footer"
import JsonLd from "@/components/json-ld"
import { ORGANIZATION, SITE_NAME, SITE_URL, WEBSITE, graph } from "@/lib/seo"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const NAVER_VERIFICATION = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // 페이지가 자기 title 을 지정하지 않았을 때만 쓰이는 기본값.
    // 새 페이지를 만들면 반드시 그 페이지의 title 을 따로 지정할 것.
    default: "T사관 — 사관학교·경찰대 입시 플랫폼 | 모의고사·플래너·생기부",
    template: "%s",
  },
  description:
    "육·해·공군 사관학교, 국군간호사관학교, 경찰대 수험생 전문 플랫폼. 전용 OMR 모의고사·과거 합격선 매칭, 반별 학습량 경쟁 플래너, 생기부 AI 진단, 합격생 1:1 멘토링을 한 곳에서.",
  // alternates.canonical 은 여기(루트 layout)에 두지 않는다.
  // Next 가 모든 하위 라우트에 상속시켜 전 페이지가 홈의 중복으로 선언된다.
  // 아이콘·OG 카드는 Hub/brand 가 배포하는 공용 T스쿨 자산.
  // 교체하려면 Hub/brand/apps.json 을 고치고 `python brand/sync_brand.py sakwan` 실행.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png?v=2", type: "image/png" },
    ],
    apple: "/logo.png?v=2",
  },
  // URL 공유 시(카톡·슬랙 등) 뜨는 미리보기.
  // openGraph.url 은 여기서 고정하지 않는다 — 고정하면 모든 하위 페이지가
  // 자기 URL 대신 홈 URL 을 신고하게 된다. 페이지별로 지정할 것.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "T사관 — 사관학교·경찰대 입시 플랫폼",
    description: "사관학교·경찰대 수험생을 위한 모의고사·플래너·생기부·멘토링 플랫폼",
    locale: "ko_KR",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "T사관" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "T사관 — 사관학교·경찰대 입시 플랫폼",
    description: "사관학교·경찰대 수험생을 위한 모의고사·플래너·생기부·멘토링 플랫폼",
    images: ["/og-image.png?v=2"],
  },
  // 값이 없으면 아무 태그도 렌더되지 않는다.
  // 로컬은 .env.local, CI는 같은 이름의 저장소 Actions Variables에 코드를 등록한다.
  // 정적 HTML에 반영하려면 등록·변경 후 다시 빌드·배포해야 한다.
  ...(NAVER_VERIFICATION || GOOGLE_VERIFICATION
    ? {
        verification: {
          ...(GOOGLE_VERIFICATION ? { google: GOOGLE_VERIFICATION } : {}),
          ...(NAVER_VERIFICATION
            ? { other: { "naver-site-verification": NAVER_VERIFICATION } }
            : {}),
        },
      }
    : {}),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${inter.variable} antialiased`}>
      <body className="font-sans">
        <JsonLd data={graph(ORGANIZATION, WEBSITE)} />
        <DomainRedirect />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
