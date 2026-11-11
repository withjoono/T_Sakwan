import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Dumbbell,
  FileText,
  Gift,
  Landmark,
  Snowflake,
  Sparkles,
  Target,
  Timer,
  Trophy,
  UserRound,
} from "lucide-react"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, faqPage, graph } from "@/lib/seo"

/*
 * /promo/start — 「기말고사 끝나면 바로, 2028 사관 준비」 캠페인 (2026-11)
 * 첫 이벤트: T사관 모의 1회 무료 응시 (lib/sakwan/mock-products.ts FREE_ROUNDS = [1])
 *
 * 문구 원칙 (claude/sakwan-service-inventory.md)
 * - 지금 작동하는 기능(기출 채점·T사관 모의·분석·1차 예측·전형 안내)만 "쓸 수 있다"고 쓴다.
 * - 데모 상태인 플래너·생기부 진단은 "준비 중"으로만 표기한다.
 * - 합격선(cutoffs.ts 예시 데이터)·경쟁률·후기·석차는 쓰지 않는다.
 * - 시험 시간·문항 수는 2027 모집요강(lib/admission) 기준. 2028 일정은 시행계획 공개 전이라 날짜를 쓰지 않는다.
 */

const ROUND1 = "/mock/tsagwan/round/1"

const TITLE = "기말고사 끝나면 바로, 2028 사관학교·경찰대 준비 시작 | T사관 모의 1회 무료"
const DESCRIPTION =
  "2학기 기말고사가 끝나는 날부터 T사관 모의고사 1회를 무료로 풀어 보세요. 실제 1차와 같은 국어·영어·수학 30문항, OMR 입력 즉시 채점과 취약 분석까지. 육사·해사·공사·국간사·경찰대 준비는 겨울방학부터."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: abs("/promo/start") },
  openGraph: { url: abs("/promo/start"), title: TITLE, description: DESCRIPTION },
}

const WHY_NOW = [
  {
    icon: Snowflake,
    title: "겨울방학이 가장 긴 공부 시간",
    body: "1차 시험 전에 오는 긴 방학은 이번 겨울과 내년 여름뿐이고, 여름방학은 시험 직전입니다. 기본기를 다시 다질 수 있는 마지막 긴 구간이 지금입니다.",
  },
  {
    icon: Landmark,
    title: "지원 학교는 봄에 정해야 합니다",
    body: "2027학년도 기준 경찰대 원서접수는 5월, 사관학교 4곳은 6월입니다. 1차 시험은 다섯 곳이 같은 날 치러 한 곳만 지원할 수 있습니다.",
  },
  {
    icon: Dumbbell,
    title: "체력은 몇 주 만에 오르지 않습니다",
    body: "학교마다 체력검정 종목과 과락선이 다릅니다. 목표 학교 기준을 겨울에 확인해 두어야 봄부터 여유 있게 끌어올릴 수 있습니다.",
  },
  {
    icon: Target,
    title: "출발점을 모르면 계획이 없습니다",
    body: "학교 내신 시험과 사관 1차는 문항 수·시간·난이도가 다릅니다. 실제 형식으로 한 번 풀어 봐야 어느 과목부터 손댈지 보입니다.",
  },
]

const STEPS = [
  { title: "T스쿨 계정으로 로그인", body: "기존 T스쿨 계정 하나면 됩니다. 결제 단계 없이 바로 1회 페이지가 열립니다." },
  { title: "국어·영어·수학 문제지 받기", body: "1회 문제지 PDF 3과목을 내려받아 출력하거나 태블릿에 띄웁니다." },
  { title: "실제 시간표대로 풀기", body: "국어 50분, 영어 50분, 수학 100분. 시험 당일 순서 그대로 한 번에 풀어 보길 권합니다." },
  { title: "OMR에 답 입력 → 즉시 채점", body: "답을 입력하면 그 자리에서 채점되고, 과목별 점수와 취약 유형이 바로 나옵니다." },
  { title: "답지·해설로 복습", body: "점수를 입력하면 1회 답지와 해설서가 열립니다. 틀린 문항은 오답노트로 이어집니다." },
]

const FEATURES = [
  {
    icon: Landmark,
    tag: "전형 정보",
    title: "5개 학교 모집요강, 원문 기준",
    body: "육사·해사·공사·국간사·경찰대의 일정·정원·1차·체력·면접을 각 학교 모집요강 원문에서 옮겨 나란히 비교합니다. 요강에 없는 내용은 없다고 적습니다.",
    href: "/admission",
    action: "5개 학교 비교",
  },
  {
    icon: BookOpen,
    tag: "기출",
    title: "1차 기출 5개년, OMR 자동 채점",
    body: "사관학교 1차 기출 2022~2026을 실제 정답표와 배점표로 채점합니다. 모의 1회 다음 단계로 기출을 한 해씩 돌며 실력을 확인하세요.",
    href: "/mock/past",
    action: "기출 풀기",
  },
  {
    icon: Trophy,
    tag: "T사관 모의고사",
    title: "기출을 다 본 뒤를 위한 신유형",
    body: "T사관이 직접 출제한 회차형 모의고사입니다. 기출과 겹치지 않는 문항으로, 외운 답이 아니라 실력을 확인합니다.",
    href: "/mock/tsagwan",
    action: "회차 보기",
  },
  {
    icon: BarChart3,
    tag: "분석",
    title: "과목별 정답률·취약 유형·오답노트",
    body: "응시 결과로 과목별 정답률, 회차별 점수 추이, 자주 틀리는 유형을 정리합니다. 다음에 공부할 단원이 숫자로 보입니다.",
    href: "/mock/score-analysis",
    action: "분석 보기",
  },
  {
    icon: Target,
    tag: "1차 합불 예측",
    title: "가채점 점수로 학교별 판정",
    body: "지망 학교·계열·성별과 가채점 원점수를 넣으면, 응시자 분포를 반영해 표준점수로 환산하고 모집단위별로 판정합니다.",
    href: "/1cha",
    action: "예측 살펴보기",
  },
  {
    icon: UserRound,
    tag: "계정",
    title: "T스쿨 계정 하나로 전부",
    body: "따로 가입할 필요 없이 T스쿨 공통 계정으로 모의고사·채점·분석을 이어서 씁니다.",
    href: "/promo",
    action: "서비스 전체 보기",
  },
]

const ROADMAP = [
  { when: "기말 직후", title: "모의 1회로 출발점 확인", body: "무료 1회를 실제 시간표대로 풀고, 과목별 점수와 취약 유형을 확인합니다.", now: true },
  { when: "겨울방학", title: "기출 5개년 돌리기", body: "1회에서 약했던 과목부터 기출을 한 해씩 풀며 같은 유형을 반복합니다." },
  { when: "3 ~ 4월", title: "체력 · 학생부", body: "목표 학교 체력 과락선보다 여유 있게 목표를 잡고, 학생부 반영 방식을 확인합니다." },
  { when: "5월", title: "경찰대 원서접수", body: "경찰대는 사관학교보다 한 달 먼저 접수합니다." },
  { when: "6월", title: "사관학교 원서접수", body: "육사·해사·공사·국간사 4곳이 같은 기간에 받습니다." },
  { when: "7월 ~ 1차", title: "T사관 모의 → 1차 시험", body: "실전 회차로 마지막 점검을 하고, 가채점 뒤 1차 합불 예측으로 2차 준비로 넘어갑니다." },
]

const FAQ = [
  {
    q: "모의 1회는 정말 무료인가요?",
    a: "네. T스쿨 계정으로 로그인하면 결제 없이 1회 문제지 다운로드, OMR 채점, 성적·취약 분석을 이용할 수 있습니다. 답지와 해설서는 점수를 입력한 뒤 열립니다. 2~5회는 회차 패키지로 이용합니다.",
  },
  {
    q: "언제부터 풀 수 있나요?",
    a: "지금 바로 열려 있습니다. 학교마다 기말고사 일정이 달라 날짜를 정하지 않았습니다. 기말이 끝나는 날, 하루를 비워 실제 시간표대로 풀어 보길 권합니다.",
  },
  {
    q: "어떤 문제로 구성돼 있나요?",
    a: "T사관이 2027학년도 1차 대비용으로 출제해 2026년 7월에 시행한 1회차입니다. 사관학교 1차와 같은 국어 30문항, 영어 30문항, 수학 30문항(공통 22 + 선택 8) 형식입니다.",
  },
  {
    q: "아직 고2인데 범위를 다 안 배웠어요.",
    a: "괜찮습니다. 모르는 문항은 비워 두고 채점하면 그 단원이 취약 유형으로 그대로 드러납니다. 지금 점수보다 겨울방학에 어디부터 채울지를 정하는 데 쓰는 회차입니다.",
  },
  {
    q: "경찰대 준비생도 응시할 수 있나요?",
    a: "응시는 가능합니다. 다만 경찰대 1차는 국어·영어 각 45문항, 수학 25문항으로 사관학교와 형식이 다릅니다. 1회는 국·영·수 기본기 진단용으로 쓰고, 경찰대 형식은 전형 안내에서 따로 확인하세요.",
  },
  {
    q: "2028학년도 시험 일정은 확정됐나요?",
    a: "아직입니다. 각 학교 2028학년도 시행계획이 공개되면 전형 안내에 반영합니다. 이 페이지의 월별 흐름은 2027학년도 모집요강 기준입니다.",
  },
]

export default function PromoStartPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["T사관 서비스 소개", "/promo"],
            ["2028 준비 시작 이벤트", "/promo/start"],
          ]),
          faqPage(FAQ),
        )}
      />
      <main>
        {/* ===== HERO ===== */}
        <section className="pm-hero">
          <div>
            <p className="eyebrow">
              <span />
              2028학년도 사관학교 · 경찰대 · 예비 고3
            </p>
            <h1>
              기말고사 끝난 날,
              <br />
              <em>사관 준비를 시작합니다.</em>
            </h1>
            <p className="pm-hero-lead">
              내신이 끝나면 다음 시험은 사관 1차입니다. 첫 이벤트로 T사관 모의고사 1회를 무료로 열었습니다. 실제 1차와 같은
              형식으로 풀고, 바로 채점하고, 겨울방학에 무엇부터 할지 정하세요.
            </p>
            <div className="pm-actions">
              <Link className="solid-link" href={ROUND1}>
                모의 1회 무료로 풀기 <ArrowRight size={18} />
              </Link>
              <a className="quiet-link" href="#event">
                이벤트 자세히 <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="pm-proof">
              <div>
                <b>무료</b>
                <span>모의 1회 · 로그인만</span>
              </div>
              <div>
                <b>90문항</b>
                <span>국·영·수 각 30문항</span>
              </div>
              <div>
                <b>즉시</b>
                <span>OMR 채점 · 취약 분석</span>
              </div>
            </div>
          </div>

          <div className="pms-ticket" aria-label="이벤트 요약">
            <div className="pms-ticket-top">
              <span>EVENT 01</span>
              <Gift size={18} />
            </div>
            <h2>T사관 모의 1회 무료 응시</h2>
            <p className="pms-ticket-sub">기말고사가 끝나는 날부터</p>
            <dl>
              <div>
                <dt>대상</dt>
                <dd>육사·해사·공사·국간사·경찰대 준비생</dd>
              </div>
              <div>
                <dt>과목</dt>
                <dd>국어 50분 · 영어 50분 · 수학 100분</dd>
              </div>
              <div>
                <dt>비용</dt>
                <dd>무료 (T스쿨 계정 로그인)</dd>
              </div>
              <div>
                <dt>채점</dt>
                <dd>OMR 입력 즉시 · 과목별 분석</dd>
              </div>
              <div>
                <dt>복습</dt>
                <dd>점수 입력 후 답지 · 해설서 공개</dd>
              </div>
            </dl>
            <Link className="pms-ticket-cta" href={ROUND1}>
              1회 응시 페이지로 <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ===== 왜 지금 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  WHY NOW
                </p>
                <h2 className="pm-h2">왜 기말고사 직후일까요</h2>
                <p className="pm-lead">사관학교·경찰대 준비는 시험 날짜에서 거꾸로 계산하면 생각보다 빠듯합니다.</p>
              </div>
            </div>
            <div className="pms-why">
              {WHY_NOW.map(({ icon: Icon, title, body }) => (
                <article key={title}>
                  <span className="pms-icon">
                    <Icon size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 이벤트 01 ===== */}
        <section id="event" className="pm-section">
          <div className="pm-wrap">
            <div className="pm-feature">
              <div className="pm-feature-copy">
                <span className="pm-feature-label">
                  <Sparkles size={14} />
                  EVENT 01 · 모의 1회 무료 응시
                </span>
                <h3>첫 회차는 점수보다 지도입니다</h3>
                <p>
                  한 번 실전 형식으로 풀면 과목별로 어디가 비어 있는지 보입니다. 그 결과로 겨울방학 계획을 세우고, 같은 유형을
                  기출로 다시 확인하세요.
                </p>
                <ul className="pms-steps">
                  {STEPS.map((s, i) => (
                    <li key={s.title}>
                      <b>{i + 1}</b>
                      <div>
                        <strong>{s.title}</strong>
                        <span>{s.body}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link className="solid-link pms-cta" href={ROUND1}>
                  지금 1회 풀러 가기 <ArrowRight size={18} />
                </Link>
              </div>
              <div className="pm-feature-visual">
                <div className="pms-timetable" aria-label="1회 시간표">
                  <p>
                    <Timer size={14} /> 실제 1차 시간표대로
                  </p>
                  {[
                    ["1교시", "국어", "50분", "30문항 · 객관식"],
                    ["2교시", "영어", "50분", "30문항 · 객관식"],
                    ["3교시", "수학", "100분", "공통 22 + 선택 8"],
                  ].map(([p, s, t, d]) => (
                    <div key={p}>
                      <span>{p}</span>
                      <b>{s}</b>
                      <em>{t}</em>
                      <small>{d}</small>
                    </div>
                  ))}
                  <small className="pms-src">시간·문항 수: 2027학년도 육군사관학교 모집요강 1차 시간표 기준</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== T사관 특징 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  WHY T사관
                </p>
                <h2 className="pm-h2">1회 다음에도 이어지는 T사관</h2>
                <p className="pm-lead">
                  수능용 도구를 그대로 쓰지 않습니다. 문항 수와 시간, 채점 방식, 합불 판정까지 사관학교·경찰대 기준으로 만들었습니다.
                </p>
              </div>
            </div>
            <div className="pms-grid">
              {FEATURES.map(({ icon: Icon, tag, title, body, href, action }) => (
                <Link key={title} href={href} className="pms-card">
                  <div className="pms-card-top">
                    <span className="pms-icon">
                      <Icon size={20} />
                    </span>
                    <ArrowUpRight size={18} />
                  </div>
                  <span className="pms-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <strong>
                    {action} <ArrowRight size={14} />
                  </strong>
                </Link>
              ))}
            </div>
            <div className="pms-soon">
              <span>준비 중</span>
              <p>
                <CalendarDays size={15} /> 사관·경찰 일정에 맞춘 스터디플래너
              </p>
              <p>
                <FileText size={15} /> 사관·경찰형 생기부 진단
              </p>
              <small>겨울방학 중 순서대로 열 예정입니다.</small>
            </div>
          </div>
        </section>

        {/* ===== 로드맵 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  ROADMAP
                </p>
                <h2 className="pm-h2">기말고사 다음 날부터 1차 시험까지</h2>
                <p className="pm-lead">모의 1회는 이 흐름의 첫 칸입니다.</p>
              </div>
            </div>
            <div className="pm-timeline">
              {ROADMAP.map((t) => (
                <div className={`pm-tl${t.now ? " now" : ""}`} key={t.when}>
                  <div className="pm-tl-when">{t.when}</div>
                  <h4>{t.title}</h4>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
            <p className="pm-note">
              월별 일정은 2027학년도 모집요강 기준입니다. 2028학년도 일정은 각 학교 시행계획이 나오면{" "}
              <Link href="/admission" style={{ textDecoration: "underline" }}>
                전형 안내
              </Link>
              에 반영합니다.
            </p>
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
                <h2 className="pm-h2">이벤트 자주 묻는 질문</h2>
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
          <ClipboardCheck size={30} color="#a56850" style={{ margin: "0 auto 18px" }} />
          <h2>
            마지막 기말 답안지를 낸 날,
            <br />
            첫 사관 답안지를 채워 보세요.
          </h2>
          <p>T스쿨 계정으로 로그인하면 결제 없이 1회가 열립니다. 채점과 분석은 답을 입력하는 즉시 나옵니다.</p>
          <div className="pm-actions">
            <Link className="solid-link" href={ROUND1}>
              모의 1회 무료로 풀기 <ArrowRight size={18} />
            </Link>
            <Link className="quiet-link" href="/admission">
              목표 학교 먼저 보기 <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
