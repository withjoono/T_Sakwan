import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  Dumbbell,
  GraduationCap,
  MessagesSquare,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

const CORE_FEATURES = [
  {
    href: "/mock",
    icon: Trophy,
    title: "사관/경찰 모의",
    badge: "핵심",
    desc: "이 점수면 작년 합격이었나? 과거 합격선·올해 지원자 내 석차를 즉시 확인. 공사↔해사 모의지원, 문↔이과 교차지원 분석까지.",
    bullets: ["과거 합격자 성적 DB", "사관 선택 분석", "교차지원 시뮬레이션"],
    color: "red",
  },
  {
    href: "/planner",
    icon: ClipboardList,
    title: "플래너",
    desc: "T스쿨 플래너를 사관·경찰 커리큘럼에 맞게 변형. 매일 반별 학습량 랭킹과 운동 인증 경쟁으로 1년 전부터 페이스 유지.",
    bullets: ["반별 학습량 랭킹", "운동 인증 (체력 빌드업)", "멘토 플래너 검사"],
    color: "amber",
  },
  {
    href: "/sanggibu",
    icon: Shield,
    title: "생기부 관리",
    desc: "일반 대학과 다른 사관·경찰 평가 키워드(리더십·국가관·체력·법치)로 생기부를 진단. 합격생 사례와 자동 매칭.",
    bullets: ["사관·경찰 전용 키워드", "AI 자동 분류", "활동 가이드"],
    color: "blue",
  },
  {
    href: "/mentoring",
    icon: MessagesSquare,
    title: "멘토링",
    desc: "지금 그 학교에 다니는 합격생 선배가 어제까지의 당신을 압니다. 반별 매칭, 1:1 채팅·화상.",
    bullets: ["육·공·해·국·경 합격생", "반별 매칭", "주1 화상 멘토링"],
    color: "emerald",
  },
  {
    href: "/class/army",
    icon: GraduationCap,
    title: "5개 클래스",
    desc: "육사·공사·해사·국간사·경찰대 5개 반으로 분리 운영. 각 시험 특성에 정확히 맞춘 컨텐츠.",
    bullets: ["반별 합격선 추이", "반별 멘토 매칭", "반별 모의고사 회차"],
    color: "purple",
  },
  {
    href: "/interview",
    icon: Users,
    title: "2차면접",
    desc: "1차 합격은 시작입니다. 면접에서 갈립니다. AI인성·신체·체력·면접관 면접 4단계를 빈출 질문 100선과 모의면접으로 대비.",
    bullets: ["학교별 면접 비교", "빈출 질문 100선", "합격생 모의면접"],
    color: "slate",
  },
]

const colorMap: Record<string, { bg: string; text: string; ring: string; badge: string }> = {
  red: { bg: "bg-red-100", text: "text-red-700", ring: "border-red-200", badge: "bg-red-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-700", ring: "border-amber-200", badge: "bg-amber-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-700", ring: "border-blue-200", badge: "bg-blue-600" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", ring: "border-emerald-200", badge: "bg-emerald-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", ring: "border-purple-200", badge: "bg-purple-600" },
  slate: { bg: "bg-slate-100", text: "text-slate-700", ring: "border-slate-200", badge: "bg-slate-700" },
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
              사관·경찰 전용 모의고사, 합격생 멘토링, 반별 학습량 경쟁까지
              <br />
              하나의 앱에서 전부 — <strong className="text-white">2026년 6월 4일 정식 개강</strong>
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
                  6대 핵심기능 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 3컬럼 */}
      <section className="border-b border-gray-100 bg-white py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Calendar, t: "거리·시간·경비 절약", d: "학원 이동 시간 0분. 어디서나 같은 콘텐츠." },
              { icon: Award, t: "롤모델 합격생 멘토", d: "지금 그 학교 다니는 선배가 1:1로." },
              { icon: Dumbbell, t: "매일 학습량 경쟁", d: "같은 목표 친구들과 매일 비교되는 구조." },
            ].map((v) => (
              <div key={v.t} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                  <v.icon className="h-7 w-7 text-red-700" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{v.t}</h3>
                <p className="text-sm text-gray-600">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6대 핵심기능 그리드 */}
      <section id="features" className="bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2">
              <Sparkles className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">TS 사관 6대 핵심기능</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">필요한 모든 것을, 한 앱에서</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              경찰대·사관학교 합격을 위한 6가지 기능. 클릭하면 바로 체험할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CORE_FEATURES.map((f) => {
              const c = colorMap[f.color]
              return (
                <Link key={f.href} href={f.href} className="group">
                  <Card className={`h-full rounded-2xl border-2 ${c.ring} bg-white transition-all hover:-translate-y-1 hover:shadow-xl`}>
                    <CardHeader className="pb-3">
                      <div className="mb-4 flex items-center justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.bg}`}>
                          <f.icon className={`h-6 w-6 ${c.text}`} />
                        </div>
                        {f.badge && (
                          <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${c.badge}`}>
                            {f.badge}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">{f.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-gray-600">{f.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {f.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className={`h-4 w-4 flex-shrink-0 ${c.text}`} />
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className={`mt-5 flex items-center text-sm font-semibold ${c.text} group-hover:gap-3`}>
                        자세히 보기 <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 내신·체력 팩트체크 */}
      <section className="bg-white py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">잘못된 정보, 정확히 잡아드립니다</h2>
            <p className="text-gray-600">사관·경찰대 입시는 일반 대입과 완전히 다릅니다.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-8">
              <div className="mb-3 inline-flex rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                FACT
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">내신은 전혀 안 들어가요</h3>
              <p className="text-gray-700">
                "내신 망쳤는데 어쩌지" — 사관·경찰대 1차는 내신 미반영. 지금 시작해도 늦지 않습니다.
              </p>
            </div>
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-8">
              <div className="mb-3 inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                FACT
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">체력은 지금부터 해야 합니다</h3>
              <p className="text-gray-700">
                "면접 기간 동안 벼락치기" — 안 됩니다. 1년 전부터 시작해야 안정권. 플래너의 운동 인증으로 매일 체크.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5개 클래스 빠른 진입 */}
      <section className="bg-gray-50 py-20">
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
