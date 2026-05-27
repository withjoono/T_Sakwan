"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, CalendarCheck, CheckCircle, ChevronDown, ClipboardCheck, Dumbbell, Heart, Users } from "lucide-react"

const STAGES = [
  { key: "ai", title: "AI 인성 면접", icon: Bot, detail: "표정·발화 패턴·답변 일관성을 AI가 자동 분석. 사관·경찰 모두 1차 통과 후 진행." },
  { key: "physical", title: "신체검사", icon: Heart, detail: "공사(시력·BMI), 해사(수영), 경찰대(시력·청력) 등 학교별 기준 상이." },
  { key: "fitness", title: "체력검정", icon: Dumbbell, detail: "달리기·윗몸일으키기·팔굽혀펴기·악력 등. 경찰대는 5종목, 점수화 비중 高." },
  { key: "interviewer", title: "면접관 대면", icon: Users, detail: "국가관·리더십·시사·자기소개. 사관 vs 경찰의 평가축이 다름." },
]

const COMPARISON = [
  { school: "🟢 육사", time: "20분", focus: "국가관·리더십·체력", method: "다대일 + 심층", color: "border-green-200" },
  { school: "🔷 공사", time: "30분", focus: "조종 적성·시사", method: "AI + 다대일 + 심층", color: "border-sky-200" },
  { school: "🔵 해사", time: "25분", focus: "장기 항해 적응성", method: "다대일 + 심층", color: "border-blue-200" },
  { school: "🏥 국간사", time: "25분", focus: "공감·의료 윤리", method: "AI + 다대일", color: "border-pink-200" },
  { school: "👮 경찰대", time: "30분", focus: "법치·윤리·시사", method: "AI + 다대일 + 심층 + 토론", color: "border-indigo-200" },
]

const FAQ = [
  {
    cat: "국가관 · 안보의식",
    items: [
      "현재 가장 큰 안보 위협은 무엇이라고 생각하는가?",
      "북한의 도발에 어떻게 대응해야 하는가?",
      "사관학교 / 경찰대 진학을 결심한 결정적 계기는?",
    ],
  },
  {
    cat: "리더십",
    items: [
      "리더로서 가장 어려웠던 결정과 그 결과는?",
      "팀에서 갈등이 생겼을 때 어떻게 해결했나?",
      "본인의 리더십 스타일을 한 단어로 표현한다면?",
    ],
  },
  {
    cat: "시사 이슈",
    items: [
      "최근 1주일 가장 인상 깊었던 뉴스와 본인 견해는?",
      "AI의 군사적 활용에 대해 어떻게 생각하는가?",
      "MZ세대 군 복무 인식 변화에 대한 본인 의견은?",
    ],
  },
  {
    cat: "자기소개·진로",
    items: [
      "30초 자기소개를 해보세요.",
      "10년 후 본인의 모습은?",
      "체력 부족 시 임관 후 어떻게 극복할 것인가?",
    ],
  },
]

const CHECKLIST = {
  d7: [
    "학교별 면접 방식·시간 최종 확인",
    "최근 1주일 시사 이슈 5개 정리",
    "자기소개 60초·30초 버전 암기",
    "복장(정장) 준비 및 시험 운동",
  ],
  d1: [
    "면접장 위치·교통편 확인",
    "신분증·수험표·필기구 준비",
    "취침 6시간 이상 확보",
    "당일 답변 키워드 5개만 복기",
  ],
  day: [
    "1시간 전 도착 + 화장실 위치 확인",
    "도착 직후 답변 키워드 마지막 점검",
    "면접 직전 호흡 3회 + 미소 연습",
    "답변 중 모르는 질문은 솔직히",
  ],
}

const MOCK_SLOTS = [
  { date: "06.10 (수)", time: "19:00", mentor: "김O준 (육사 24기)", available: true },
  { date: "06.11 (목)", time: "20:00", mentor: "유O재 (경찰대 41기)", available: true },
  { date: "06.13 (토)", time: "10:00", mentor: "오O진 (국간사 67기)", available: false },
  { date: "06.13 (토)", time: "14:00", mentor: "정O호 (공사 73기)", available: true },
  { date: "06.14 (일)", time: "11:00", mentor: "조O린 (해사 80기)", available: true },
]

export default function InterviewPage() {
  const [activeStage, setActiveStage] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [checkD7, setCheckD7] = useState<boolean[]>(CHECKLIST.d7.map(() => false))
  const [checkD1, setCheckD1] = useState<boolean[]>(CHECKLIST.d1.map(() => false))
  const [checkDay, setCheckDay] = useState<boolean[]>(CHECKLIST.day.map(() => false))

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-900 to-red-900 py-20">
        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/20 px-4 py-2">
            <Users className="h-4 w-4 text-amber-200" />
            <span className="text-sm font-semibold text-amber-100">2차 면접 대비</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            1차 합격은 시작입니다.
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-red-300 bg-clip-text text-transparent">
              면접에서 갈립니다.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-amber-100">
            4단계 면접 구조 + 학교별 비교표 + 빈출 질문 100선 + 합격생 모의면접까지.
          </p>
        </div>
      </section>

      {/* 4단계 타임라인 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">면접 4단계 — 단계 클릭 시 상세 보기</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {STAGES.map((s, i) => {
              const active = activeStage === i
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveStage(i)}
                  className={`rounded-2xl border-2 p-5 text-left transition-all ${
                    active ? "border-amber-500 bg-amber-50 shadow-md" : "border-gray-200 bg-white hover:border-amber-200"
                  }`}
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-amber-500" : "bg-gray-200"}`}>
                    <s.icon className={`h-5 w-5 ${active ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="text-xs font-bold text-gray-400">STEP {i + 1}</div>
                  <div className="font-bold text-gray-900">{s.title}</div>
                </button>
              )
            })}
          </div>

          <Card className="mt-6 border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg">{STAGES[activeStage].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{STAGES[activeStage].detail}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 학교별 비교표 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">학교별 면접 비교</h2>
          <p className="mb-6 text-sm text-gray-500">시간·평가축·방식 한눈에. 모바일에서는 가로 스크롤.</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-500">
                  <th className="px-4 py-2">학교</th>
                  <th className="px-4 py-2">소요 시간</th>
                  <th className="px-4 py-2">핵심 평가축</th>
                  <th className="px-4 py-2">방식</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.school} className={`rounded-xl border-2 ${row.color}`}>
                    <td className="rounded-l-xl border-y-2 border-l-2 border-current px-4 py-4 font-bold text-gray-900">
                      {row.school}
                    </td>
                    <td className="border-y-2 border-current px-4 py-4 text-sm text-gray-700">{row.time}</td>
                    <td className="border-y-2 border-current px-4 py-4 text-sm text-gray-700">{row.focus}</td>
                    <td className="rounded-r-xl border-y-2 border-r-2 border-current px-4 py-4 text-sm text-gray-700">
                      {row.method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 빈출 질문 100선 */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">빈출 질문 100선</h2>
          <p className="mb-6 text-sm text-gray-500">카테고리별 아코디언 — 클릭해서 펼쳐 보세요.</p>

          <div className="space-y-3">
            {FAQ.map((f, i) => {
              const open = openFaq === i
              return (
                <div key={f.cat} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-bold text-gray-900">{f.cat}</span>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <ul className="space-y-2 border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                      {f.items.map((q, qi) => (
                        <li key={qi} className="flex gap-2 text-sm text-gray-700">
                          <span className="font-bold text-amber-600">Q{qi + 1}.</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 모의면접 예약 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1">
              <CalendarCheck className="h-4 w-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-700">합격생 모의면접 예약</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">합격생 멘토와 1:1 실전 연습</h2>
            <p className="mt-2 text-sm text-gray-500">30분 화상 모의면접 + 직후 영상 피드백.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {MOCK_SLOTS.map((slot, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl border-2 p-4 ${
                  slot.available ? "border-gray-200 bg-white hover:border-amber-300" : "border-gray-100 bg-gray-50"
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-gray-900">{slot.date} · {slot.time}</div>
                  <div className="mt-1 text-xs text-gray-500">{slot.mentor}</div>
                </div>
                <Button
                  size="sm"
                  disabled={!slot.available}
                  className={
                    slot.available
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-gray-200 text-gray-400"
                  }
                >
                  {slot.available ? "예약하기" : "마감"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 체크리스트 */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-6 flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-amber-700" />
            <h2 className="text-3xl font-bold text-gray-900">면접 D-DAY 체크리스트</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <ChecklistCard
              title="D-7"
              color="bg-blue-50 border-blue-200"
              items={CHECKLIST.d7}
              checked={checkD7}
              onToggle={(i) => setCheckD7(checkD7.map((v, idx) => (idx === i ? !v : v)))}
            />
            <ChecklistCard
              title="D-1"
              color="bg-amber-50 border-amber-200"
              items={CHECKLIST.d1}
              checked={checkD1}
              onToggle={(i) => setCheckD1(checkD1.map((v, idx) => (idx === i ? !v : v)))}
            />
            <ChecklistCard
              title="당일"
              color="bg-red-50 border-red-200"
              items={CHECKLIST.day}
              checked={checkDay}
              onToggle={(i) => setCheckDay(checkDay.map((v, idx) => (idx === i ? !v : v)))}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-amber-700 to-red-900 py-16 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold text-white">면접, 합격생과 함께 준비하세요</h2>
          <p className="mb-8 text-lg text-amber-100">합격생 모의면접 1회 무료. 사전 신청자 우선.</p>
          <Button className="rounded-lg bg-white px-8 py-6 text-lg font-bold text-red-700 hover:bg-amber-50">
            모의면접 무료 예약
          </Button>
        </div>
      </section>
    </div>
  )
}

function ChecklistCard({
  title,
  color,
  items,
  checked,
  onToggle,
}: {
  title: string
  color: string
  items: string[]
  checked: boolean[]
  onToggle: (i: number) => void
}) {
  const done = checked.filter(Boolean).length
  return (
    <Card className={`border-2 ${color}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{title}</span>
          <span className="text-sm font-normal text-gray-500">
            {done} / {items.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i}>
              <button
                onClick={() => onToggle(i)}
                className="flex w-full items-start gap-2 text-left text-sm hover:bg-white/40 rounded p-1"
              >
                <CheckCircle
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                    checked[i] ? "text-emerald-600" : "text-gray-300"
                  }`}
                />
                <span className={checked[i] ? "text-gray-400 line-through" : "text-gray-800"}>{it}</span>
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
