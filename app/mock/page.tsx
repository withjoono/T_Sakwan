"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, CheckCircle, Target, TrendingUp, Trophy } from "lucide-react"

type ExamTrack = "saagwan" | "police"

const PAST_CUTOFFS: Record<ExamTrack, { label: string; year: string; cut: number; avg: number }[]> = {
  saagwan: [
    { label: "공군사관학교", year: "2025", cut: 268, avg: 245 },
    { label: "육군사관학교", year: "2025", cut: 254, avg: 232 },
    { label: "해군사관학교", year: "2025", cut: 260, avg: 238 },
    { label: "국군간호사관학교", year: "2025", cut: 251, avg: 230 },
  ],
  police: [{ label: "경찰대학교", year: "2025", cut: 272, avg: 250 }],
}

const TRACK_PROBABILITY = [
  { school: "공사", color: "bg-sky-500", prob: 62, hint: "합격선 -6점, 변별력 ↑" },
  { school: "육사", color: "bg-emerald-500", prob: 78, hint: "정원 가장 많음" },
  { school: "해사", color: "bg-blue-500", prob: 71, hint: "지원자 적어 변동성 ↑" },
]

const WEAK_TOPICS = [
  { name: "수학 미적분 — 극한", rate: 32 },
  { name: "국어 비문학 — 사회", rate: 41 },
  { name: "공간능력 — 전개도", rate: 48 },
]

export default function MockPage() {
  const [track, setTrack] = useState<ExamTrack>("saagwan")
  const [crossStream, setCrossStream] = useState<"humanities" | "science">("science")
  const [myScore] = useState(258)

  const data = PAST_CUTOFFS[track]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-slate-900 py-20">
        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <Trophy className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">TS 사관 모의고사</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            이 점수면 작년 합격이었나?
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">지금 알 수 있습니다.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-red-100">
            사관·경찰대 시험 형식 그대로. 응시 즉시 과거 합격선·올해 지원자 내 석차·모의지원 분석까지.
          </p>
          <Button size="lg" className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
            다음 회차 응시 신청 <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* 시험 선택 탭 */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mx-auto flex max-w-md rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setTrack("saagwan")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${
                track === "saagwan" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              사관학교 모의
            </button>
            <button
              onClick={() => setTrack("police")}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-bold transition-all ${
                track === "police" ? "bg-white text-red-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              경찰대 모의
            </button>
          </div>
        </div>
      </section>

      {/* 과거 합격 분석 데모 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1">
              <BarChart3 className="h-4 w-4 text-red-700" />
              <span className="text-xs font-bold text-red-700">과거 합격 분석</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">내 점수 vs 작년 합격선</h2>
            <p className="mt-2 text-gray-600">
              내 점수 <strong className="text-red-700">{myScore}점</strong> 기준
            </p>
          </div>

          <Card className="border-gray-200">
            <CardContent className="space-y-6 p-8">
              {data.map((d) => {
                const max = 300
                const myPct = (myScore / max) * 100
                const cutPct = (d.cut / max) * 100
                const avgPct = (d.avg / max) * 100
                const pass = myScore >= d.cut
                return (
                  <div key={d.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        {d.label} <span className="text-xs text-gray-400">({d.year} 합격컷)</span>
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pass ? `✓ 합격선 +${myScore - d.cut}` : `✗ 합격선 -${d.cut - myScore}`}
                      </span>
                    </div>
                    <div className="relative h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                      <div
                        className="absolute top-0 h-full bg-emerald-400/30"
                        style={{ width: `${avgPct}%` }}
                        title={`평균 ${d.avg}`}
                      />
                      <div
                        className={`absolute top-0 h-full ${pass ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${myPct}%` }}
                      />
                      <div
                        className="absolute top-0 h-full w-[2px] bg-gray-900"
                        style={{ left: `${cutPct}%` }}
                        title={`합격컷 ${d.cut}`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
                        나 {myScore}점
                      </span>
                    </div>
                    <div className="mt-1 flex gap-4 text-[10px] text-gray-500">
                      <span>━ 합격컷 {d.cut}</span>
                      <span className="text-emerald-700">▮ 평균 {d.avg}</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 모의지원: 사관 선택 분석 */}
      {track === "saagwan" && (
        <section className="bg-white py-16">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-8">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                <Target className="h-4 w-4 text-blue-700" />
                <span className="text-xs font-bold text-blue-700">모의지원 — 사관 선택 분석</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">공사·육사·해사, 어디가 유리?</h2>
              <p className="mt-2 text-gray-600">현재 성적 기준 합격 확률을 동시에 비교.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {TRACK_PROBABILITY.map((p) => (
                <Card key={p.school} className="border-2 border-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-baseline justify-between">
                      <span>{p.school}</span>
                      <span className="text-3xl font-black">
                        {p.prob}<span className="text-base font-normal text-gray-500">%</span>
                      </span>
                    </CardTitle>
                    <CardDescription>{p.hint}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full ${p.color}`} style={{ width: `${p.prob}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 교차지원 분석 */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1">
              <TrendingUp className="h-4 w-4 text-purple-700" />
              <span className="text-xs font-bold text-purple-700">교차지원 시뮬레이션</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">문과 ↔ 이과, 어디가 유리?</h2>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">현재 트랙</span>
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setCrossStream("humanities")}
                    className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                      crossStream === "humanities" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    문과
                  </button>
                  <button
                    onClick={() => setCrossStream("science")}
                    className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                      crossStream === "science" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    이과
                  </button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="text-xs font-semibold text-gray-500">현재 ({crossStream === "science" ? "이과" : "문과"})</div>
                  <div className="my-1 text-3xl font-black text-gray-900">{crossStream === "science" ? "72%" : "58%"}</div>
                  <div className="text-xs text-gray-500">합격 예상 확률 (육사 기준)</div>
                </div>
                <div className="rounded-xl border-2 border-purple-300 bg-purple-50 p-5">
                  <div className="text-xs font-semibold text-purple-600">전환 시 ({crossStream === "science" ? "문과" : "이과"})</div>
                  <div className="my-1 text-3xl font-black text-purple-700">{crossStream === "science" ? "65%" : "75%"}</div>
                  <div className="text-xs text-purple-600">
                    {crossStream === "science" ? "표준점수 보정으로 -7%p" : "수학 가산점으로 +17%p"}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">* 실제 모의지원 시 본인 성적·과목별 표준점수 기반으로 정밀 계산됩니다.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 오답·취약 분석 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">오답·취약 분석</h2>
            <p className="mt-2 text-gray-600">매 회차 자동 저장. 취약 단원 TOP3는 다음 모의고사 전에 집중 학습.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {WEAK_TOPICS.map((t, i) => (
              <Card key={t.name} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="mb-1 text-xs font-bold text-red-600">취약 #{i + 1}</div>
                  <div className="mb-3 text-base font-bold text-gray-900">{t.name}</div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-500">정답률</span>
                    <span className="font-bold text-red-700">{t.rate}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${t.rate}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="bg-gradient-to-br from-slate-900 to-red-950 py-16 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold text-white">다음 회차 모의고사, 지금 신청</h2>
          <p className="mb-8 text-lg text-red-100">응시 즉시 과거 합격 분석·석차·모의지원 결과를 한 번에 받습니다.</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
              사관학교 모의 신청
            </Button>
            <Button
              variant="outline"
              className="rounded-lg border-2 border-white/30 bg-transparent px-8 py-6 text-lg font-bold text-white hover:bg-white/10"
            >
              경찰대 모의 신청
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-red-100">
            <li className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />과거 합격 DB 즉시 매칭
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />올해 지원자 내 석차
            </li>
            <li className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />모의지원 분석 무료
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
