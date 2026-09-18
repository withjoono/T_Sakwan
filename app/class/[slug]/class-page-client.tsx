"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Dumbbell, MessagesSquare, ScrollText, Trophy, Users } from "lucide-react"
import type { ClassData } from "./page"

const accentMap: Record<string, { bg: string; text: string; border: string; btn: string; soft: string }> = {
  green: { bg: "bg-green-600", text: "text-green-700", border: "border-green-300", btn: "bg-green-700 hover:bg-green-800", soft: "bg-green-50" },
  sky: { bg: "bg-sky-600", text: "text-sky-700", border: "border-sky-300", btn: "bg-sky-700 hover:bg-sky-800", soft: "bg-sky-50" },
  blue: { bg: "bg-blue-600", text: "text-blue-700", border: "border-blue-300", btn: "bg-blue-700 hover:bg-blue-800", soft: "bg-blue-50" },
  pink: { bg: "bg-pink-600", text: "text-pink-700", border: "border-pink-300", btn: "bg-pink-700 hover:bg-pink-800", soft: "bg-pink-50" },
  indigo: { bg: "bg-indigo-600", text: "text-indigo-700", border: "border-indigo-300", btn: "bg-indigo-700 hover:bg-indigo-800", soft: "bg-indigo-50" },
}

type TabKey = "schedule" | "subject" | "fitness" | "interview" | "physical"

export default function ClassPageClient({ data, panels, sourceDoc, updated, uncertain }: {
  data: ClassData
  panels: Record<TabKey, ReactNode>
  sourceDoc: string
  updated: string
  uncertain: string[]
}) {
  const [tab, setTab] = useState<TabKey>("schedule")
  const c = accentMap[data.accentColor]

  const tabs: { key: TabKey; label: string; icon: typeof Calendar }[] = [
    { key: "schedule", label: "전형 일정", icon: Calendar },
    { key: "subject", label: "1차 과목", icon: ScrollText },
    { key: "fitness", label: "체력검정", icon: Dumbbell },
    { key: "interview", label: "면접", icon: Users },
  ]
  tabs.push({ key: "physical", label: "신체 기준", icon: Trophy })

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${data.heroGradient} py-20`}>
        <div className="container relative mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`rounded-full ${c.bg} px-3 py-1 text-xs font-bold text-white`}>{data.badge}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-6xl">{data.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-white md:text-5xl">{data.name}</h1>
              <p className="mt-2 text-lg text-white/80">{data.shortName} · {data.tagline}</p>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-base text-white/90">{data.message}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button className={`rounded-lg ${c.btn} px-6 py-5 text-base font-bold text-white`}>
              이 반에 합류하기
            </Button>
            <Button
              variant="outline"
              className="rounded-lg border-2 border-white/30 bg-transparent px-6 py-5 text-base font-bold text-white hover:bg-white/10"
            >
              합격생 멘토 보기
            </Button>
          </div>
        </div>
      </section>

      {/* 핵심 시험 정보 — 탭 */}
      <section className="border-b border-gray-100 bg-white py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">핵심 시험 정보</h2>

          <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
                  tab === t.key
                    ? `${c.text} border-current`
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* 서버에서 생성한 표를 전달받아 모든 탭의 본문을 정적 HTML에 포함한다. */}
          {tabs.map((item) => (
            <div key={item.key} hidden={tab !== item.key} className="space-y-4 text-sm leading-relaxed">
              {panels[item.key]}
            </div>
          ))}
          {uncertain.length > 0 && (
            <aside className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <h3 className="font-bold">요강 확인이 필요한 사항</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {uncertain.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </aside>
          )}
          <p className="mt-6 text-sm text-gray-600">출처: {sourceDoc} · 자료 확인일 {updated}</p>
          <Link href={`/admission/${data.slug}`} className="mt-2 inline-block text-sm font-semibold underline">
            {data.name} 모집인원·배점·요강 전체 안내 보기
          </Link>
        </div>
      </section>

      {/* 반 활동 미리보기 + 멘토 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">{data.shortName} 합격생 멘토</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {data.mentors.map((m) => (
              <Card key={m.name} className={`border-2 ${c.border}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${c.soft} ${c.text} text-lg font-black`}>
                      {m.initial}
                    </div>
                    <div>
                      <CardTitle className="text-base">{m.name}</CardTitle>
                      <CardDescription className="text-xs">{m.school}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">"{m.intro}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`bg-gradient-to-br ${data.heroGradient} py-16 text-center`}>
        <div className="container mx-auto max-w-3xl px-6">
          <MessagesSquare className="mx-auto mb-4 h-10 w-10 text-white/80" />
          <h2 className="mb-4 text-3xl font-bold text-white">
            {data.shortName}에 합류하면
          </h2>
          <p className="mb-8 text-lg text-white/90">
            반별 모의고사 · 합격생 멘토 · 매일 학습량 경쟁 — 한 번에 시작합니다.
          </p>
          <Button className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
            {data.shortName} 합류하기
          </Button>
        </div>
      </section>
    </div>
  )
}
