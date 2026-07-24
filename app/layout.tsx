import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DomainRedirect } from "./domain-redirect"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://tsakwan.kr"),
  title: "T사관",
  description: "사관/경찰대 준비 AI 플랫폼",
  icons: {
    icon: "/ts-logo.png",
    apple: "/ts-logo.png",
  },
  // URL 공유 시(카톡·슬랙 등) 뜨는 미리보기 — 로고 이미지를 og:image 로 지정
  openGraph: {
    type: "website",
    siteName: "T사관",
    title: "T사관",
    description: "사관/경찰대 준비 AI 플랫폼",
    url: "https://tsakwan.kr",
    images: [{ url: "/ts-logo.png", alt: "T사관" }],
  },
  twitter: {
    card: "summary",
    title: "T사관",
    description: "사관/경찰대 준비 AI 플랫폼",
    images: ["/ts-logo.png"],
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
      </body>
    </html>
  )
}
