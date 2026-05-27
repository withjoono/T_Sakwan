"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MessageCircle, MessagesSquare, Quote, Sparkles, Video } from "lucide-react"

type ClassKey = "all" | "army" | "airforce" | "navy" | "nursing" | "police"

const CLASS_LABELS: Record<ClassKey, string> = {
  all: "전체",
  army: "🟢 육사반",
  airforce: "🔷 공사반",
  navy: "🔵 해사반",
  nursing: "🏥 국간사반",
  police: "👮 경찰대반",
}

type Mentor = {
  initial: string
  name: string
  school: string
  cls: ClassKey
  major: string
  year: string
  intro: string
  color: string
}

const MENTORS: Mentor[] = [
  { initial: "김", name: "김O준", school: "육사 24기", cls: "army", major: "전기공학", year: "2024", intro: "1차 점프 60→78점. 미적분 집중 공략법 공유.", color: "border-green-300 bg-green-50" },
  { initial: "박", name: "박O서", school: "육사 23기", cls: "army", major: "국제관계", year: "2023", intro: "재수 끝에 합격. 멘탈·동기부여 위주.", color: "border-green-300 bg-green-50" },
  { initial: "이", name: "이O민", school: "육사 25기", cls: "army", major: "기계공학", year: "2025", intro: "체력 8주 단축 프로그램으로 합격.", color: "border-green-300 bg-green-50" },

  { initial: "정", name: "정O호", school: "공사 73기", cls: "airforce", major: "항공우주", year: "2024", intro: "시력 변수까지 미리 체크하세요.", color: "border-sky-300 bg-sky-50" },
  { initial: "한", name: "한O은", school: "공사 74기", cls: "airforce", major: "전산정보", year: "2025", intro: "공간능력 만점 비결.", color: "border-sky-300 bg-sky-50" },
  { initial: "윤", name: "윤O아", school: "공사 73기", cls: "airforce", major: "외국어", year: "2024", intro: "면접 시사 이슈 답변 설계.", color: "border-sky-300 bg-sky-50" },

  { initial: "조", name: "조O린", school: "해사 80기", cls: "navy", major: "해양공학", year: "2024", intro: "정보 부족한 해사, 실전 가이드.", color: "border-blue-300 bg-blue-50" },
  { initial: "강", name: "강O찬", school: "해사 79기", cls: "navy", major: "국방경영", year: "2023", intro: "비수도권 출신, 1년 만에 합격.", color: "border-blue-300 bg-blue-50" },
  { initial: "임", name: "임O율", school: "해사 81기", cls: "navy", major: "전자", year: "2025", intro: "신체 기준 통과 체력 코칭.", color: "border-blue-300 bg-blue-50" },

  { initial: "오", name: "오O진", school: "국간사 67기", cls: "nursing", major: "간호학", year: "2024", intro: "여학생 면접·인성 면접 노하우.", color: "border-pink-300 bg-pink-50" },
  { initial: "신", name: "신O아", school: "국간사 66기", cls: "nursing", major: "간호학", year: "2023", intro: "내성적인 성향에서 면접 자신감.", color: "border-pink-300 bg-pink-50" },
  { initial: "백", name: "백O연", school: "국간사 68기", cls: "nursing", major: "간호학", year: "2025", intro: "체력 약했던 케이스, 1년 빌드업.", color: "border-pink-300 bg-pink-50" },

  { initial: "유", name: "유O재", school: "경찰대 41기", cls: "police", major: "법학", year: "2025", intro: "재수 후 합격. 1차 변별 단원 정리.", color: "border-indigo-300 bg-indigo-50" },
  { initial: "남", name: "남O석", school: "경찰대 40기", cls: "police", major: "행정학", year: "2024", intro: "체력 PT 1점 차이로 합격.", color: "border-indigo-300 bg-indigo-50" },
  { initial: "권", name: "권O희", school: "경찰대 41기", cls: "police", major: "법학", year: "2025", intro: "여학생 경쟁률 높음, 전략 필수.", color: "border-indigo-300 bg-indigo-50" },
]

const REVIEWS = [
  { from: "고2 박O민", body: "1차 65점에서 멘토 만난 뒤 78점. 매일 플래너 검사가 진짜 컸어요.", cls: "공사반" },
  { from: "재수생 김O환", body: "재수 시작할 때 멘탈이 다 무너져 있었는데, 같은 길 걸은 멘토 만나니 회복이 빨랐어요.", cls: "육사반" },
  { from: "고3 정O아", body: "국간사는 정보가 너무 없어서 막막했는데, 합격생 선배가 처음부터 끝까지 잡아줬어요.", cls: "국간사반" },
]

export default function MentoringPage() {
  const [filter, setFilter] = useState<ClassKey>("all")
  const filtered = filter === "all" ? MENTORS : MENTORS.filter((m) => m.cls === filter)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 py-20">
        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/20 px-4 py-2">
            <MessagesSquare className="h-4 w-4 text-emerald-100" />
            <span className="text-sm font-semibold text-emerald-100">TS 사관 멘토링</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            지금 그 학교에 다니는 선배가,
            <br />
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              어제까지의 당신을 압니다.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100">
            육·공·해·국·경 실제 합격생만으로 구성된 멘토 풀. 반별 매칭 + 1:1 채팅 + 주1 화상.
          </p>
        </div>
      </section>

      {/* 매칭 플로우 */}
      <section className="border-b border-gray-100 bg-white py-12">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { n: 1, t: "내 반 선택", d: "5개 반 중 지원 학교의 반을 선택" },
              { n: 2, t: "멘토 카드 둘러보기", d: "전공·기수·후기로 멘토 비교" },
              { n: 3, t: "1:1 매칭 확정", d: "채팅·화상·플래너 검사 시작" },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-emerald-50/30 p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-lg font-black text-white">
                  {s.n}
                </div>
                <div className="text-lg font-bold text-gray-900">{s.t}</div>
                <div className="mt-1 text-sm text-gray-600">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 멘토 카드 그리드 */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">합격생 멘토</h2>
              <p className="mt-1 text-sm text-gray-500">반별 필터로 내 학교 합격생만 보기</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CLASS_LABELS) as ClassKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                    filter === k ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {CLASS_LABELS[k]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <Card key={m.name} className={`border-2 ${m.color} transition-all hover:-translate-y-1 hover:shadow-lg`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-black text-gray-700 shadow-sm">
                      {m.initial}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{m.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {m.school} · {m.major}
                      </CardDescription>
                    </div>
                    <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-gray-600 shadow-sm">
                      {m.year}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-700">"{m.intro}"</p>
                  <Button className="w-full rounded-lg bg-gray-900 text-white hover:bg-gray-700">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    멘토링 신청
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 멘토링 형식 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">멘토링 형식</h2>
            <p className="mt-2 text-gray-600">상시 채팅 + 주 1회 화상 + 플래너 검사. 면접 시즌엔 모의면접까지.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageCircle, t: "상시 채팅", d: "궁금할 때 바로 질문" },
              { icon: Video, t: "주1 화상", d: "30분 1:1 코칭" },
              { icon: CheckCircle, t: "플래너 검사", d: "어제 학습 피드백" },
              { icon: Sparkles, t: "면접 모의", d: "시즌 한정 실전 연습" },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-emerald-50/30 p-6 text-center">
                <f.icon className="mx-auto mb-3 h-8 w-8 text-emerald-700" />
                <div className="font-bold text-gray-900">{f.t}</div>
                <div className="mt-1 text-xs text-gray-500">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">멘티 후기</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <Card key={r.from} className="border-l-4 border-l-emerald-500">
                <CardContent className="p-6">
                  <Quote className="mb-3 h-6 w-6 text-emerald-300" />
                  <p className="mb-4 text-sm leading-relaxed text-gray-700">{r.body}</p>
                  <div className="text-xs font-bold text-gray-500">
                    {r.from} <span className="text-emerald-700">({r.cls})</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-700 to-slate-900 py-16 text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-3xl font-bold text-white">사전 신청 진행 중</h2>
          <p className="mb-8 text-lg text-emerald-100">2026년 6월 4일 정식 매칭 시작. 사전 신청자 우선 매칭.</p>
          <Button className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
            멘토링 사전 신청
          </Button>
        </div>
      </section>
    </div>
  )
}
