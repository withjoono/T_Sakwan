import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Dumbbell,
  FileSearch,
  GraduationCap,
  Landmark,
  MessagesSquare,
  NotebookPen,
  School,
  Target,
  Trophy,
  Users,
} from "lucide-react"
import JsonLd from "@/components/json-ld"
import { SCHOOL_LIST } from "@/lib/admission"
import { abs, breadcrumb, faqPage, graph } from "@/lib/seo"

/*
 * /promo — T사관 사용자 모집용 서비스 소개 페이지 (2026-10 재작성)
 * 서비스 목록 근거: 프로젝트 문서 claude/sakwan-service-inventory.md
 * - 숫자는 코드·요강에서 확인된 것만 쓴다(기출 2022~2026, 모의고사 패키지가, 멘토링 월 48만원, 요강 일정).
 * - 합격선 수치(cutoffs.ts)는 예시 데이터라 쓰지 않는다. 멘토 실명·수강 후기도 싣지 않는다.
 */

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "https://tskool.kr"

const TITLE = "T사관 — 사관학교·경찰대 준비를 한 앱에서 | 모의고사·플래너·생기부·면접"
const DESCRIPTION =
  "육사·해사·공사·국간사·경찰대 준비생을 위한 T사관. 1차 기출 OMR 자동 채점과 T사관 모의고사, 성적·취약 분석, 1차 합불 예측, 스터디플래너·운동 인증, 생기부 진단, 2차 면접 대비, 합격생 1:1 멘토링까지 T스쿨 계정 하나로."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: abs("/promo") },
  openGraph: { url: abs("/promo"), title: TITLE, description: DESCRIPTION },
}

const SCHOOL_CODES: Record<string, string> = { army: "KMA", navy: "KNA", airforce: "KAFA", nursing: "AFNA", police: "KNPU" }

const STAGES = [
  {
    no: "STEP 01",
    title: "목표 학교 정하기",
    body: "다섯 학교의 전형을 나란히 놓고, 나에게 맞는 학교를 고릅니다.",
    items: [
      { icon: Landmark, label: "5개 학교 전형 비교", href: "/admission" },
      { icon: School, label: "학교별 반", href: "#schools" },
    ],
  },
  {
    no: "STEP 02",
    title: "1차 필기 준비",
    body: "실전 형식으로 풀고, 채점과 분석, 합불 예측까지 한 번에 봅니다.",
    items: [
      { icon: BookOpen, label: "기출 모의고사", href: "/mock/past" },
      { icon: Trophy, label: "T사관 모의고사", href: "/mock/tsagwan" },
      { icon: BarChart3, label: "성적·취약 분석", href: "/mock/score-analysis" },
      { icon: Target, label: "1차 합불 예측", href: "/1cha" },
    ],
  },
  {
    no: "STEP 03",
    title: "매일의 학습 관리",
    body: "공부와 체력을 같은 계획표에 올리고, 매일 실천을 쌓습니다.",
    items: [
      { icon: CalendarCheck, label: "스터디플래너", href: "/planner" },
      { icon: Dumbbell, label: "운동 인증 랭킹", href: "/planner" },
      { icon: NotebookPen, label: "오답노트", href: "/mock/wrong-answers" },
    ],
  },
  {
    no: "STEP 04",
    title: "학생부 · 2차 시험",
    body: "필기 다음의 학생부, 면접, 체력까지 미리 준비합니다.",
    items: [
      { icon: FileSearch, label: "생기부 진단", href: "/sanggibu" },
      { icon: MessagesSquare, label: "2차 면접 대비", href: "/interview" },
      { icon: Users, label: "합격생 1:1 멘토링", href: "/mentoring" },
    ],
  },
]

const TIMELINE = [
  { when: "지금 ~ 2월", title: "현재 위치 확인", body: "기출 한 회로 출발점을 재고, 목표 학교와 플래너를 정합니다.", now: true },
  { when: "3 ~ 4월", title: "체력 · 학생부", body: "지망 학교의 체력 과락선보다 여유 있게 목표를 잡습니다." },
  { when: "5월", title: "경찰대 원서접수", body: "사관학교보다 한 달 먼저 접수가 끝납니다." },
  { when: "6월", title: "사관학교 원서접수", body: "육사·해사·공사·국간사 4곳이 같은 기간에 받습니다." },
  { when: "7월", title: "T사관 모의고사", body: "실전과 같은 시간표로 회차별 응시하고 마지막 점검을 합니다." },
  { when: "8월 초", title: "1차 시험 → 2차", body: "다섯 곳이 같은 날 시험을 봅니다. 가채점 후 합불 예측, 이어서 2차 준비." },
]

const FAQ = [
  {
    q: "어떤 계정으로 이용하나요?",
    a: "T스쿨 공통 계정 하나로 로그인합니다. 학부모·선생님은 T스쿨에서 학생 계정과 연동해 준비 상황을 함께 볼 수 있습니다.",
  },
  {
    q: "경찰대 준비생도 쓸 수 있나요?",
    a: "네. 전형 안내, 학교별 반, 2차 면접·체력 기준에 경찰대가 포함돼 있습니다. 경찰대 1차는 국어·영어 각 45문항 60분, 수학 25문항 80분으로 사관학교와 형식이 달라 따로 안내합니다.",
  },
  {
    q: "비용은 어떻게 되나요?",
    a: "전형 안내와 기출 모의고사 응시·채점은 로그인하면 별도 결제 없이 이용합니다. T사관 모의고사는 회차 패키지(2026년 7월 5회 패키지 180,000원)로, 합격생 1:1 멘토링 정규 프로그램은 월 48만원입니다.",
  },
  {
    q: "1차 합불 예측은 어떻게 계산하나요?",
    a: "지망 학교·계열·성별을 고르고 가채점 원점수를 넣으면, 각 학교 모집요강의 산식으로 환산해 모집단위별로 판정합니다. 예측은 참고 자료이며 실제 합격선은 해마다 응시자 분포에 따라 달라집니다.",
  },
  {
    q: "언제부터 준비하면 되나요?",
    a: "1차 시험은 8월 초 하루에 다섯 곳이 함께 치르고 한 곳만 응시할 수 있습니다. 경찰대 접수는 5월, 사관학교는 6월이라 지원 학교는 봄에 정해야 하고, 체력은 몇 주 만에 끌어올리기 어렵습니다. 지금 기출로 위치를 확인하고 계획을 세우는 것이 가장 빠른 출발입니다.",
  },
]

export default function PromoPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumb([["홈", "/"], ["T사관 서비스 소개", "/promo"]]), faqPage(FAQ))} />
      <main>
        {/* ===== HERO ===== */}
        <section className="pm-hero">
          <div>
            <p className="eyebrow">
              <span />
              2028학년도 사관학교 · 경찰대 준비
            </p>
            <h1>
              1차 필기부터 2차 면접까지,
              <br />
              <em>한 앱에서 준비합니다.</em>
            </h1>
            <p className="pm-hero-lead">
              기출과 전용 모의고사로 풀고, 바로 채점하고, 약한 곳을 찾습니다. 공부와 체력은 플래너에, 학생부와
              면접은 학교별 기준에 맞춰. 육사·해사·공사·국간사·경찰대 준비에 필요한 것을 T사관에 모았습니다.
            </p>
            <div className="pm-actions">
              <Link className="solid-link" href="/mock/past">
                기출로 내 위치 확인하기 <ArrowRight size={18} />
              </Link>
              <Link className="quiet-link" href="/admission">
                5개 학교 전형 비교 <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="pm-proof">
              <div>
                <b>5곳</b>
                <span>사관학교 4곳 + 경찰대</span>
              </div>
              <div>
                <b>5개년</b>
                <span>1차 기출 2022–2026</span>
              </div>
              <div>
                <b>즉시</b>
                <span>국·영·수 OMR 채점</span>
              </div>
            </div>
          </div>

          <div className="pm-preview" aria-label="T사관 화면 예시">
            <div className="pm-report">
              <div className="pm-report-top">
                <span>SCORE REPORT</span>
                <ClipboardCheck size={18} />
              </div>
              <h3>모의고사 채점 결과</h3>
              <p className="pm-report-sub">응시 직후 과목별 점수와 취약 유형을 보여 줍니다</p>
              <div className="pm-bars">
                {[
                  ["국어", 84],
                  ["영어", 90],
                  ["수학", 72],
                ].map(([s, v]) => (
                  <div className="pm-bar" key={s}>
                    <span>{s}</span>
                    <div className="pm-bar-track">
                      <div className="pm-bar-fill" style={{ width: `${v}%` }} />
                    </div>
                    <span>{v}점</span>
                  </div>
                ))}
              </div>
              <div className="pm-report-foot">
                <span className="pm-chip">
                  <i />
                  취약 · 수학 미적분 극한
                </span>
                <span className="pm-chip">
                  <i />
                  취약 · 국어 비문학 사회
                </span>
              </div>
            </div>
            <div className="pm-today">
              <p>TODAY · 플래너</p>
              <ul>
                <li className="done">
                  <span className="box">
                    <Check size={11} />
                  </span>
                  기출 미적분 — 극한 단원
                </li>
                <li className="done">
                  <span className="box">
                    <Check size={11} />
                  </span>
                  비문학 사회 지문 5세트
                </li>
                <li>
                  <span className="box" />
                  달리기 1.5km + 윗몸일으키기
                </li>
              </ul>
            </div>
            <p className="pm-caption">※ 화면 예시입니다.</p>
          </div>
        </section>

        {/* ===== 단계별 서비스 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  ALL SERVICES
                </p>
                <h2 className="pm-h2">준비 순서대로 쓰는 T사관 서비스</h2>
                <p className="pm-lead">목표 학교를 고르는 날부터 2차 면접장에 들어가는 날까지, 단계마다 쓰는 도구가 준비돼 있습니다.</p>
              </div>
            </div>
            <div className="pm-stages">
              {STAGES.map((s) => (
                <div className="pm-stage" key={s.no}>
                  <span className="pm-stage-no">{s.no}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <ul>
                    {s.items.map(({ icon: Icon, label, href }) => (
                      <li key={label}>
                        <Link href={href}>
                          <Icon size={17} />
                          {label}
                          <ArrowUpRight size={15} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 기능 상세 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  HOW IT WORKS
                </p>
                <h2 className="pm-h2">사관·경찰 시험에 맞춰 다시 만든 도구들</h2>
                <p className="pm-lead">
                  일반 수능용 앱을 그대로 쓰지 않습니다. 문항 수와 시간, 평가 키워드, 면접 방식까지 사관학교·경찰대 기준으로
                  바꿨습니다.
                </p>
              </div>
            </div>

            <div className="pm-features">
              {/* 모의고사 */}
              <article className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <Trophy size={14} />
                    모의고사 · 채점 · 분석
                  </span>
                  <h3>실전처럼 풀고, 바로 채점하고, 약한 곳까지</h3>
                  <p>실제 1차 시험과 같은 과목·문항 수·시간으로 응시합니다. 답을 입력하면 그 자리에서 채점되고 분석이 이어집니다.</p>
                  <ul>
                    <li>
                      <CheckCircle2 size={16} />
                      사관학교 1차 기출 2022~2026 5개년 OMR 응시 · 자동 채점
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      기출과 다른 신유형으로 출제한 T사관 자체 모의고사
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      과목별 정답률, 회차별 성적 추이, 취약 유형, 오답노트
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      가채점 점수를 학교별 산식으로 환산하는 1차 합불 예측
                    </li>
                  </ul>
                  <Link className="quiet-link" href="/mock">
                    모의고사 보러 가기 <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="pm-feature-visual">
                  <div className="pm-flow">
                    {[
                      ["응시", "기출 또는 T사관 회차 선택"],
                      ["즉시 채점", "국어·영어·수학 OMR 자동 채점"],
                      ["분석", "정답률 · 취약 유형 · 오답노트"],
                      ["합불 예측", "지망 학교 · 계열 · 성별 기준 환산"],
                    ].map(([t, d], i) => (
                      <div className="pm-flow-step" key={t}>
                        <b>{i + 1}</b>
                        <div>
                          {t}
                          <small>{d}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 플래너 */}
              <article className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <CalendarCheck size={14} />
                    스터디플래너 · 운동 인증
                  </span>
                  <h3>공부와 체력을 같은 계획표에</h3>
                  <p>
                    체력검정은 시험 직전에 끌어올리기 어렵습니다. 하루 계획에 과목 공부와 운동을 함께 올리고, 같은 학교를
                    준비하는 친구들과 실천량을 비교합니다.
                  </p>
                  <ul>
                    <li>
                      <CheckCircle2 size={16} />
                      오늘의 일정 체크 — 과목 · 적성 · 체력 · 시사를 한 화면에
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      육사·해사·공사·국간사·경찰대 반별 학습량 랭킹
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      1주 누적 운동 인증 랭킹
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      합격생 멘토의 플래너 검사와 피드백
                    </li>
                  </ul>
                  <Link className="quiet-link" href="/planner">
                    플래너 열기 <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="pm-feature-visual">
                  <div className="pm-flow">
                    {[
                      ["수학", "사관학교 기출 미적분 — 극한 단원"],
                      ["국어", "비문학 사회 지문 5세트"],
                      ["체력", "달리기 1.5km + 윗몸일으키기 3세트"],
                      ["시사", "오늘의 시사 이슈 1줄 브리핑"],
                    ].map(([t, d]) => (
                      <div className="pm-flow-step" key={t}>
                        <b>
                          <Check size={14} />
                        </b>
                        <div>
                          {t}
                          <small>{d}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 생기부 */}
              <article className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <FileSearch size={14} />
                    생기부 진단
                  </span>
                  <h3>면접관이 보는 키워드로 생기부를 읽습니다</h3>
                  <p>
                    사관학교와 경찰대가 학생부에서 찾는 역량은 일반 대학과 다릅니다. 내 생기부에서 키워드를 뽑아 4대 평가축으로
                    나누고, 부족한 축을 채울 활동을 안내합니다.
                  </p>
                  <ul>
                    <li>
                      <CheckCircle2 size={16} />
                      사관 · 경찰 트랙별 4대 평가축 진단
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      생기부 문장에서 평가 키워드 자동 추출
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      동아리 · 봉사 · 독서 · 대회 영역별 활동 가이드
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      학교별 학생부 반영 방식과 한국사 가산점 안내
                    </li>
                  </ul>
                  <Link className="quiet-link" href="/sanggibu">
                    생기부 진단 받기 <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="pm-feature-visual">
                  <div className="pm-axes">
                    {[
                      ["사관", "리더십 · 통솔력", "학급 임원, 동아리 주장"],
                      ["사관", "국가관 · 안보의식", "안보 토론, 보훈 봉사"],
                      ["경찰", "법치의식 · 준법", "선도부, 모의법정"],
                      ["공통", "체력 · 학업 역량", "체육 활동, 국영수"],
                    ].map(([tag, t, d]) => (
                      <div className="pm-axis" key={t}>
                        <span>{tag}</span>
                        <b>{t}</b>
                        <small>{d}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 2차 면접 */}
              <article className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <MessagesSquare size={14} />
                    2차 면접 · 체력
                  </span>
                  <h3>학교마다 다른 2차 시험, 학교 기준대로</h3>
                  <p>
                    면접 구성과 판정 방식, 체력검정 종목과 과락선은 학교마다 다릅니다. 모집요강 기준을 정리하고, 빈출 질문과
                    시기별 체크리스트로 준비를 이어 갑니다.
                  </p>
                  <ul>
                    <li>
                      <CheckCircle2 size={16} />
                      학교별 면접 구성 · 판정 방식 (모집요강 원문 기준)
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      국가관 · 리더십 · 시사 · 자기소개 빈출 질문
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      D-7 · D-1 · 당일 체크리스트
                    </li>
                    <li>
                      <CheckCircle2 size={16} />
                      5개 학교 체력검정 과락 기준 비교
                    </li>
                  </ul>
                  <Link className="quiet-link" href="/interview">
                    면접 준비 시작 <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="pm-feature-visual">
                  <div className="pm-flow">
                    {[
                      ["인성검사", "학교별 방식 상이 · 국간사는 온라인 실시"],
                      ["신체검사", "학교별 신체 기준 사전 확인"],
                      ["체력검정", "달리기 · 윗몸일으키기 · 팔굽혀펴기 등"],
                      ["면접관 대면", "국가관 · 리더십 · 시사 · 자기소개"],
                    ].map(([t, d], i) => (
                      <div className="pm-flow-step" key={t}>
                        <b>{i + 1}</b>
                        <div>
                          {t}
                          <small>{d}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ===== 학교별 ===== */}
        <section id="schools" className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  FIVE SCHOOLS
                </p>
                <h2 className="pm-h2">같은 날 시험, 다른 준비</h2>
                <p className="pm-lead">다섯 학교는 같은 날 1차를 보지만 정원, 체력 기준, 면접 방식이 모두 다릅니다. 학교별 반에서 내 시험 기준으로 준비하세요.</p>
              </div>
              <Link href="/admission">
                5개 학교 비교하기 <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="school-grid">
              {SCHOOL_LIST.map((s, i) => (
                <article key={s.slug} className="school-card" data-school={s.slug}>
                  <div className="school-card-top">
                    <span className="school-code">{SCHOOL_CODES[s.slug]}</span>
                    <span>0{i + 1}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.quotaTotal}</p>
                  <div className="school-card-detail">{s.distinctive}</div>
                  <div className="school-card-links">
                    <Link href={`/admission/${s.slug}`}>
                      전형안내 <ArrowUpRight size={15} />
                    </Link>
                    <Link href={`/class/${s.slug}`}>{s.short}반 보기</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 일정 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  ROADMAP
                </p>
                <h2 className="pm-h2">지금부터 내년 8월까지</h2>
                <p className="pm-lead">원서접수와 1차 시험 날짜에서 거꾸로 세운 1년 준비 흐름입니다.</p>
              </div>
            </div>
            <div className="pm-timeline">
              {TIMELINE.map((t) => (
                <div className={`pm-tl${t.now ? " now" : ""}`} key={t.when}>
                  <div className="pm-tl-when">{t.when}</div>
                  <h4>{t.title}</h4>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
            <p className="pm-note">
              월별 일정은 2027학년도 모집요강 기준입니다. 2028학년도 일정은 각 학교 시행계획이 나오면 전형 안내에 반영합니다.
            </p>
          </div>
        </section>

        {/* ===== 멘토링 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-mentor">
              <div>
                <p className="eyebrow">
                  <span />
                  1:1 MENTORING
                </p>
                <h2>
                  먼저 그 길을 간 합격생이
                  <br />한 명을 끝까지 맡습니다
                </h2>
                <p>
                  육사·해사·공사·국간사·경찰대 합격생 멘토가 매주 화상으로 플래너 실행과 학습, 체력 준비를 점검하고, 매달
                  학생·학부모와 방향을 맞춥니다.
                </p>
                <Link className="solid-link" href="/mentoring">
                  멘토링 자세히 보기 <ArrowRight size={18} />
                </Link>
              </div>
              <ul>
                <li>
                  <span>주 1회 화상 관리</span>
                  <b>플래너 · 주간 학습 테스트 · 체력</b>
                </li>
                <li>
                  <span>월 1회 학부모 상담</span>
                  <b>진행 상황 공유 · 가정 지원 방향</b>
                </li>
                <li>
                  <span>월 1회 학생 상담</span>
                  <b>학습 진단 · 진로 조언</b>
                </li>
                <li>
                  <span>정규 프로그램</span>
                  <b>월 48만원</b>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  FAQ
                </p>
                <h2 className="pm-h2">자주 묻는 질문</h2>
              </div>
            </div>
            <div className="pm-faq">
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 마무리 ===== */}
        <section className="pm-final">
          <GraduationCap size={30} color="#a56850" style={{ margin: "0 auto 18px" }} />
          <h2>
            기출 한 회로 시작하세요.
            <br />
            지금 내 위치부터 보입니다.
          </h2>
          <p>T스쿨 계정으로 로그인하면 바로 응시할 수 있습니다. 채점과 분석은 응시가 끝나는 즉시 나옵니다.</p>
          <div className="pm-actions">
            <Link className="solid-link" href="/mock/past">
              기출 모의고사 풀기 <ArrowRight size={18} />
            </Link>
            <a className="quiet-link" href={HUB_URL} target="_blank" rel="noopener noreferrer">
              T스쿨 가입하기 <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
