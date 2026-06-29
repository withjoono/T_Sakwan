import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "사관학교 입시 전문 | T사관 - 육사·해사·공사·국간사",
  description: "육군사관학교, 해군사관학교, 공군사관학교, 국군간호사관학교 합격을 위한 전문 입시 컨설팅 + AI 생기부 진단 플랫폼. 1차 필기, 체력검정, 면접 완벽 대비.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${inter.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
