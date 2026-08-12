import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DomainRedirect } from "./domain-redirect"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://tsakwan.kr"),
  title: "T사관 - 사관·경찰대 입시 AI 플랫폼",
  description: "사관/경찰대 준비 AI 플랫폼",
  // 아이콘·OG 카드는 Hub/brand 가 배포하는 공용 T스쿨 자산.
  // 교체하려면 Hub/brand/apps.json 을 고치고 `python brand/sync_brand.py sakwan` 실행.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png?v=2", type: "image/png" },
    ],
    apple: "/logo.png?v=2",
  },
  // URL 공유 시(카톡·슬랙 등) 뜨는 미리보기
  openGraph: {
    type: "website",
    siteName: "T사관",
    title: "T사관 - 사관·경찰대 입시 AI 플랫폼",
    description: "사관/경찰대 준비 AI 플랫폼",
    url: "https://tsakwan.kr",
    locale: "ko_KR",
    images: [{ url: "/og-image.png?v=2", width: 1200, height: 630, alt: "T사관" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "T사관 - 사관·경찰대 입시 AI 플랫폼",
    description: "사관/경찰대 준비 AI 플랫폼",
    images: ["/og-image.png?v=2"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${inter.variable} antialiased`}>
      <body className="font-sans">
        <DomainRedirect />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
