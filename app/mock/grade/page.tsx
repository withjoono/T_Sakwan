"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MOCK_ROUNDS, isRoundOpen } from "@/lib/sakwan/mock-products"
import { ArrowLeft, ArrowRight, BookOpen, ClipboardCheck, Lock, Sparkles } from "lucide-react"

export default function GradeLandingPage() {
  const [openMap, setOpenMap] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const m: Record<number, boolean> = {}
    MOCK_ROUNDS.forEach((r) => (m[r.round] = isRoundOpen(r)))
    setOpenMap(m)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-900 py-12">
        <div className="container mx-auto max-w-4xl px-6">
          <Link href="/mock" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-red-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> 모의고사 홈
          </Link>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-1.5">
            <ClipboardCheck className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">OMR 채점</span>
          </div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">무엇을 채점할까요?</h1>
          <p className="mt-2 text-red-100">채점 종류를 선택하면 OMR 입력 화면으로 이동합니다. 답만 입력하면 즉시 채점돼요.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto grid max-w-4xl gap-6 px-6 md:grid-cols-2">
          {/* 기출 채점 */}
          <Card className="border-2 border-red-200">
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">📚</div>
              <h2 className="text-xl font-bold text-gray-900">기출 채점</h2>
              <p className="mt-1 flex-1 text-sm text-gray-500">
                사관·경찰 역대 기출(2022~2026)을 전용 OMR로 응시·채점하고 작년 합격선과 매칭합니다.
              </p>
              <Link href="/mock/past" className="mt-4">
                <Button className="w-full bg-red-700 py-6 text-base font-bold text-white hover:bg-red-800">
                  <BookOpen className="mr-2 h-5 w-5" /> 기출 채점 시작 <ArrowRight className="ml-1.5 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* T사관 모의 채점 */}
          <Card className="border-2 border-amber-200">
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">✨</div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">T사관 모의 채점</h2>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                회차를 선택해 OMR로 채점하세요. 채점을 완료하면 답지·해설서 다운로드가 열립니다.
              </p>

              <div className="mt-4 grid flex-1 grid-cols-5 gap-2">
                {MOCK_ROUNDS.map((r) => {
                  const open = openMap[r.round]
                  if (open) {
                    return (
                      <Link key={r.round} href={`/mock/exam?type=tsagwan&round=${r.round}`}>
                        <span className="flex flex-col items-center rounded-xl border-2 border-amber-300 bg-amber-50 py-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-sm">
                          <span className="text-sm font-black text-amber-700">{r.label}</span>
                          <span className="mt-0.5 text-[10px] font-bold text-amber-600">채점</span>
                        </span>
                      </Link>
                    )
                  }
                  return (
                    <div
                      key={r.round}
                      title={`${r.openIso.replace(/-/g, ".")} 오픈`}
                      className="flex cursor-not-allowed flex-col items-center rounded-xl border-2 border-gray-200 bg-gray-50 py-3 text-center"
                    >
                      <span className="text-sm font-black text-gray-400">{r.label}</span>
                      <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-bold text-gray-400">
                        <Lock className="h-2.5 w-2.5" /> {r.date}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="mt-3 text-[11px] text-gray-400">※ 회차는 시행일 이후 채점이 열립니다.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
