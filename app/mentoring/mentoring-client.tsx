"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle,
  ClipboardCheck,
  ClipboardList,
  Dumbbell,
  MessageCircle,
  MessagesSquare,
  Phone,
  Quote,
  Shield,
  Sparkles,
  Target,
  Users,
  Video,
} from "lucide-react"

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
  { from: "고2 박O민", body: "1차 65점에서 멘토 만난 뒤 78점. 매주 플래너 검사가 진짜 컸어요.", cls: "공사반" },
  { from: "재수생 김O환", body: "재수 시작할 때 멘탈이 다 무너져 있었는데, 같은 길 걸은 멘토 만나니 회복이 빨랐어요.", cls: "육사반" },
  { from: "고3 정O아", body: "국간사는 정보가 너무 없어서 막막했는데, 합격생 선배가 처음부터 끝까지 잡아줬어요.", cls: "국간사반" },
]

// 주 1회 정규 멘토링에서 멘토가 관리하는 항목
const WEEKLY_CARE = [
  {
    icon: ClipboardCheck,
    t: "플래너 작성·실행 관리",
    d: "T스쿨 스터디플래너 앱으로 한 주 계획을 함께 세우고, 실제 실행 여부까지 매주 점검합니다.",
    app: "스터디플래너 앱",
  },
  {
    icon: Target,
    t: "주간 학습 부분 테스트",
    d: "한 주간 학습한 범위를 모고 앱 문제로 테스트해, 아는 척이 아닌 진짜 이해도를 확인합니다.",
    app: "모고 앱",
  },
  {
    icon: Dumbbell,
    t: "체력 검사 준비 관리",
    d: "체력 시험 항목별 준비 상태를 주 단위로 점검해, 면접 시즌 벼락치기를 막습니다.",
    app: "플래너 운동 인증",
  },
]

// 월 1회 상담
const MONTHLY_CARE = [
  {
    icon: Phone,
    t: "월 1회 학부모 상담",
    d: "한 달간의 학습·생활·체력 진행 상황을 학부모님께 정리해 공유하고, 가정에서의 지원 방향을 함께 잡습니다.",
  },
  {
    icon: MessagesSquare,
    t: "월 1회 학생 상담",
    d: "과목별 학습 상황과 현재 학원·과외 등 학습 환경을 진단하고, 진로·학습 방향을 조언합니다.",
  },
]

// 활용하는 3개 앱
const APPS = [
  { icon: ClipboardList, t: "스터디플래너 앱", d: "사관·경찰 커리큘럼에 맞춘 주간 계획과 실행 관리, 운동 인증" },
  { icon: BarChart3, t: "모고 앱", d: "사관·경찰 시험에 맞춘 모의고사로 주간 학습 테스트와 석차 확인" },
  { icon: BookOpen, t: "생기북 앱", d: "사관·경찰 평가 키워드로 생기부를 진단하고 활동 방향을 코칭" },
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
            <span className="text-sm font-semibold text-emerald-100">사관 멘토링</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            사관에 합격한 롤모델 선배가,
            <br />
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              매주 직접 관리합니다.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100">
            T스쿨 스터디플래너·모고·생기북 앱으로, 합격생 멘토가 학습부터 체력·상담까지 한 명의 수험생을 책임지고 끌고 갑니다.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#pricing">
              <Button className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
                멘토링 신청하기
              </Button>
            </a>
            <a href="#program">
              <Button
                variant="outline"
                className="rounded-lg border-2 border-white/20 bg-transparent px-8 py-6 text-lg font-semibold text-white hover:bg-white/10"
              >
                관리 프로그램 보기
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 멘토란 */}
      <section className="border-b border-gray-100 bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-8 md:p-12">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-600">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">멘토는 사관에 합격한 롤모델입니다</h2>
                <p className="text-gray-600">
                  육·공·해·국간사·경찰대 실제 합격생만으로 구성된 멘토 풀. 어제까지의 수험생 입장을 가장 잘 아는 선배가,
                  단순 질의응답이 아니라 한 주 한 주를 직접 관리하는 매니저가 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 관리 프로그램 */}
      <section id="program" className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">멘토 관리 프로그램</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">한 명의 수험생을, 끝까지 책임지고 관리</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              주 1회 정규 멘토링으로 학습과 체력을 점검하고, 월 1회 학부모·학생 상담으로 방향을 잡습니다.
            </p>
          </div>

          {/* 주 1회 정규 멘토링 */}
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">주 1회 정규 멘토링</span>
              <span className="text-sm text-gray-500">매주 화상으로 진행되는 핵심 관리</span>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {WEEKLY_CARE.map((c) => (
                <Card key={c.t} className="border-2 border-emerald-100 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                      <c.icon className="h-6 w-6 text-emerald-700" />
                    </div>
                    <CardTitle className="text-lg">{c.t}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-gray-600">{c.d}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle className="h-3 w-3" /> {c.app} 활용
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 월 1회 상담 */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">월 1회 상담</span>
              <span className="text-sm text-gray-500">학생과 학부모, 양쪽을 함께 관리</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {MONTHLY_CARE.map((c) => (
                <Card key={c.t} className="border-2 border-teal-100 bg-white">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100">
                        <c.icon className="h-6 w-6 text-teal-700" />
                      </div>
                      <div>
                        <CardTitle className="mb-1 text-lg">{c.t}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed text-gray-600">{c.d}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 활용 앱 */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">3개의 앱으로 관리합니다</h2>
            <p className="text-gray-600">멘토의 관리가 감이 아니라 데이터로 이뤄지도록, T스쿨 앱을 사관·경찰 시험에 맞게 변형했습니다.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {APPS.map((a) => (
              <div key={a.t} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-emerald-50/30 p-7 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <a.icon className="h-7 w-7 text-emerald-700" />
                </div>
                <div className="mb-2 text-lg font-bold text-gray-900">{a.t}</div>
                <p className="text-sm leading-relaxed text-gray-600">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">멘토링 비용</h2>
            <p className="text-gray-600">합격생 1:1 관리 프로그램, 모든 항목 포함</p>
          </div>
          <Card className="overflow-hidden rounded-3xl border-2 border-emerald-300 shadow-xl">
            <div className="bg-gradient-to-br from-emerald-700 to-teal-800 px-8 py-10 text-center text-white">
              <div className="mb-2 text-sm font-semibold text-emerald-100">사관 멘토링 정규 프로그램</div>
              <div className="flex items-end justify-center gap-1">
                <span className="text-5xl font-black md:text-6xl">48만원</span>
                <span className="mb-2 text-lg font-medium text-emerald-100">/ 월</span>
              </div>
            </div>
            <CardContent className="p-8">
              <ul className="space-y-3">
                {[
                  "주 1회 정규 멘토링 (화상)",
                  "플래너 작성 및 실행 여부 관리",
                  "한 주간 학습 부분 테스트",
                  "체력 검사 준비 여부 관리",
                  "월 1회 학부모 상담",
                  "월 1회 학생 상담 (학습 진단·진로 조언)",
                  "스터디플래너·모고·생기북 앱 전체 활용",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full rounded-lg bg-amber-500 py-6 text-lg font-bold text-white hover:bg-amber-600">
                멘토링 신청하기
              </Button>
              <p className="mt-3 text-center text-xs text-gray-400">반별 멘토 매칭 후 진행됩니다.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 매칭 플로우 */}
      <section className="bg-white py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">신청부터 매칭까지</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { n: 1, t: "내 반 선택", d: "5개 반 중 지원 학교의 반을 선택", icon: Users },
              { n: 2, t: "멘토 카드 둘러보기", d: "전공·기수·후기로 합격생 멘토 비교", icon: Target },
              { n: 3, t: "1:1 매칭·관리 시작", d: "주1 화상 + 플래너 검사 + 상담 시작", icon: CalendarCheck },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-emerald-50/30 p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-lg font-black text-white">
                    {s.n}
                  </div>
                  <s.icon className="h-5 w-5 text-emerald-700" />
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

      {/* 후기 */}
      <section className="bg-white py-16">
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
          <h2 className="mb-4 text-3xl font-bold text-white">합격생 멘토가 직접 관리합니다</h2>
          <p className="mb-8 text-lg text-emerald-100">
            주 1회 정규 멘토링 + 월 1회 상담. 월 48만원, 모든 관리 항목 포함.
          </p>
          <a href="#pricing">
            <Button className="rounded-lg bg-amber-500 px-8 py-6 text-lg font-bold text-white hover:bg-amber-600">
              멘토링 신청하기
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
