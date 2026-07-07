import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Target,
  Dumbbell,
  MessagesSquare,
  Trophy,
  CalendarCheck,
  ShieldCheck,
  Users,
  FileText,
  CheckCircle2,
  BookOpenCheck,
  Newspaper,
  Rocket,
} from "lucide-react";

export const metadata = {
  title: "T 사관 — 사관학교·경찰대 진학 전문 포털",
  description:
    "육·해·공군 사관학교, 국군간호사관학교, 경찰대 합격을 위한 특화 플랫폼. 전용 모의고사·과거 합격선, 체력·2차 면접 대비, 합격생 1:1 멘토링, 생기부 진단까지 한 곳에서.",
};

const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    title: "사관·경찰만 파는 특화 전형 분석",
    body:
      "사관학교·경찰대 1차는 내신 미반영, 국영수 중심 전형입니다. 일반 대입과 평가 축이 완전히 다른 만큼, 학교별(육·해·공·국간사·경찰대) 전형 구조와 합격선을 정확히 짚어 준비합니다.",
  },
  {
    icon: Dumbbell,
    title: "체력·신체검사·2차는 1년 전부터",
    body:
      "체력검정과 신체검사는 벼락치기가 통하지 않습니다. 플래너 운동 인증으로 매일 체력을 쌓고, 학교별 신체 기준과 종목별 배점을 미리 관리해 2차에서 흔들리지 않습니다.",
  },
  {
    icon: MessagesSquare,
    title: "합격생 멘토가 직접 관리",
    body:
      "지금 그 학교에 다니는 합격생이 1:1로 한 명의 수험생을 책임집니다. 주 1회 화상으로 플래너를 점검하고, 국가관·리더십 면접까지 실제 경험으로 이끌어 줍니다.",
  },
];

// 학교별 진입 (실제 존재하는 /class/[slug] 라우트로 연결)
const CLASS_LINKS = [
  { title: "🟢 육군사관학교반", body: "국가관·리더십·체력 중심 육사 전형 맞춤 관리", href: "/class/army" },
  { title: "🔷 공군사관학교반", body: "조종 적성·시력 기준·AI 면접까지 공사 특화", href: "/class/airforce" },
  { title: "🔵 해군사관학교반", body: "수영·장기 항해 적응성 등 해사 전형 대비", href: "/class/navy" },
  { title: "🏥 국군간호사관학교반", body: "공감·의료 윤리·체력 균형까지 국간사 준비", href: "/class/nursing" },
  { title: "👮 경찰대학반", body: "법치·윤리·5종 체력·토론 면접까지 경찰대 집중", href: "/class/police" },
  { title: "마이클래스 안내", body: "5개 반 분리 운영 — 내 시험에 맞는 반을 고르세요", href: "/class/army" },
];

// 실제 존재하는 콘텐츠 라우트로만 연결
const SERVICES = [
  {
    icon: Trophy,
    title: "사관·경찰 전용 모의고사",
    body:
      "전용 OMR로 응시하면 즉시 자동 채점되고, 과거 합격자 성적 DB와 겹쳐 봅니다. 지원자 풀 내 석차·작년 합격선 대비 위치를 숫자로 확인하세요.",
    href: "/mock",
  },
  {
    icon: CalendarCheck,
    title: "스터디플래너",
    body:
      "매일 학습을 관리하고 같은 목표의 수험생과 학습량을 비교합니다. 운동 인증으로 체력까지 매일 체크 — 1년 전부터 페이스를 잡아 줍니다.",
    href: "/planner",
  },
  {
    icon: MessagesSquare,
    title: "합격자 1:1 멘토링",
    body:
      "롤모델 합격생이 주 1회 화상으로 플래너를 검사하고 월 1회 학부모·학생 상담까지, 원서 접수 전까지 끝까지 동행합니다.",
    href: "/mentoring",
  },
  {
    icon: Users,
    title: "2차 면접·체력 대비",
    body:
      "AI 인성 면접, 신체검사, 체력검정, 면접관 대면까지 학교별로 다른 2차 전형을 단계별로 준비합니다. 국가관·리더십 기출 문항도 함께.",
    href: "/interview",
  },
  {
    icon: FileText,
    title: "생기부 진단·활동 코칭",
    body:
      "사관·경찰 인재상 키워드로 생기부를 진단합니다. 리더십·국가관·법치의식·체력·봉사 등 부족한 축을 찾아 활동 방향을 코칭합니다.",
    href: "/sanggibu",
  },
  {
    icon: Target,
    title: "교차지원·마이클래스",
    body:
      "문↔이과 교차지원, 공·육·해사 모의지원을 내 점수로 시뮬레이션하고, 5개 반으로 나뉜 마이클래스에서 내 시험에 맞는 관리를 받습니다.",
    href: "/class/army",
  },
];

const READY = [
  "사관·경찰 전용 모의고사 + 과거 합격선 비교",
  "지원자 풀 내 석차·상위 % 실시간 확인",
  "학교별(육·해·공·국간사·경찰대) 2차 면접 대비",
  "체력검정·신체검사 기준 관리 + 운동 인증",
  "합격생 1:1 멘토링 (주1 화상 + 플래너 검사)",
  "사관·경찰 키워드 생기부 진단·활동 코칭",
  "문↔이과 교차지원 시뮬레이션",
  "스터디플래너로 매일 학습량 경쟁",
];

export default function PromoPage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#A5141B] via-[#C81E27] to-[#E0453E] text-white">
        {/* 장식 원 */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:px-12 sm:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            거북스쿨 생태계 · 사관·경찰 진학 특화
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            사관·경찰 합격, <span className="text-white/85">특화 전략으로 완성</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
            T 사관은 육·해·공군 사관학교, 국군간호사관학교, 경찰대 진학만을 파고드는 전문 포털입니다. 전용 모의고사·과거 합격선, 체력·2차 면접 대비, 합격생 1:1 멘토링을 한 곳에서 준비하세요.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/mock"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm transition-transform hover:-translate-y-0.5"
            >
              모의고사 무료 체험
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://www.tskool.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Hub에서 가입
            </a>
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-12">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUE_PROPS.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="rounded-2xl border bg-card p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 학교별 반 ===== */}
      <section className="bg-secondary/30 px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              학교마다 다른 전형, 반부터 다릅니다
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              육·해·공사, 국간사, 경찰대는 신체검사·체력·면접 기준이 모두 제각각입니다. 마이클래스는 5개 반으로 나뉘어 각 시험 특성에 맞춘 콘텐츠와 멘토를 배정합니다.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CLASS_LINKS.map((u) => (
              <Link
                key={u.title}
                href={u.href}
                className="group flex flex-col rounded-2xl border bg-card p-5 transition-colors hover:bg-accent"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{u.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
                  </div>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  자세히 보기
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 전문 서비스 (실제 라우트) ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            1차 필기부터 2차 면접까지, 전 과정
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            모의고사·플래너·멘토링·2차 면접·생기부 — 사관·경찰 합격에 필요한 모든 단계를 한 곳에서 지원합니다.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col rounded-2xl border bg-card p-5 transition-colors hover:bg-accent"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  자세히 보기
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== READY ===== */}
      <section className="bg-secondary/30 px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            지금 준비할 수 있는 것
          </h2>
          <p className="mt-4 text-muted-foreground">사관·경찰 합격을 위한 모든 준비가 여기 모여 있습니다.</p>
        </div>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-2 sm:grid-cols-2">
          {READY.map((r) => (
            <li
              key={r}
              className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm text-foreground"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* ===== 사용법 · 블로그 안내 ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/promo/guide"
            className="group flex flex-col rounded-2xl border bg-card p-7 transition-colors hover:bg-accent"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">사용법 가이드</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              가입부터 목표 학교 선택, 1차 필기·생기부 준비, 2차 면접·체력 대비, 멘토링·모의고사 활용까지 — 처음이라도 순서대로 따라오면 됩니다.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              사용법 보기
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/promo/blog"
            className="group flex flex-col rounded-2xl border bg-card p-7 transition-colors hover:bg-accent"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Newspaper className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">블로그 · 사관·경찰 인사이트</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              사관·경찰 입시, 2차 면접, 체력·신체검사 대비에 대한 실전 정보와 합격 전략을 정리해 전합니다.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              블로그 보기
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-12">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Rocket className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          사관·경찰 합격, 지금 시작하세요
        </h2>
        <p className="mt-4 text-muted-foreground">
          내신은 안 들어가고 체력은 지금부터. 전용 모의고사와 합격생 멘토링으로 육·해·공사·국간사·경찰대 합격을 함께 준비합니다.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/mock"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            모의고사 체험하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
