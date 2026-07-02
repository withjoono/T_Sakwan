import Link from "next/link";
import { Newspaper, ArrowRight, Calendar, Tag } from "lucide-react";
import { PromoHero, PromoSection, FinalCTA } from "../_components";

export const metadata = {
  title: "블로그 · 사관·경찰 입시 인사이트 — T 사관",
  description:
    "육·해·공사·국간사·경찰대 진학을 위한 1차 필기·2차 면접·체력·생기부 전략 인사이트. 사관·경찰 준비에 바로 쓰는 정보를 정리해 전합니다.",
};

interface BlogPost {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  href: string;
  featured?: boolean;
}

/**
 * 블로그 초안 데이터.
 * href는 실제 글 URL로 교체하세요. 아직 글이 없으면 관련 콘텐츠 페이지로 임시 연결.
 */
const POSTS: BlogPost[] = [
  {
    title: "내신 망쳐도 사관·경찰은 가능하다 — 1차는 내신 미반영",
    category: "지원 전략",
    date: "2026-06-25",
    excerpt:
      "사관학교·경찰대 1차 전형은 내신을 반영하지 않고 국영수 중심으로 평가합니다. '내신 때문에 늦었다'는 오해를 걷어내고, 지금 시작해도 되는 이유와 준비 로드맵을 정리했습니다.",
    href: "/mock",
    featured: true,
  },
  {
    title: "체력검정, 면접 기간 벼락치기가 안 되는 이유",
    category: "체력·2차",
    date: "2026-06-18",
    excerpt:
      "달리기·윗몸일으키기·팔굽혀펴기·악력까지, 체력은 근성이 아니라 시간으로 쌓입니다. 1년 전부터 안정권을 만드는 주차별 운동 페이스와 플래너 인증 활용법을 짚었습니다.",
    href: "/planner",
  },
  {
    title: "육·해·공사·국간사·경찰대, 2차 면접이 다 다른 이유",
    category: "면접 대비",
    date: "2026-06-11",
    excerpt:
      "같은 사관·경찰이라도 평가 축은 제각각입니다. 육사 국가관·리더십, 공사 조종 적성, 해사 항해 적응성, 국간사 의료 윤리, 경찰대 법치·토론 — 학교별 면접 특성을 비교합니다.",
    href: "/interview",
  },
  {
    title: "합격선으로 내 위치 읽기 — 감이 아니라 숫자로",
    category: "모의고사",
    date: "2026-06-04",
    excerpt:
      "'이 점수면 작년이면 붙었을까?' 과거 합격자 성적 DB에 내 점수를 겹쳐 보면 답이 나옵니다. 지원자 풀 내 석차와 상위 %로 다음 목표를 구체화하는 법.",
    href: "/mock",
  },
  {
    title: "사관·경찰형 생기부, 무엇을 채워야 하나",
    category: "생기부",
    date: "2026-05-28",
    excerpt:
      "리더십·국가관·법치의식·체력·봉사 — 사관과 경찰의 인재상은 다릅니다. 학급 반장, 선도부, 유도 단증, 봉사시간까지 키워드 중심으로 생기부를 진단하고 활동을 설계하는 법.",
    href: "/sanggibu",
  },
  {
    title: "합격생 멘토가 매일 관리하면 무엇이 달라지는가",
    category: "멘토링",
    date: "2026-05-21",
    excerpt:
      "지금 그 학교 선배가 1:1로 붙어 주 1회 화상으로 플래너를 점검합니다. 혼자 달릴 때와 합격생 옆자리에서 달릴 때의 차이를, 실제 관리 사이클로 풀어 설명합니다.",
    href: "/mentoring",
  },
];

const CATEGORIES = [
  "전체",
  "지원 전략",
  "면접 대비",
  "체력·2차",
  "생기부",
  "모의고사",
  "멘토링",
];

export default function PromoBlogPage() {
  const featured = POSTS.find((p) => p.featured) ?? POSTS[0];
  const rest = POSTS.filter((p) => p !== featured);

  return (
    <main>
      <PromoHero
        badge="블로그 · 사관·경찰 입시 인사이트"
        Icon={Newspaper}
        title="사관·경찰 합격이 가까워지는"
        highlight="입시 이야기"
        body="1차 필기·2차 면접·체력·생기부까지, 육·해·공사·국간사·경찰대 준비에 바로 쓰는 정보를 정리해 전합니다."
        primaryHref="/"
        primaryLabel="준비 시작하기"
        secondaryHref="/promo/guide"
        secondaryLabel="사용법 먼저 보기"
      />

      {/* 카테고리 필터 (표시용) */}
      <PromoSection>
        <div className="-mt-4 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c, i) => (
            <span
              key={c}
              className={
                i === 0
                  ? "inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground"
                  : "inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground"
              }
            >
              {i === 0 && <Tag className="h-3.5 w-3.5" />}
              {c}
            </span>
          ))}
        </div>

        {/* 대표 글 */}
        <Link
          href={featured.href}
          className="group mt-10 grid gap-6 overflow-hidden rounded-2xl border bg-card p-6 transition-colors hover:bg-accent sm:grid-cols-2 sm:p-8"
        >
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {featured.category}
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {featured.excerpt}
            </p>
            <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {featured.date}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                자세히 읽기
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-background p-10">
            <Newspaper className="h-16 w-16 text-primary/40" />
          </div>
        </Link>
      </PromoSection>

      {/* 글 목록 */}
      <PromoSection tone="muted" title="최근 글" subtitle="사관·경찰 준비에 바로 쓰는 이야기들">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="group flex flex-col rounded-2xl border bg-card p-6 transition-colors hover:bg-accent"
            >
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {post.category}
              </span>
              <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  읽기
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </PromoSection>

      <FinalCTA
        Icon={Newspaper}
        title="이론은 여기까지, 이제 내 지원 전략으로"
        body="글로 읽은 전략을 내 목표 학교에 바로 적용해 보세요. 전용 모의고사와 합격생 멘토링이 준비를 이어 줍니다."
        primaryHref="/mock"
        primaryLabel="모의고사 체험하기"
      />
    </main>
  );
}
