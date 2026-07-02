import Link from "next/link";
import {
  BookOpen,
  UserPlus,
  Target,
  FileText,
  Dumbbell,
  MessagesSquare,
  Trophy,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Rocket,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CheckList,
  FinalCTA,
} from "../_components";

export const metadata = {
  title: "사용법 가이드 — T 사관",
  description:
    "가입 → 목표 학교 선택 → 1차 필기·생기부 준비 → 2차 면접·체력 대비 → 멘토링·모의고사 활용까지. 사관·경찰 진학 준비를 순서대로 안내합니다.",
};

/** 빠른 시작 단계 */
const QUICK_STEPS = [
  {
    title: "Hub에서 가입 (약 1분)",
    body: "거북스쿨 Hub는 T 사관을 포함한 모든 앱이 함께 쓰는 단일 계정입니다. www.tskool.kr에 접속해 이메일 또는 네이버·카카오·구글로 로그인하세요. 한 번만 가입하면 이후 모든 서비스에 자동 로그인됩니다.",
  },
  {
    title: "목표 학교 선택 (마이클래스)",
    body: "육군·해군·공군 사관학교, 국군간호사관학교, 경찰대 중 지원할 학교를 정하고 해당 반에 합류합니다. 학교마다 신체검사·체력·면접 기준이 다르니, 반별로 맞춤 콘텐츠와 멘토가 배정됩니다.",
  },
  {
    title: "1차 필기 · 생기부 준비",
    body: "전용 모의고사(전용 OMR)로 1차 필기 실력을 점검하고, 과거 합격선과 내 점수를 겹쳐 봅니다. 사관·경찰 키워드로 생기부를 진단해 리더십·국가관·법치의식·체력 축을 미리 채웁니다. (1차는 내신 미반영)",
  },
  {
    title: "2차 면접 · 체력 대비",
    body: "체력검정·신체검사는 1년 전부터. 플래너 운동 인증으로 매일 체력을 쌓고, AI 인성 면접·신체검사·체력검정·면접관 대면까지 학교별 2차 전형을 단계별로 준비합니다.",
  },
  {
    title: "멘토링 · 모의고사 활용",
    body: "합격생 멘토가 주 1회 화상으로 플래너를 점검하고 상담까지 이끌어 줍니다. 매 회차 모의고사로 지원자 풀 내 석차·상위 %를 확인하며 원서 접수 전까지 페이스를 유지하세요.",
  },
];

/** 메뉴별 사용법 */
const MENU_GUIDE = [
  {
    icon: UserPlus,
    title: "① 가입 · 로그인",
    body: "Hub 계정 하나로 T 사관과 거북스쿨 전 서비스에 자동 로그인됩니다. 별도 회원가입이 필요 없습니다.",
  },
  {
    icon: Target,
    title: "② 마이클래스 반 선택 ★ 먼저 하세요",
    body: "육사·해사·공사·국간사·경찰대 중 목표 학교 반에 합류하면, 그 시험에 맞춘 콘텐츠와 멘토가 배정됩니다.",
  },
  {
    icon: Trophy,
    title: "③ 전용 모의고사",
    body: "전용 OMR로 응시 → 즉시 자동 채점 → 과거 합격선 비교 → 지원자 내 석차·상위 %까지 한 번에 확인합니다.",
  },
  {
    icon: FileText,
    title: "④ 생기부 진단",
    body: "리더십·국가관·법치의식·체력·봉사 등 사관·경찰 인재상 키워드로 생기부를 진단하고 활동 방향을 코칭받습니다.",
  },
  {
    icon: Dumbbell,
    title: "⑤ 체력 · 2차 면접 대비",
    body: "플래너 운동 인증으로 체력을 쌓고, AI 면접·신체검사·체력검정·면접관 대면까지 학교별 2차를 단계별로 준비합니다.",
  },
  {
    icon: MessagesSquare,
    title: "⑥ 멘토링 · 플래너",
    body: "합격생 멘토의 주1 화상·플래너 검사와 매일 학습량 경쟁으로 원서 접수 전까지 장기 동행합니다.",
  },
];

const TIPS = [
  "사관·경찰대 1차는 내신 미반영 — 지금 시작해도 늦지 않습니다.",
  "체력·신체검사는 벼락치기 불가. 플래너 운동 인증으로 1년 전부터 챙기세요.",
  "학교마다 신체·체력·면접 기준이 다르니 목표 반부터 정확히 선택하세요.",
  "모의고사는 매 회차 과거 합격선과 겹쳐 봐야 내 위치가 사실로 보입니다.",
  "국가관·리더십·법치의식 면접 문항은 생기부 활동과 연결해 답을 준비하세요.",
  "문↔이과, 공↔해사 교차지원은 내 점수로 시뮬레이션한 뒤 유리한 길을 고르세요.",
];

const FAQ = [
  {
    q: "내신이 안 좋은데 사관학교·경찰대 지원이 가능한가요?",
    a: "네. 사관학교·경찰대 1차 전형은 내신을 반영하지 않고 국영수 중심으로 평가합니다. 지금 시작해도 늦지 않으며, T 사관의 전용 모의고사로 내 위치를 사실 기반으로 확인하며 준비할 수 있습니다.",
  },
  {
    q: "체력·신체검사는 언제부터 준비해야 하나요?",
    a: "체력검정과 신체검사는 벼락치기가 통하지 않습니다. 최소 1년 전부터 준비해야 안정권입니다. 스터디플래너의 운동 인증 기능으로 매일 체력을 관리하고, 학교별 신체 기준과 종목별 배점을 미리 점검하세요.",
  },
  {
    q: "학교마다 2차 면접이 다른가요?",
    a: "네. 육사는 국가관·리더십·체력, 공사는 조종 적성·시사·AI 면접, 해사는 장기 항해 적응성, 국간사는 공감·의료 윤리, 경찰대는 법치·윤리·토론 등 학교별 평가 축이 다릅니다. 마이클래스 반별로 학교에 맞춘 대비를 진행합니다.",
  },
  {
    q: "멘토링은 어떻게 진행되나요?",
    a: "지금 그 학교에 다니는 합격생이 1:1로 배정되어 주 1회 화상으로 플래너를 점검하고, 월 1회 학부모·학생 상담까지 진행합니다. 국가관·리더십 면접 등 실제 경험을 바탕으로 원서 접수 전까지 끝까지 동행합니다.",
  },
];

export default function PromoGuidePage() {
  return (
    <main>
      <PromoHero
        badge="사용법 가이드"
        Icon={BookOpen}
        title="처음이라도"
        highlight="순서대로 따라오면 됩니다"
        body="가입 → 목표 학교 선택 → 1차 필기·생기부 준비 → 2차 면접·체력 대비 → 멘토링·모의고사 활용. 사관·경찰 진학 준비의 전 과정을 안내합니다."
        primaryHref="/"
        primaryLabel="지금 시작하기"
        secondaryHref="/promo"
        secondaryLabel="전체 기능 보기"
      />

      {/* 빠른 시작 */}
      <PromoSection
        title="빠른 시작 5단계"
        subtitle="가입부터 2차 대비까지, 아래 순서대로 진행하세요."
      >
        <div className="mx-auto max-w-3xl">
          <StepList steps={QUICK_STEPS} />
        </div>
      </PromoSection>

      {/* 메뉴별 사용법 */}
      <PromoSection
        tone="muted"
        title="메뉴별 사용법"
        subtitle="가입 하나로 시작해 모의고사·생기부·체력·2차 면접·멘토링이 함께 이어집니다."
      >
        <FeatureGrid items={MENU_GUIDE} />
      </PromoSection>

      {/* 활용 팁 */}
      <PromoSection
        title="놓치기 쉬운 활용 팁"
        subtitle="이것만 알아도 사관·경찰 준비가 훨씬 수월해집니다."
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary">
            <Lightbulb className="h-4 w-4" />
            자주 쓰는 꿀팁
          </div>
          <CheckList items={TIPS} />
        </div>
      </PromoSection>

      {/* FAQ */}
      <PromoSection
        tone="muted"
        title="자주 묻는 질문"
        subtitle="사관·경찰 지원 전에 가장 많이 궁금해하시는 내용을 모았습니다."
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-2xl border bg-card p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2 text-center">
            <Link
              href="/promo/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              더 많은 사관·경찰 입시 인사이트는 블로그에서
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </PromoSection>

      <FinalCTA
        Icon={Rocket}
        title="이제 목표 학교를 정할 차례"
        body="Hub 계정으로 로그인하고 모의고사·생기부·체력 준비를 시작하면, 합격생 멘토링이 원서 접수까지 함께합니다."
        primaryHref="/mock"
        primaryLabel="모의고사 체험하기"
      />
    </main>
  );
}
