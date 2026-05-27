"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, FileText, Shield, Sparkles } from "lucide-react"

type Track = "saagwan" | "police"

const SCORES: Record<Track, { label: string; score: number; color: string }[]> = {
  saagwan: [
    { label: "리더십 · 통솔력", score: 92, color: "bg-red-500" },
    { label: "국가관 · 안보의식", score: 88, color: "bg-amber-500" },
    { label: "체육 활동 · 체력", score: 95, color: "bg-emerald-500" },
    { label: "학업 역량 (국영수)", score: 85, color: "bg-blue-500" },
  ],
  police: [
    { label: "법치의식 · 준법", score: 90, color: "bg-indigo-500" },
    { label: "봉사 · 공동체", score: 87, color: "bg-emerald-500" },
    { label: "체력 · 무도", score: 84, color: "bg-red-500" },
    { label: "학업 역량 (국영수)", score: 89, color: "bg-blue-500" },
  ],
}

const EXTRACTED_KEYWORDS: Record<Track, { kw: string; cat: string; color: string }[]> = {
  saagwan: [
    { kw: "학급 반장 (3회)", cat: "리더십", color: "bg-red-100 text-red-700" },
    { kw: "현충일 추모식 사회", cat: "국가관", color: "bg-amber-100 text-amber-700" },
    { kw: "축구부 주장", cat: "체력", color: "bg-emerald-100 text-emerald-700" },
    { kw: "수학 경시 대회 입상", cat: "학업", color: "bg-blue-100 text-blue-700" },
    { kw: "사관학교 탐방 동아리", cat: "국가관", color: "bg-amber-100 text-amber-700" },
  ],
  police: [
    { kw: "선도부 활동 2년", cat: "법치의식", color: "bg-indigo-100 text-indigo-700" },
    { kw: "지역아동센터 봉사 80시간", cat: "봉사", color: "bg-emerald-100 text-emerald-700" },
    { kw: "유도 1단", cat: "체력/무도", color: "bg-red-100 text-red-700" },
    { kw: "모의 법정 토론대회", cat: "법치의식", color: "bg-indigo-100 text-indigo-700" },
  ],
}

const ACTIVITY_GUIDE = [
  {
    title: "동아리",
    body: "사관: 안보/시사 토론 동아리, 체육 동아리 주장. 경찰: 선도부, 모의법정, RCY.",
  },
  {
    title: "봉사",
    body: "사관: 보훈병원·국립묘지 봉사. 경찰: 지역아동센터, 교통 캠페인 봉사.",
  },
  {
    title: "독서",
    body: "사관: 안보/리더십 도서(예: 명장의 리더십). 경찰: 형법/판례 입문서, 사회정의 관련 도서.",
  },
  {
    title: "수상/대회",
    body: "교내 토론/체력 측정/한국사 능력검정. 가능하면 정량적 수치(시간·횟수·순위)로 기록.",
  },
]

export default function SanggibuPage() {
  const [track, setTrack] = useState<Track>("saagwan")
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [inputText, setInputText] = useState("")

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 py-20">
        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/20 px-4 py-2">
            <Shield className="h-4 w-4 text-blue-200" />
            <span className="text-sm font-semibold text-blue-100">생기부 사관·경찰 AI 진단</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            면접관이 보는 키워드로
            <br />
            <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">
              내 생기부를 분석합니다
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-100">
            일반 대학과 완전히 다른 사관·경찰대 평가 기준. 리더십·국가관·체력·법치의식까지 자동 분류.
          </p>
        </div>
      </section>

      {/* 트랙 토글 */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mx-auto flex max-w-md rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTrack("saagwan")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${
                track === "saagwan" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500"
              }`}
            >
              사관학교 기준
            </button>
            <button
              onClick={() => setTrack("police")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${
                track === "police" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"
              }`}
            >
              경찰대 기준
            </button>
          </div>
        </div>
      </section>

      {/* 4대 평가축 점수 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">4대 평가축 진단 결과</h2>
            <p className="mt-2 text-gray-600">예시 데이터 — 실제 진단은 본인 생기부 업로드 후 확인.</p>
          </div>
          <Card className="border-gray-200">
            <CardContent className="space-y-5 p-8">
              {SCORES[track].map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex justify-between text-sm font-bold text-gray-700">
                    <span>{s.label}</span>
                    <span className="text-gray-900">{s.score}점</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 키워드 추출 데모 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
              <Sparkles className="h-4 w-4 text-blue-700" />
              <span className="text-xs font-bold text-blue-700">자동 키워드 추출</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">내 생기부에서 뽑힌 키워드</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">생기부 텍스트를 붙여 넣어 보세요</CardTitle>
              <CardDescription>실제 진단은 PDF 업로드 지원. 아래는 데모.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="예시: 1학년부터 3학년까지 학급 반장을 맡아 학급 운영을 이끌었으며, 교내 안보 토론대회에서 우수상을 수상..."
                className="min-h-32 w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <div className="mt-5">
                <div className="mb-3 text-xs font-bold text-gray-500">분류된 키워드 (데모)</div>
                <div className="flex flex-wrap gap-2">
                  {EXTRACTED_KEYWORDS[track].map((k) => (
                    <span
                      key={k.kw}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${k.color}`}
                    >
                      <FileText className="h-3 w-3" />
                      {k.kw}
                      <span className="ml-1 rounded bg-white/60 px-1.5 py-0.5 text-[10px]">{k.cat}</span>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 활동 가이드 아코디언 */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">합격생이 쌓은 활동, 그대로 가이드</h2>
            <p className="mt-2 text-gray-600">{track === "saagwan" ? "사관학교" : "경찰대"} 합격생 통계 기반 추천 템플릿.</p>
          </div>
          <div className="space-y-3">
            {ACTIVITY_GUIDE.map((g, i) => {
              const open = openIdx === i
              return (
                <div key={g.title} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-bold text-gray-900">{g.title}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 text-sm text-gray-700">
                      {g.body}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-700 to-slate-900 py-16 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold text-white">AI 진단 1회 무료</h2>
          <p className="mb-8 text-lg text-blue-100">생기부 PDF 업로드 → 평가축 점수·키워드 추출·활동 가이드까지.</p>
          <Button className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
            무료 진단 시작
          </Button>
        </div>
      </section>
    </div>
  )
}
