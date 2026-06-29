import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  Crosshair,
  Flame,
  MessagesSquare,
  Shuffle,
  Sparkles,
  Swords,
  Trophy,
  Wallet,
} from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

type Tone = {
  tint: string
  accent: string
  chip: string
  dot: string
  bar: string
}

const TONES: Record<string, Tone> = {
  red: { tint: "bg-red-50", accent: "text-red-700", chip: "bg-red-100 text-red-700", dot: "bg-red-500", bar: "bg-red-500" },
  emerald: { tint: "bg-emerald-50", accent: "text-emerald-700", chip: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", bar: "bg-emerald-500" },
  blue: { tint: "bg-blue-50", accent: "text-blue-700", chip: "bg-blue-100 text-blue-700", dot: "bg-blue-500", bar: "bg-blue-500" },
  violet: { tint: "bg-violet-50", accent: "text-violet-700", chip: "bg-violet-100 text-violet-700", dot: "bg-violet-500", bar: "bg-violet-500" },
  amber: { tint: "bg-amber-50", accent: "text-amber-700", chip: "bg-amber-100 text-amber-700", dot: "bg-amber-500", bar: "bg-amber-500" },
  teal: { tint: "bg-teal-50", accent: "text-teal-700", chip: "bg-teal-100 text-teal-700", dot: "bg-teal-500", bar: "bg-teal-500" },
  rose: { tint: "bg-rose-50", accent: "text-rose-700", chip: "bg-rose-100 text-rose-700", dot: "bg-rose-500", bar: "bg-rose-500" },
  fuchsia: { tint: "bg-fuchsia-50", accent: "text-fuchsia-700", chip: "bg-fuchsia-100 text-fuchsia-700", dot: "bg-fuchsia-500", bar: "bg-fuchsia-500" },
  slate: { tint: "bg-slate-100", accent: "text-slate-700", chip: "bg-slate-200 text-slate-700", dot: "bg-slate-500", bar: "bg-slate-500" },
}

type Feature = {
  id: number
  icon: typeof Trophy
  eyebrow: string
  title: string
  desc: string
  bullets: string[]
  href: string
  cta: string
  tone: keyof typeof TONES
}

const FEATURES: Feature[] = [
  { id: 1, icon: Trophy, eyebrow: "사관·경찰 모의고사", title: "전용 OMR로 응시, 즉시 채점", desc: "사관학교·경찰대 전형에 맞춘 전용 모의고사. Sakwan에서 답안만 입력하면 그 자리에서 채점되고 합격선까지 매칭됩니다.", bullets: ["Sakwan 전용 OMR로 응시", "제출 즉시 자동 채점", "사관·경찰 전형 형식 그대로"], href: "/mock", cta: "모의고사 체험", tone: "red" },
  { id: 2, icon: Award, eyebrow: "과거 합격자 성적 공개", title: "이 점수면, 작년이면 합격이었을까?", desc: "매 회차마다 과거 합격자들의 실제 성적을 공개합니다. 내 점수를 합격자 DB와 바로 겹쳐 보며 감이 아닌 사실로 판단하세요.", bullets: ["회차별 합격자 성적 DB", "내 점수와 즉시 비교", "학교별 합격컷 한눈에"], href: "/mock", cta: "합격 분석 보기", tone: "emerald" },
  { id: 3, icon: Crosshair, eyebrow: "현재 내 위치 파악", title: "지금 내가 어디쯤인지, 숫자로", desc: "올해 지원자 풀 안에서의 석차와 작년 합격선 대비 위치를 정확히 보여줍니다. 막연한 불안 대신 다음 목표가 분명해집니다.", bullets: ["지원자 내 석차", "작년 합격선 대비 위치", "상위 % 한눈에"], href: "/mock", cta: "내 위치 확인", tone: "blue" },
  { id: 4, icon: BarChart3, eyebrow: "성적·취약·오답 분석", title: "무엇을 메워야 하는지 알려줍니다", desc: "과목별 성적을 분석하고 취약 단원을 자동으로 진단합니다. 틀린 문제는 오답노트로 모아 약점만 골라 다시 공략하세요.", bullets: ["과목별 성적 분석", "취약 단원 자동 진단", "오답 저장·재공략"], href: "/mock", cta: "분석 보기", tone: "violet" },
  { id: 5, icon: Flame, eyebrow: "매일 학습량 경쟁", title: "혼자가 아니라, 함께 달립니다", desc: "플래너로 매일 학습을 관리하고 같은 목표의 수험생들과 학습량을 비교합니다. 매일 보이는 랭킹이 1년 전부터 페이스를 잡아줍니다.", bullets: ["반별 학습량 랭킹", "운동 인증으로 체력 빌드업", "매일 비교되는 구조"], href: "/planner", cta: "플래너 보기", tone: "amber" },
  { id: 6, icon: MessagesSquare, eyebrow: "합격자 맨투맨 멘토링", title: "지금 그 학교 선배가 직접 관리", desc: "롤모델인 합격생이 1:1로 한 명의 수험생을 책임집니다. 주 1회 화상으로 플래너를 점검하고 상담까지 끝까지 이끌어 줍니다.", bullets: ["롤모델 합격생 1:1", "주1 화상 + 플래너 검사", "월1 학부모·학생 상담"], href: "/mentoring", cta: "멘토링 보기", tone: "teal" },
  { id: 7, icon: Swords, eyebrow: "수험생끼리의 경쟁", title: "같은 길 위의 라이벌과 함께", desc: "경찰대·사관학교를 함께 준비하는 수험생들 사이의 건강한 경쟁. 주간 순위 변동을 보며 자극받고 끝까지 긴장을 유지합니다.", bullets: ["같은 목표 수험생 리더보드", "주간 순위 변동", "혼자가 아닌 함께"], href: "/planner", cta: "랭킹 보기", tone: "rose" },
  { id: 8, icon: Shuffle, eyebrow: "교차지원 시뮬레이션", title: "문과? 이과? 공사·육사·해사?", desc: "모의 지원 상황을 보면 고민이 풀립니다. 문↔이과 교차지원, 학교 간 모의지원을 내 점수로 시뮬레이션해 유리한 길을 찾으세요.", bullets: ["문↔이과 교차지원", "공·육·해사 모의지원", "어디가 유리한지 비교"], href: "/mock", cta: "교차지원 분석", tone: "fuchsia" },
  { id: 9, icon: Wallet, eyebrow: "이동 시간·경비 절약", title: "학원 없이도, 어디서나 같은 관리", desc: "스터디플래너·모고·생기북 앱으로 이동 0분, 경비 절약. 학원을 오가는 시간을 그대로 공부에 쓰면서 같은 콘텐츠를 받습니다.", bullets: ["학원 이동 0분", "스터디플래너·모고·생기북", "어디서나 같은 관리"], href: "/planner", cta: "플래너 보기", tone: "slate" },
]

const APPS = [
  { name: "스터디플래너 앱", desc: "매일 학습 관리 · 학습량 경쟁 · 운동 인증" },
  { name: "모고 앱", desc: "사관·경찰 모의고사 · 과거 합격선 · 석차·분석" },
  { name: "생기북 앱", desc: "사관·경찰 키워드로 생기부 진단 · 활동 코칭" },
]

function DeviceFrame({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <div className={`rounded-3xl border border-gray-200 ${tone.tint} p-4 sm:p-6`}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
        <div className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  )
}

function Bubbles({ active }: { active: number }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold ${
            n === active ? "border-red-500 bg-red-500 text-white" : "border-gray-200 text-gray-300"
          }`}
        >
          {n}
        </span>
      ))}
    </div>
  )
}

function FeatureMock({ id, tone }: { id: number; tone: Tone }) {
  if (id === 1) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">2026 사관 1차 · OMR</span>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">응시중</span>
        </div>
        <div className="space-y-2.5">
          {[{ q: 1, a: 3 }, { q: 2, a: 1 }, { q: 3, a: 5 }, { q: 4, a: 2 }].map((r) => (
            <div key={r.q} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-xs font-bold text-gray-500">{r.q}번</span>
              <Bubbles active={r.a} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white">
          제출 → 자동 채점
        </div>
      </div>
    )
  }
  if (id === 2) {
    return (
      <div>
        <div className="mb-4 text-xs font-bold text-gray-500">내 점수 258점 vs 작년 합격선</div>
        <div className="space-y-4">
          {[{ s: "🟢 육사", cut: 62, pass: true }, { s: "🔷 공사", cut: 78, pass: false }, { s: "🔵 해사", cut: 55, pass: true }].map((b) => (
            <div key={b.s}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">{b.s}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${b.pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {b.pass ? "합격권" : "미달"}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full ${b.pass ? "bg-emerald-500" : "bg-red-400"}`} style={{ width: `${b.cut}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (id === 3) {
    return (
      <div className="text-center">
        <div className="text-xs font-bold text-gray-500">올해 지원자 내 위치</div>
        <div className="my-1 text-5xl font-black text-blue-700">상위 18%</div>
        <div className="mb-4 text-xs text-gray-500">1,240명 중 224등</div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full bg-blue-500" style={{ width: "82%" }} />
          <span className="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded bg-gray-900" style={{ left: "82%" }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-gray-400">
          <span>하위</span>
          <span>나</span>
          <span>상위</span>
        </div>
      </div>
    )
  }
  if (id === 4) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">취약 단원 진단</span>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">오답노트 12</span>
        </div>
        <div className="space-y-3">
          {[{ t: "수학 미적분 — 극한", r: 32 }, { t: "국어 비문학 — 사회", r: 41 }, { t: "수학 기하 — 회전체", r: 48 }].map((w) => (
            <div key={w.t}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-gray-700">{w.t}</span>
                <span className="font-bold text-violet-700">{w.r}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-violet-500" style={{ width: `${w.r}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (id === 5 || id === 7) {
    const data = [
      { rank: 1, name: "강○준", h: "8.5h", w: 100, me: false },
      { rank: 2, name: "나 (이○민)", h: "7.2h", w: 84, me: true },
      { rank: 3, name: "박○서", h: "6.8h", w: 79, me: false },
      { rank: 4, name: "정○호", h: "5.1h", w: 60, me: false },
    ]
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500">{id === 5 ? "오늘 학습량 랭킹" : "주간 리더보드"}</span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">공사반</span>
        </div>
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.rank} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${d.me ? "bg-amber-50 ring-1 ring-amber-300" : "bg-gray-50"}`}>
              <span className={`w-4 text-center text-xs font-black ${d.me ? "text-amber-700" : "text-gray-400"}`}>{d.rank}</span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-600 shadow-sm">
                {d.name.slice(0, 1)}
              </div>
              <span className={`flex-1 truncate text-xs ${d.me ? "font-bold text-gray-900" : "text-gray-600"}`}>{d.name}</span>
              <div className="hidden w-16 sm:block">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className={`h-full ${id === 5 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${d.w}%` }} />
                </div>
              </div>
              <span className="w-9 text-right text-[11px] font-bold text-gray-700">{d.h}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (id === 6) {
    return (
      <div>
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-teal-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-teal-700 shadow-sm">김</div>
          <div>
            <div className="text-sm font-bold text-gray-900">김○준 멘토</div>
            <div className="text-[11px] text-gray-500">육사 24기 · 전기공학</div>
          </div>
          <span className="ml-auto rounded-full bg-teal-600 px-2 py-1 text-[10px] font-bold text-white">매칭됨</span>
        </div>
        <div className="space-y-2">
          <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-teal-600 px-3 py-2 text-[11px] text-white">이번 주 플래너 80% 달성했어요!</div>
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-[11px] text-gray-700">잘했어요. 토요일 화상에서 미적분 점검합시다 👍</div>
        </div>
      </div>
    )
  }
  if (id === 8) {
    return (
      <div>
        <div className="mb-3 text-xs font-bold text-gray-500">교차지원 시뮬레이션</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-[11px] font-semibold text-gray-500">현재 (이과)</div>
            <div className="my-1 text-3xl font-black text-gray-900">72%</div>
            <div className="text-[10px] text-gray-400">합격 가능성</div>
          </div>
          <div className="rounded-xl border-2 border-fuchsia-300 bg-fuchsia-50 p-3 text-center">
            <div className="text-[11px] font-semibold text-fuchsia-600">전환 (문과)</div>
            <div className="my-1 text-3xl font-black text-fuchsia-700">75%</div>
            <div className="text-[10px] text-fuchsia-600">수학 가산 +17%p</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-1 text-[11px] font-bold text-fuchsia-700">
          <Shuffle className="h-3.5 w-3.5" /> 문↔이과 · 공↔해사 비교
        </div>
      </div>
    )
  }
  // id === 9
  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {["스터디플래너", "모고", "생기북"].map((a) => (
          <div key={a} className="rounded-xl bg-slate-100 p-2.5 text-center">
            <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[11px] font-black text-slate-600 shadow-sm">앱</div>
            <div className="text-[10px] font-bold text-slate-600">{a}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <div className="text-2xl font-black text-emerald-700">0분</div>
          <div className="text-[10px] text-emerald-700">학원 이동</div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center">
          <div className="text-2xl font-black text-amber-700">↓</div>
          <div className="text-[10px] text-amber-700">학원비·교통비</div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-red-800/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/20 px-5 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-red-300" />
              <span className="text-sm font-semibold text-red-200">경찰대·사관학교 수험생 전문 플랫폼</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              학원 없이도,
              <br />
              <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                합격생 옆자리에서 공부하는 효과
              </span>
            </h1>
            <p className="mb-10 text-xl leading-relaxed text-red-100/80 md:text-2xl">
              과거 합격선으로 내 위치를 알고, 합격생 멘토가 매일 관리하고, 수험생끼리 경쟁한다.
              <br />
              <strong className="text-white">스터디플래너 · 모고 · 생기북</strong> 앱 하나로 전부.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/mock">
                <Button
                  size="lg"
                  className="rounded-lg bg-red-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-red-500/25 hover:bg-red-700"
                >
                  모의고사 무료 체험
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-2 border-white/20 bg-transparent px-8 py-6 text-lg font-semibold text-white hover:bg-white/10"
                >
                  9가지 특징 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3개 앱 띠 */}
      <section className="border-b border-gray-100 bg-white py-14">
        <div className="container mx-auto max-w-6xl px-6">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-gray-400">
            3개의 앱으로 모든 관리를
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {APPS.map((a) => (
              <div key={a.name} className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all hover:shadow-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700">
                  <span className="text-base font-black text-white">앱</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{a.name}</div>
                <p className="mt-1 text-sm text-gray-500">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9가지 특징 쇼케이스 */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">TS 사관 9가지 특징</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">하나하나, 합격을 위한 기능</h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              내 위치를 알고, 매일 관리받고, 함께 경쟁하는 9가지를 차례로 소개합니다.
            </p>
          </div>

          <div className="space-y-20 md:space-y-28">
            {FEATURES.map((f, i) => {
              const tone = TONES[f.tone]
              const reverse = i % 2 === 1
              return (
                <div key={f.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div className={reverse ? "lg:order-2" : ""}>
                    <DeviceFrame tone={tone}>
                      <FeatureMock id={f.id} tone={tone} />
                    </DeviceFrame>
                  </div>
                  <div className={reverse ? "lg:order-1" : ""}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone.tint}`}>
                        <f.icon className={`h-6 w-6 ${tone.accent}`} />
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tone.chip}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                        {String(f.id).padStart(2, "0")} · {f.eyebrow}
                      </span>
                    </div>
                    <h3 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">{f.title}</h3>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600">{f.desc}</p>
                    <ul className="mb-8 space-y-3">
                      {f.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className={`h-5 w-5 flex-shrink-0 ${tone.accent}`} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link href={f.href} className={`inline-flex items-center gap-2 text-base font-bold ${tone.accent} hover:gap-3`}>
                      {f.cta} <ArrowRight className="h-4 w-4 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 내신·체력 팩트 */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">잘못된 정보, 정확히 잡아드립니다</h2>
            <p className="text-gray-600">사관·경찰대 입시는 일반 대입과 완전히 다릅니다.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-8">
              <div className="mb-3 inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">FACT</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">내신은 전혀 안 들어가요</h3>
              <p className="text-gray-700">"내신 망쳤는데 어쩌지" — 사관·경찰대 1차는 내신 미반영. 지금 시작해도 늦지 않습니다.</p>
            </div>
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-8">
              <div className="mb-3 inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">FACT</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">체력은 지금부터 해야 합니다</h3>
              <p className="text-gray-700">"면접 기간 벼락치기" — 안 됩니다. 1년 전부터 안정권. 플래너 운동 인증으로 매일 체크.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5개 클래스 */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">마이클래스 — 내 반을 선택하세요</h2>
            <p className="text-gray-600">5개 반으로 분리 운영. 각 시험 특성에 맞춘 컨텐츠와 멘토.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { href: "/class/army", icon: "🟢", name: "육사반", color: "border-green-300 hover:bg-green-50" },
              { href: "/class/airforce", icon: "🔷", name: "공사반", color: "border-sky-300 hover:bg-sky-50" },
              { href: "/class/navy", icon: "🔵", name: "해사반", color: "border-blue-300 hover:bg-blue-50" },
              { href: "/class/nursing", icon: "🏥", name: "국간사반", color: "border-pink-300 hover:bg-pink-50" },
              { href: "/class/police", icon: "👮", name: "경찰대반", color: "border-indigo-300 hover:bg-indigo-50" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`rounded-2xl border-2 ${c.color} bg-white p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="mb-2 text-4xl">{c.icon}</div>
                <div className="text-lg font-bold text-gray-900">{c.name}</div>
                <div className="mt-1 text-xs text-gray-500">합류하기 →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 사전예약 CTA */}
      <section className="bg-gradient-to-br from-red-700 to-red-900 py-20">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">사전예약 시 파격 할인</h2>
          <p className="mb-8 text-lg text-red-100">
            2026년 6월 4일 정식 개강. 네이버에서 <strong>TS 사관</strong> 검색.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="이메일 입력"
              className="flex-1 rounded-lg bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Button className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-white hover:bg-amber-600">
              사전예약
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 grid gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-800">
                  <span className="text-xs font-black text-white">사관</span>
                </div>
                <span className="text-2xl font-bold">TS 사관</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                경찰대·사관학교 수험생을 위한 전문 학습·입시 플랫폼.
                <br />
                모의고사·플래너·생기부·멘토링·클래스·2차면접까지 한 곳에서.
              </p>
            </div>
            <div className="grid gap-8 text-xs text-gray-400 md:grid-cols-2">
              <div>
                <h5 className="mb-3 font-semibold text-gray-300">거북스쿨</h5>
                <p>대표: 강준호</p>
                <p>사업자등록번호: 772-87-02782</p>
                <p>소재지: 서울 성북구 화랑로 211 벤처창업센터 105</p>
              </div>
              <div>
                <h5 className="mb-3 font-semibold text-gray-300">부설학원 (TS학원)</h5>
                <p>대전지점: 대전 서구 월평동 286, 6층</p>
                <p>연락처: 042-484-3356 / 010-2518-7139</p>
                <p>이메일: withjuno@naver.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 TS 사관. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
