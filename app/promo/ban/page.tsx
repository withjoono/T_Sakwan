import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  Check,
  ClipboardCheck,
  FileText,
  Info,
  ListChecks,
  Medal,
  ShieldCheck,
  Swords,
  Trophy,
} from "lucide-react"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, faqPage, graph } from "@/lib/seo"
import "./ban.css"

/*
 * /promo/ban — 「겨울방학 사관반 모집」 캠페인 (2026-11)
 *
 * 문구 원칙 (claude/sakwan-service-inventory.md)
 * - 사관반은 멘토 선생님이 운영하는 "반"이다. 앱 기능 소개가 아니라 반 운영 방식을 쓴다.
 *   운영 내용은 사용자가 확인해 준 6가지만 쓴다:
 *   겨울방학 계획 수립 / 매일 플랜 / 반 안에서 매일 경쟁 / 멘토의 주 1회 플래너 검사 /
 *   사관학교 시험 응시·점수 경쟁 / 멘토의 생기부 관리.
 * - 정원·비용·모집 기간·시험 횟수·멘토 이력은 확정 전이다. 아래 상수가 비어 있으면 화면에 나오지 않는다.
 *   후기·합격 실적·랭킹 수치는 쓰지 않는다.
 * - 화면 그림 3개는 전부 예시다. "예시 화면" 캡션을 지우지 말 것.
 * - 2028학년도 입시는 현행 학교별 선발 기준. 국군사관학교(1+2+1) 체계는 2029학년도 신입생부터
 *   (국방부 2026-11-18 발표). 2028 시행계획이 나오면 TRACKS·FAQ 문구를 다시 확인한다.
 */

/** 신청 링크(폼·카톡 채널 등). 비어 있으면 신청 버튼 대신 "곧 안내" 문구가 나온다. */
const APPLY_HREF = ""
/** 확정되면 채운다. 빈 값은 모집 요약에서 빠진다. 예: "2026.12.01 ~ 12.20", "반별 10명", "월 00만원" */
const RECRUIT_PERIOD = ""
const RECRUIT_QUOTA = ""
const RECRUIT_FEE = ""

const TITLE = "겨울방학 사관반 모집 — 육사·해사·공사·국간사·경찰대 준비반 | T사관"
const DESCRIPTION =
  "사관학교·경찰대를 준비하는 학생들이 한 반에서 매일 플랜을 세우고 서로 경쟁하는 겨울방학 사관반입니다. 멘토 선생님이 방학 계획을 함께 세우고, 플래너를 매주 검사하고, 생기부를 관리합니다. 사관학교 1차 형식 시험으로 점수도 겨룹니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: abs("/promo/ban") },
  openGraph: { url: abs("/promo/ban"), title: TITLE, description: DESCRIPTION },
}

const SUMMARY: [string, string][] = (
  [
    ["대상", "2028학년도 사관학교·경찰대 입시 준비생"],
    ["반", "육사 · 해사 · 공사 · 국간사 · 경찰대"],
    ["기간", "2026 겨울방학"],
    ["모집", RECRUIT_PERIOD],
    ["정원", RECRUIT_QUOTA],
    ["비용", RECRUIT_FEE],
    ["관리", "멘토 선생님 · 주 1회 플래너 검사"],
  ] as [string, string][]
).filter(([, v]) => v)

const PILLARS = [
  {
    icon: CalendarRange,
    tag: "방학 시작 전",
    title: "겨울방학 계획을 멘토와 함께 세웁니다",
    body: "방학 전체에 무엇을 어디까지 끝낼지 먼저 정합니다. 혼자 욕심껏 채운 계획이 아니라, 멘토 선생님이 분량을 같이 보고 세운 계획으로 출발합니다.",
  },
  {
    icon: ListChecks,
    tag: "매일",
    title: "매일 플랜을 직접 세웁니다",
    body: "그날 할 분량을 플래너에 올리고, 끝나면 결과를 남깁니다. 하루 단위로 끊어야 밀린 날이 다음 날 바로 보입니다.",
  },
  {
    icon: Swords,
    tag: "매일",
    title: "같은 목표의 친구들과 매일 겨룹니다",
    body: "반 친구들의 플랜과 달성 정도가 서로 보입니다. 방학에는 학교도 시험도 없습니다. 매일 비교되는 상대가 긴장을 대신합니다.",
  },
  {
    icon: ClipboardCheck,
    tag: "주 1회",
    title: "멘토 선생님이 플래너를 검사합니다",
    body: "일주일에 한 번, 계획한 것과 실제로 한 것을 멘토가 확인합니다. 밀린 분량과 다음 주 계획을 그 자리에서 정리합니다.",
  },
  {
    icon: Trophy,
    tag: "방학 중",
    title: "사관학교 시험을 보고 점수로 겨룹니다",
    body: "사관학교 1차 형식의 국어·영어·수학 시험을 치릅니다. 점수가 반 안에서 비교되므로, 방학 공부가 시험 점수로 이어지는지 바로 확인됩니다.",
  },
  {
    icon: FileText,
    tag: "방학 내내",
    title: "생기부를 멘토 선생님이 관리합니다",
    body: "사관학교도 학생부를 봅니다. 지원하려는 학교에 맞춰 생기부에서 채울 부분을 멘토가 함께 점검하고, 3학년 1학기 준비로 연결합니다.",
  },
]

/** 예시 화면 1 — 오늘의 반 현황. 이름·수치 모두 예시. */
const BOARD = [
  { name: "학생 A", done: 6, total: 6 },
  { name: "학생 B", done: 5, total: 6 },
  { name: "나", done: 5, total: 6, me: true },
  { name: "학생 C", done: 4, total: 5 },
  { name: "학생 D", done: 3, total: 6 },
]

/** 예시 화면 2 — 주간 플래너 검사 */
const WEEK = ["월", "화", "수", "목", "금", "토"]
const WEEK_DONE = [true, true, false, true, true, true]
const CHECK_NOTES = [
  "수요일 수학 2칸 미완료 → 일요일 예비 시간에 보충",
  "영어 구문은 계획보다 빠름 → 다음 주 분량 상향",
  "다음 주 목표: 수학 Ⅰ 삼각함수 단원 마무리",
]

/** 예시 화면 3 — 시험 점수 비교 */
const SCORES = [
  { subject: "국어", mine: 78, avg: 71 },
  { subject: "영어", mine: 84, avg: 80 },
  { subject: "수학", mine: 69, avg: 73 },
]

const DAILY_POINTS = [
  "아침에 오늘 플랜을 올립니다.",
  "끝낸 분량을 그날 안에 기록합니다.",
  "반 친구들의 플랜과 달성 정도가 함께 보입니다.",
]
const WEEKLY_POINTS = [
  "멘토 선생님이 일주일 치 플래너를 검사합니다.",
  "계획과 실제의 차이를 확인하고 밀린 분량을 정리합니다.",
  "다음 주 계획을 조정해 방학 전체 계획과 다시 맞춥니다.",
]
const EXAM_POINTS = [
  "사관학교 1차 시험 형식의 국어·영어·수학을 치릅니다.",
  "점수를 반 친구들과 비교합니다.",
  "약한 과목은 다음 주 플랜에 바로 반영합니다.",
]

const TRACKS = [
  { slug: "army", name: "육사반", school: "육군사관학교" },
  { slug: "navy", name: "해사반", school: "해군사관학교" },
  { slug: "airforce", name: "공사반", school: "공군사관학교" },
  { slug: "nursing", name: "국간사반", school: "국군간호사관학교" },
  { slug: "police", name: "경찰대반", school: "경찰대학" },
]

const FLOW = [
  { when: "방학 시작 전", title: "방학 계획 수립", body: "멘토 선생님과 방학 전체 목표와 분량을 정합니다.", now: true },
  { when: "매일", title: "플랜 · 기록 · 경쟁", body: "오늘 플랜을 올리고, 결과를 남기고, 반 안에서 비교합니다." },
  { when: "주 1회", title: "플래너 검사", body: "멘토가 한 주를 점검하고 다음 주 계획을 조정합니다." },
  { when: "방학 중", title: "시험 · 생기부", body: "사관학교 형식 시험으로 점수를 겨루고, 생기부를 점검합니다." },
]

const FAQ = [
  {
    q: "사관반은 어떤 반인가요?",
    a: "사관학교·경찰대를 준비하는 학생들이 지원 학교별로 모여 겨울방학을 함께 보내는 반입니다. 멘토 선생님이 방학 계획을 같이 세우고, 학생들은 매일 플랜을 세워 서로 경쟁하며, 멘토가 일주일에 한 번 플래너를 검사합니다. 방학 중에는 사관학교 형식의 시험을 보고 점수도 비교합니다.",
  },
  {
    q: "어떤 반이 있나요?",
    a: "육사반·해사반·공사반·국간사반·경찰대반이 있습니다. 지원하려는 학교에 맞춰 신청합니다.",
  },
  {
    q: "지원할 학교를 아직 못 정했는데 신청할 수 있나요?",
    a: "신청할 수 있습니다. 2027학년도 기준으로 4개 사관학교는 1차 시험을 같은 날 같은 문제(국어·영어·수학)로 치르므로, 겨울방학에 해야 할 1차 공부는 학교가 달라도 같습니다. 경찰대는 1차 시험을 따로 치릅니다. 우선 가장 마음이 가는 학교의 반으로 신청하고, 학교별 차이는 입시정보 페이지에서 비교해 보세요.",
  },
  {
    q: "시험은 어떤 문제로 보나요?",
    a: "사관학교 1차 시험과 같은 형식의 국어·영어·수학입니다. 점수는 반 안에서 비교하고, 약한 과목은 다음 주 플랜에 반영합니다.",
  },
  {
    q: "생기부 관리는 무엇을 해 주나요?",
    a: "사관학교 입시에는 학생부가 반영됩니다. 멘토 선생님이 지원하려는 학교를 기준으로 생기부에서 채워야 할 부분을 함께 점검합니다. 학교별 학생부 반영 방식은 입시정보 페이지에 정리해 두었습니다.",
  },
  {
    q: "사관학교가 통합된다는데, 지금 준비해도 달라지는 게 없나요?",
    a: "국방부는 2026년 11월 18일, 1·4학년은 함께 교육하고 2·3학년은 각 군별로 교육하는 국군사관학교 체계를 2029학년도 신입생부터 적용한다고 발표했습니다. 2028학년도 입시는 지금처럼 학교별로 선발하므로 사관반도 학교별로 운영합니다. 2028학년도 시행계획이 공고되면 바뀐 내용을 입시정보 페이지에 바로 반영합니다.",
  },
  {
    q: "신청은 어떻게 하나요?",
    a: APPLY_HREF
      ? "이 페이지의 「사관반 신청하기」 버튼으로 신청합니다."
      : "신청 방법은 이 페이지의 모집 안내에 곧 올립니다.",
  },
]

export default function PromoBanPage() {
  const applyHref = APPLY_HREF || "#apply"
  const applyLabel = APPLY_HREF ? "사관반 신청하기" : "모집 안내 보기"
  const external = /^https?:/.test(APPLY_HREF)
  const applyProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["T사관 서비스 소개", "/promo"],
            ["겨울방학 사관반 모집", "/promo/ban"],
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
              2026 겨울방학 · 사관반 모집
            </p>
            <h1>
              이번 겨울방학,
              <br />
              <em>혼자 버티지 않습니다.</em>
            </h1>
            <p className="pm-hero-lead">
              사관학교·경찰대를 준비하는 학생들이 한 반에 모여 매일 플랜을 세우고 서로 겨룹니다. 멘토 선생님이 방학 계획을 함께
              세우고, 플래너를 매주 검사하고, 생기부까지 관리합니다.
            </p>
            <div className="pm-actions">
              <a className="solid-link" href={applyHref} {...applyProps}>
                {applyLabel} <ArrowRight size={18} />
              </a>
              <a className="quiet-link" href="#how">
                반 운영 방식 <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="pm-proof">
              <div>
                <b>매일</b>
                <span>플랜 세우고 반 안에서 경쟁</span>
              </div>
              <div>
                <b>주 1회</b>
                <span>멘토 선생님 플래너 검사</span>
              </div>
              <div>
                <b>5개 반</b>
                <span>육사 · 해사 · 공사 · 국간사 · 경찰대</span>
              </div>
            </div>
          </div>

          <div className="pms-ticket" aria-label="사관반 모집 요약">
            <div className="pms-ticket-top">
              <span>겨울방학 사관반 · 모집 중</span>
              <Swords size={18} />
            </div>
            <h2>같은 학교를 노리는 친구들과, 매일</h2>
            <p className="pms-ticket-sub">멘토 선생님이 방학 끝까지 관리하는 반</p>
            <dl>
              {SUMMARY.map(([dt, dd]) => (
                <div key={dt}>
                  <dt>{dt}</dt>
                  <dd>{dd}</dd>
                </div>
              ))}
            </dl>
            <a className="pms-ticket-cta" href={applyHref} {...applyProps}>
              {applyLabel} <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* ===== 사관반이 하는 일 ===== */}
        <section id="how" className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  WHAT WE DO
                </p>
                <h2 className="pm-h2">사관반에서 겨울방학 동안 하는 여섯 가지</h2>
                <p className="pm-lead">
                  계획은 멘토와 세우고, 실행은 친구들과 겨루며, 점검은 매주 받습니다. 방학이 끝날 때 남는 것은 지킨 계획과
                  시험 점수입니다.
                </p>
              </div>
            </div>
            <div className="pms-grid">
              {PILLARS.map(({ icon: Icon, tag, title, body }) => (
                <article className="pms-card pmb-card" key={title}>
                  <div className="pms-card-top">
                    <span className="pms-icon">
                      <Icon size={20} />
                    </span>
                  </div>
                  <span className="pms-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 운영 상세 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  HOW IT RUNS
                </p>
                <h2 className="pm-h2">매일, 매주, 그리고 시험</h2>
                <p className="pm-lead">방학 6주가 풀리지 않도록 세 가지 주기로 조입니다.</p>
              </div>
            </div>

            <div className="pm-features">
              {/* 매일 */}
              <div className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <Swords size={14} />
                    매일 · 플랜과 경쟁
                  </span>
                  <h3>내 플랜이 반 친구들 옆에 놓입니다</h3>
                  <p>
                    혼자 세운 계획은 하루 미뤄도 아무도 모릅니다. 사관반에서는 오늘 세운 플랜과 끝낸 분량이 같은 학교를
                    준비하는 친구들과 나란히 보입니다.
                  </p>
                  <ul>
                    {DAILY_POINTS.map((t) => (
                      <li key={t}>
                        <Check size={15} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pm-feature-visual">
                  <div className="pmb-panel" aria-label="오늘의 반 현황 예시">
                    <p className="pmb-panel-top">
                      <span>오늘의 반 현황</span>
                      <b>육사반</b>
                    </p>
                    {BOARD.map((r, i) => (
                      <div className={`pmb-row${r.me ? " me" : ""}`} key={r.name}>
                        <i>{i + 1}</i>
                        <span>{r.name}</span>
                        <div className="pmb-track" aria-hidden="true">
                          <u style={{ width: `${Math.round((r.done / r.total) * 100)}%` }} />
                        </div>
                        <b>
                          {r.done}/{r.total}
                        </b>
                      </div>
                    ))}
                    <small className="pms-src">예시 화면 · 이름과 수치는 실제 학생 기록이 아닙니다</small>
                  </div>
                </div>
              </div>

              {/* 매주 */}
              <div className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <ClipboardCheck size={14} />
                    주 1회 · 플래너 검사
                  </span>
                  <h3>일주일에 한 번, 멘토 선생님이 플래너를 봅니다</h3>
                  <p>
                    방학 계획이 무너지는 건 대개 밀린 분량을 그대로 둘 때입니다. 한 주가 끝나기 전에 멘토가 플래너를 검사하고,
                    밀린 것과 다음 주 계획을 함께 정리합니다.
                  </p>
                  <ul>
                    {WEEKLY_POINTS.map((t) => (
                      <li key={t}>
                        <Check size={15} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pm-feature-visual">
                  <div className="pmb-panel" aria-label="주간 플래너 검사 예시">
                    <p className="pmb-panel-top">
                      <span>주간 플래너 검사</span>
                      <b>2주차</b>
                    </p>
                    <div className="pmb-week">
                      {WEEK.map((d, i) => (
                        <div key={d} className={WEEK_DONE[i] ? "ok" : "miss"}>
                          <span>{d}</span>
                          <i>{WEEK_DONE[i] ? <Check size={13} /> : "△"}</i>
                        </div>
                      ))}
                    </div>
                    <p className="pmb-note-title">멘토 선생님 메모</p>
                    <ul className="pmb-notes">
                      {CHECK_NOTES.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                    <small className="pms-src">예시 화면 · 메모 내용은 예시입니다</small>
                  </div>
                </div>
              </div>

              {/* 시험 */}
              <div className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <Medal size={14} />
                    방학 중 · 시험과 점수 경쟁
                  </span>
                  <h3>공부한 만큼 점수가 나오는지, 시험으로 확인합니다</h3>
                  <p>
                    플랜을 다 지켜도 점수가 그대로면 방향이 틀린 것입니다. 방학 중 사관학교 형식의 시험을 보고, 점수를 반
                    친구들과 비교합니다.
                  </p>
                  <ul>
                    {EXAM_POINTS.map((t) => (
                      <li key={t}>
                        <Check size={15} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Link className="quiet-link" href="/mock">
                    T사관 모의고사 보기 <ArrowUpRight size={17} />
                  </Link>
                </div>
                <div className="pm-feature-visual">
                  <div className="pmb-panel" aria-label="시험 점수 비교 예시">
                    <p className="pmb-panel-top">
                      <span>시험 점수 비교</span>
                      <b>반 평균 대비</b>
                    </p>
                    {SCORES.map((s) => (
                      <div className="pmb-score" key={s.subject}>
                        <span>{s.subject}</span>
                        <div>
                          <div className="pmb-track" aria-hidden="true">
                            <u style={{ width: `${s.mine}%` }} />
                          </div>
                          <div className="pmb-track avg" aria-hidden="true">
                            <u style={{ width: `${s.avg}%` }} />
                          </div>
                        </div>
                        <b className={s.mine >= s.avg ? "up" : "down"}>
                          {s.mine >= s.avg ? "+" : "−"}
                          {Math.abs(s.mine - s.avg)}
                        </b>
                      </div>
                    ))}
                    <p className="pmb-legend">
                      <span>
                        <i /> 내 점수
                      </span>
                      <span>
                        <i className="avg" /> 반 평균
                      </span>
                    </p>
                    <small className="pms-src">예시 화면 · 점수는 예시입니다</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 방학 흐름 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  WINTER FLOW
                </p>
                <h2 className="pm-h2">방학 한 번이 이렇게 지나갑니다</h2>
              </div>
            </div>
            <div className="pm-timeline pmb-flow">
              {FLOW.map((f) => (
                <div className={`pm-tl${f.now ? " now" : ""}`} key={f.title}>
                  <p className="pm-tl-when">{f.when}</p>
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 학교별 반 ===== */}
        <section id="tracks" className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  CLASSES
                </p>
                <h2 className="pm-h2">지원 학교별로 5개 반을 모집합니다</h2>
                <p className="pm-lead">
                  같은 학교를 노리는 학생끼리 한 반이 됩니다. 1차 공부는 같아도 체력·면접·학생부 반영은 학교마다 달라서,
                  생기부 관리와 방학 계획은 학교 기준으로 잡습니다.
                </p>
              </div>
              <Link href="/admission">
                학교별 전형 비교 <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="pmb-tracks">
              {TRACKS.map((t) => (
                <Link className="pmb-track-card" href={`/admission/${t.slug}`} key={t.slug}>
                  <ShieldCheck size={20} />
                  <h3>{t.name}</h3>
                  <p>{t.school} 준비생</p>
                  <strong>
                    전형 안내 보기 <ArrowUpRight size={14} />
                  </strong>
                </Link>
              ))}
            </div>
            <p className="pmb-notice">
              <Info size={15} />
              <span>
                <b>2028학년도 입시는 현행대로 학교별 선발입니다.</b> 국방부가 2026년 11월 18일 발표한 국군사관학교
                체계(1·4학년 통합 교육, 2·3학년 군별 교육)는 2029학년도 신입생부터 적용됩니다. 그래서 이번 사관반도
                육사·해사·공사·국간사 학교별로 운영하고, 경찰대반은 따로 둡니다.
              </span>
            </p>
          </div>
        </section>

        {/* ===== 모집 안내 ===== */}
        <section id="apply" className="pm-section">
          <div className="pm-wrap">
            <div className="pm-mentor">
              <div>
                <p className="eyebrow">
                  <span />
                  겨울방학 사관반 · 모집 안내
                </p>
                <h2>
                  1차 시험 전, 온전히 쓸 수 있는
                  <br />
                  마지막 긴 방학입니다.
                </h2>
                <p>
                  계획을 세워 줄 멘토 선생님과 매일 비교될 친구들이 있는 방학과, 혼자 보내는 방학은 6주 뒤가 다릅니다.
                  지원하려는 학교의 반으로 신청하세요.
                </p>
                {APPLY_HREF ? (
                  <a className="solid-link" href={APPLY_HREF} {...applyProps}>
                    사관반 신청하기 <ArrowRight size={18} />
                  </a>
                ) : (
                  <p className="pmb-apply-note">신청 방법은 곧 이 자리에 안내합니다.</p>
                )}
              </div>
              <ul>
                {SUMMARY.map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <b>{v}</b>
                  </li>
                ))}
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
                <h2 className="pm-h2">사관반 자주 묻는 질문</h2>
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
          <Swords size={30} color="#a56850" style={{ margin: "0 auto 18px" }} />
          <h2>
            계획은 멘토와 세우고,
            <br />
            지키는 건 친구들과 겨루며.
          </h2>
          <p>이번 겨울방학을 사관반에서 보내세요. 방학이 끝날 때 지킨 계획과 시험 점수가 남습니다.</p>
          <div className="pm-actions">
            <a className="solid-link" href={applyHref} {...applyProps}>
              {applyLabel} <ArrowRight size={18} />
            </a>
            <Link className="quiet-link" href="/promo/winter">
              겨울방학 플랜 세우는 방법 <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
