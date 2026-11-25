import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, ShieldCheck, Target } from "lucide-react"
import Navigation from "@/components/navigation"
import { SCHOOL_LIST } from "@/lib/admission"
import { abs } from "@/lib/seo"

export const metadata: Metadata = {
  title: "T사관 — 사관학교·경찰대 입시 플랫폼 | 모의고사·플래너·생기부",
  description:
    "육사·해사·공사·국군간호사관학교·경찰대 전형을 비교하고, 전용 모의고사와 1차 합불예측·플래너·멘토링·면접 준비를 T사관에서 시작하세요.",
  alternates: { canonical: abs("/") },
  openGraph: {
    url: abs("/"),
    title: "T사관 — 사관학교·경찰대 입시 플랫폼",
    description:
      "5개 학교 전형 비교부터 전용 모의고사, 1차 합불예측과 학습·면접 준비까지.",
  },
}

const SCHOOL_CODES: Record<string, string> = { army: "KMA", navy: "KNA", airforce: "KAFA", nursing: "AFNA", police: "KNPU" }
const tools = [
  { icon: BookOpen, label: "모의고사", title: "실전처럼 풀고, 정확하게 점검", body: "기출과 T사관 모의고사로 시험에 익숙해지세요.", href: "/mock", action: "모의고사 시작" },
  { icon: Target, label: "1차 합불예측", title: "내 점수에서 다음 목표까지", body: "성적을 입력하고 학교별 예측 결과를 확인하세요.", href: "/1cha", action: "내 성적 확인" },
  { icon: CalendarDays, label: "학습관리", title: "오늘의 공부를 내일의 실력으로", body: "플래너와 오답 정리로 나만의 공부 흐름을 만드세요.", href: "/planner", action: "플래너 열기" },
]
export default function HomePage() {
  return <><Navigation /><main className="home-redesign">
    <section className="home-hero">
      <div className="home-hero-copy">
        <p className="eyebrow"><span />사관학교 · 경찰대 입시 플랫폼</p>
        <h1>꿈꾸는 제복,<br /><em>준비의 차이</em>로.</h1>
        <p className="home-lead">학교를 알아보는 첫걸음부터 실전 모의고사까지.<br className="hidden sm:block" /> 당신의 목표에 맞는 준비를 T사관에서 시작하세요.</p>
        <div className="home-actions"><Link className="solid-link" href="/admission">나의 목표 학교 찾기 <ArrowRight size={18} /></Link><Link className="quiet-link" href="/mock">모의고사 바로가기 <ArrowUpRight size={17} /></Link></div>
        <div className="home-assurances"><span><Check size={15} />5개 학교 전형 비교</span><span><Check size={15} />전용 모의고사</span><span><Check size={15} />학습·면접 준비</span></div>
      </div>
      <div className="hero-stage">
        <img className="hero-stage-mascot" src="/mascot/hero-salute.webp" alt="전투복을 입고 경례하는 T사관 거북쌤" width={657} height={1100} />
        <p className="hero-stage-tag"><ShieldCheck size={15} />충성! 거북쌤과 준비하는 사관학교</p>
      </div>
    </section>
    <section className="home-goal">
      <div className="goal-board goal-board-wide">
        <div className="goal-board-intro"><div className="goal-board-top"><span>YOUR NEXT CHAPTER</span><ShieldCheck size={22} /></div>
        <h2>어떤 미래를<br />준비하고 있나요?</h2><p>목표 학교의 모집요강부터 확인해 보세요.</p></div>
        <div className="goal-schools">{SCHOOL_LIST.map((s, i) => <Link href={`/admission/${s.slug}`} key={s.slug}><span className="goal-index">0{i + 1}</span><span>{s.name}</span><ArrowUpRight size={17} /></Link>)}</div>
        <div className="goal-board-bottom"><span className="status-dot" />2027학년도 전형안내</div>
        <img className="goal-mascot" src="/mascot/guide.webp" alt="" width={343} height={489} />
      </div>
    </section>
    <section className="home-uniforms" aria-label="T사관 마스코트 — 육군·공군·해군 제복">
      <div className="home-uniforms-frame">
        <img src="/mascot/uniforms-trio.webp" alt="육군·공군·해군 제복을 입고 경례하는 T사관 거북이 마스코트" width={1600} height={938} />
        <div className="home-uniforms-copy"><p className="eyebrow"><span />THE UNIFORM YOU WANT</p><h2>입고 싶은 제복이<br />정해졌나요?</h2></div>
        <ul className="home-uniforms-labels"><li>육군</li><li>공군</li><li>해군</li></ul>
      </div>
    </section>
    <section className="home-tools"><div className="section-heading"><div><p className="eyebrow">READY, STEP BY STEP</p><h2>지금 필요한 준비부터.</h2></div><p>정보를 찾는 시간은 줄이고,<br />실력을 쌓는 데 집중하세요.</p></div>
      <div className="tool-grid">{tools.map(t => <Link key={t.href} href={t.href} className="home-tool"><div className="tool-top"><span><t.icon size={24} /></span><ArrowUpRight size={19} /></div><p className="tool-label">{t.label}</p><h3>{t.title}</h3><p>{t.body}</p><strong>{t.action}<ArrowRight size={16} /></strong></Link>)}</div>
    </section>
    <section id="schools" className="home-school-section"><div className="section-heading"><div><p className="eyebrow">FIND YOUR SCHOOL</p><h2>같은 꿈, 다른 준비.</h2></div><Link href="/admission">5개 학교 비교하기 <ArrowUpRight size={17} /></Link></div>
      <div className="school-grid">{SCHOOL_LIST.map((s,i) => <article key={s.slug} className="school-card" data-school={s.slug}><img className="school-card-photo" src={`/schools/${s.slug}.webp`} alt={`${s.name} 전경`} width={640} height={400} loading="lazy" /><div className="school-card-top"><span className="school-code">{SCHOOL_CODES[s.slug]}</span><span>0{i+1}</span></div><h3>{s.name}</h3><p>{s.quotaTotal}</p><div className="school-card-detail">{s.distinctive}</div><div className="school-card-links"><Link href={`/admission/${s.slug}`}>전형안내 <ArrowUpRight size={15} /></Link><Link href={`/class/${s.slug}`}>{s.short}반 보기</Link></div></article>)}</div>
    </section>
    <section className="home-next"><div className="home-next-heading"><img className="home-next-photo" src="/mascot/salute-officer.webp" alt="정복을 입고 경례하는 T사관 거북이 마스코트" width={1000} height={570} loading="lazy" /><p className="eyebrow">BEYOND THE FIRST EXAM</p><h2>필기 다음의 준비도,<br />함께 이어갑니다.</h2><p>학생부부터 면접까지 목표에 맞게 준비하세요.</p></div><div className="home-next-links">{[{title:"학생부 관리",desc:"학교생활과 진로의 흐름을 정리하세요.",href:"/sanggibu"},{title:"멘토링",desc:"목표 학교를 향한 준비를 상담하세요.",href:"/mentoring"},{title:"2차 면접 준비",desc:"지원 동기부터 나만의 답변까지.",href:"/interview"}].map(x=><Link href={x.href} key={x.href}><div><h3>{x.title}</h3><p>{x.desc}</p></div><ArrowUpRight size={22}/></Link>)}</div></section>
    <section className="home-closing"><img className="home-closing-mascot" src="/mascot/field-sticker.webp" alt="전투복 차림의 T사관 거북쌤" width={451} height={700} loading="lazy" /><h2>목표가 정해졌다면, 이제 한 걸음.</h2><Link className="solid-link" href="/admission">전형안내 살펴보기 <ArrowRight size={18}/></Link></section>
  </main></>
}
