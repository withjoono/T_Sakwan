"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ClipboardList, Dumbbell, Flame, MessageCircle, Trophy } from "lucide-react"

type ClassKey = "army" | "airforce" | "navy" | "nursing" | "police"

const CLASS_LABELS: Record<ClassKey, string> = {
  army: "🟢 육사반",
  airforce: "🔷 공사반",
  navy: "🔵 해사반",
  nursing: "🏥 국간사반",
  police: "👮 경찰대반",
}

const RANKINGS: Record<ClassKey, { name: string; hours: number; me?: boolean }[]> = {
  army: [
    { name: "김O준", hours: 11.5 },
    { name: "이O민", hours: 10.8 },
    { name: "박O서", hours: 9.7 },
    { name: "나 (Junho)", hours: 8.2, me: true },
    { name: "최O우", hours: 7.9 },
  ],
  airforce: [
    { name: "정O호", hours: 12.1 },
    { name: "한O은", hours: 11.0 },
    { name: "나 (Junho)", hours: 9.5, me: true },
    { name: "윤O아", hours: 9.1 },
    { name: "서O빈", hours: 8.8 },
  ],
  navy: [
    { name: "조O린", hours: 10.7 },
    { name: "강O찬", hours: 10.2 },
    { name: "임O율", hours: 9.4 },
    { name: "나 (Junho)", hours: 8.9, me: true },
    { name: "전O우", hours: 8.5 },
  ],
  nursing: [
    { name: "오O진", hours: 11.8 },
    { name: "신O아", hours: 10.5 },
    { name: "나 (Junho)", hours: 9.2, me: true },
    { name: "백O연", hours: 9.0 },
    { name: "구O은", hours: 8.7 },
  ],
  police: [
    { name: "유O재", hours: 13.0 },
    { name: "남O석", hours: 12.4 },
    { name: "권O희", hours: 11.6 },
    { name: "나 (Junho)", hours: 10.7, me: true },
    { name: "황O환", hours: 10.1 },
  ],
}

const TODAY_PLAN = [
  { time: "06:00", subj: "체력", title: "달리기 1.5km + 윗몸일으키기 3세트", color: "#dc2626", done: true },
  { time: "09:00", subj: "수학", title: "사관학교 기출 미적분 — 극한 단원", color: "#2563eb", done: true },
  { time: "13:00", subj: "국어", title: "비문학 사회 지문 5세트", color: "#7c3aed", done: false },
  { time: "16:00", subj: "공간능력", title: "전개도 유형 30문항", color: "#0891b2", done: false },
  { time: "19:00", subj: "국사", title: "근현대사 — 6.25 전쟁 정리", color: "#b45309", done: false },
  { time: "21:00", subj: "면접", title: "오늘의 시사 이슈 1줄 브리핑", color: "#be185d", done: false },
]

const EXERCISE_RANKING = [
  { name: "유O재 (경찰대반)", min: 540 },
  { name: "김O준 (육사반)", min: 480 },
  { name: "정O호 (공사반)", min: 460 },
  { name: "나 (Junho)", min: 320, me: true },
  { name: "조O린 (해사반)", min: 310 },
]

export default function PlannerPage() {
  const [selectedClass, setSelectedClass] = useState<ClassKey>("army")
  const [plan, setPlan] = useState(TODAY_PLAN)

  const toggle = (i: number) => setPlan(plan.map((p, idx) => (idx === i ? { ...p, done: !p.done } : p)))
  const doneCount = plan.filter((p) => p.done).length
  const progress = Math.round((doneCount / plan.length) * 100)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 py-20">
        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <ClipboardList className="h-4 w-4 text-amber-100" />
            <span className="text-sm font-semibold text-amber-100">TS 사관 플래너</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            어제 우리 반에서
            <br />
            <span className="bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">누가 제일 열심히 했나?</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-amber-50">
            같은 목표 친구들과 매일 비교되는 플래너. 학습량·운동량·플래너 검사까지 한 곳에서.
          </p>
          <Button size="lg" className="rounded-lg bg-white px-8 py-6 text-lg font-bold text-orange-700 hover:bg-amber-50">
            오늘 플래너 작성
          </Button>
        </div>
      </section>

      {/* 오늘의 일정 데모 + 진행률 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">오늘의 일정</h2>
              <p className="mt-1 text-sm text-gray-500">체크박스를 눌러 완료 표시 — 자동 저장됩니다.</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-orange-600">{progress}%</div>
              <div className="text-xs text-gray-500">{doneCount} / {plan.length} 완료</div>
            </div>
          </div>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="relative ml-3 border-l-2 border-gray-200 pl-6">
                {plan.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className="relative mb-5 block w-full text-left last:mb-0 hover:bg-gray-50 -ml-2 -mr-2 px-2 py-2 rounded-lg transition-colors"
                  >
                    <div
                      className="absolute -left-[33px] top-3 h-4 w-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{item.time}</span>
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.subj}
                      </span>
                      {item.done && <span className="text-xs font-bold text-emerald-600">✓ 완료</span>}
                    </div>
                    <p
                      className={`mt-1 text-sm font-medium ${item.done ? "text-gray-400 line-through" : "text-gray-800"}`}
                    >
                      {item.title}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 반별 학습량 랭킹 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1">
                <Trophy className="h-4 w-4 text-orange-700" />
                <span className="text-xs font-bold text-orange-700">반별 학습량 랭킹 (어제 기준)</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">우리 반에서 내 순위는?</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CLASS_LABELS) as ClassKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedClass(k)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedClass === k
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {CLASS_LABELS[k]}
                </button>
              ))}
            </div>
          </div>

          <Card className="border-gray-200">
            <CardContent className="space-y-3 p-6">
              {RANKINGS[selectedClass].map((r, i) => {
                const max = RANKINGS[selectedClass][0].hours
                const pct = (r.hours / max) * 100
                return (
                  <div
                    key={r.name}
                    className={`relative overflow-hidden rounded-xl border p-4 ${
                      r.me ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                            i === 0
                              ? "bg-amber-400 text-white"
                              : i === 1
                                ? "bg-gray-300 text-white"
                                : i === 2
                                  ? "bg-amber-700 text-white"
                                  : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className={`text-sm font-bold ${r.me ? "text-orange-700" : "text-gray-900"}`}>
                          {r.name} {r.me && <span className="text-xs">(나)</span>}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{r.hours}h</span>
                    </div>
                    <div
                      className={`absolute inset-y-0 left-0 ${r.me ? "bg-orange-200/40" : "bg-gray-100/60"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 운동 인증 랭킹 */}
      <section className="bg-gradient-to-br from-red-50 to-amber-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1">
              <Dumbbell className="h-4 w-4 text-red-700" />
              <span className="text-xs font-bold text-red-700">운동 인증 랭킹 (1주일 누적)</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">체력은 지금부터. 1년 전부터.</h2>
            <p className="mt-2 text-sm text-gray-600">"면접 기간 동안 벼락치기"로는 못 붙습니다.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {EXERCISE_RANKING.map((r, i) => (
              <div
                key={r.name}
                className={`flex items-center justify-between rounded-xl border-2 bg-white p-4 ${
                  r.me ? "border-red-300" : "border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Flame className={`h-5 w-5 ${i < 3 ? "text-red-600" : "text-gray-300"}`} />
                  <span className={`text-sm font-bold ${r.me ? "text-red-700" : "text-gray-900"}`}>{r.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{r.min}분</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 멘토 검사 코멘트 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
              <MessageCircle className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-700">멘토 플래너 검사 (어제)</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">합격생 멘토의 피드백</h2>
          </div>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                  김
                </div>
                <div>
                  <CardTitle className="text-base">김O준 멘토 — 육사 24기</CardTitle>
                  <CardDescription>육사반 / 2026.05.27 22:14</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-700">
                "어제 미적분 단원 3시간 잡은 거 좋습니다. 다만 공간능력은 이틀 연속 빈 상태인데, 이 단원은 감각 유지가 중요하니
                매일 15분이라도 잡으세요. 체력 1.5km는 7'40\" → 7'25\"로 단축되고 있네요. 좋습니다."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 체력 가이드 박스 */}
      <section className="bg-gradient-to-br from-red-700 to-red-900 py-16 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <Calendar className="mx-auto mb-4 h-10 w-10 text-amber-300" />
          <h2 className="mb-4 text-3xl font-bold text-white">체력은 지금부터 해야 합니다</h2>
          <p className="mb-8 text-lg text-red-100">
            면접 기간 동안 아무리 열심히 해도 못 붙습니다. 플래너의 운동 인증으로 매일 체크.
          </p>
          <Button className="rounded-lg bg-white px-8 py-6 text-lg font-bold text-red-700 hover:bg-amber-50">
            오늘 플래너 작성하기
          </Button>
        </div>
      </section>
    </div>
  )
}
