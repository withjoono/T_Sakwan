import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarX2,
  Check,
  Flag,
  Hourglass,
  LayoutGrid,
  Layers,
  RefreshCw,
  Snowflake,
  Sparkles,
  Swords,
  TrendingDown,
} from "lucide-react"
import JsonLd from "@/components/json-ld"
import { abs, breadcrumb, faqPage, graph } from "@/lib/seo"
import "./winter.css"

/*
 * /promo/winter — 「겨울방학 플랜 세우기」 + 사관반 모집 캠페인 (2026-11)
 * 근거: 겨울방학 플래너 기획서(2026-11-13 초안). 플래너 쪽에서 구현 중인 기능의 사전 안내 페이지다.
 *
 * 문구 원칙 (claude/sakwan-service-inventory.md)
 * - 방학 플랜은 아직 열리지 않았다. PLANNER_OPEN 이 false 인 동안 "쓸 수 있다"가 아니라 "엽니다/준비 중"으로 쓴다.
 * - 본문 3개 블록은 기획서 1차 범위(방학 설정·목표·칸 배분·주 패턴·오늘 제안)만 다룬다.
 *   2차 범위(주차별 목표·주간 점검·평소 속도 대비 경고)는 NEXT 에 "이어서 추가"로만 적는다.
 * - 화면 그림은 전부 기획서의 예시 숫자다. "예시 화면"이라고 캡션에 밝힌다.
 * - 사관반은 사용자가 확인해 준 사실(별도 모집 중, 전교권 학생끼리 매일 학습량 등으로 경쟁)만 쓴다.
 *   정원·선발 기준·비용·랭킹 수치·후기는 쓰지 않는다.
 */

/** 방학 플랜이 실제로 열리면 true 로 바꾸고 PLANNER_HREF 를 실제 진입 경로로 맞춘다. */
const PLANNER_OPEN = false
const PLANNER_HREF = "/planner"
/** 사관반 신청 링크(폼·카톡 채널 등). 비어 있으면 신청 버튼 대신 모집 안내 섹션으로 보낸다. */
const BAN_APPLY_HREF = ""

const TITLE = "겨울방학 플랜 세우기 — 사관학교·경찰대 준비생 방학 계획 | T사관 사관반 모집"
const DESCRIPTION =
  "방학 전체에 쓸 수 있는 칸을 먼저 세고, 그 안에 목표를 담는 겨울방학 플래너입니다. 한 칸 분량을 시작 전에 확인하고, 주 패턴 하나를 반복하며, 밀린 분량은 매일 다시 계산합니다. 전교권 학생끼리 매일 학습량으로 겨루는 사관반도 모집 중입니다."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: abs("/promo/winter") },
  openGraph: { url: abs("/promo/winter"), title: TITLE, description: DESCRIPTION },
}

const PROBLEMS = [
  {
    icon: TrendingDown,
    problem: "욕심껏 넣고 2주 차에 무너진다",
    title: "시작 전에 칸부터 셉니다",
    body: "방학 전체에 공부할 수 있는 칸이 몇 개인지 먼저 세고, 목표마다 한 칸에 몇 쪽·몇 문제인지 보여 줍니다. 무리한 계획은 첫날이 아니라 세우는 날 드러납니다.",
  },
  {
    icon: CalendarX2,
    problem: "여행·설 연휴·특강으로 계획이 어긋난다",
    title: "빠지는 날은 0칸으로",
    body: "계획이 날짜에 묶여 있지 않습니다. 빠지는 날은 0칸, 학원 가는 날은 칸을 줄여 등록하면 남은 분량이 남은 칸에 다시 나뉩니다.",
  },
  {
    icon: RefreshCw,
    problem: "밀린 분량을 방치하다 포기한다",
    title: "매일 다시 계산합니다",
    body: "오늘 분량은 남은 분량을 남은 칸으로 나눠 정합니다. 어제 못 한 만큼이 조용히 뒤로 나뉘고, 주 1회 예비일에 따라잡을 수 있습니다.",
  },
  {
    icon: Flag,
    problem: "시험이 없어 끝이 흐지부지된다",
    title: "끝을 미리 비워 둡니다",
    body: "마지막 며칠은 새 진도 없이 마무리 기간으로 둡니다. 못 끝낸 분량을 정리하고 개학을 준비하는 시간입니다.",
  },
]

const SETUP_STEPS = [
  { title: "방학 기간과 하루 칸 수", body: "하루를 오전·오후·저녁 3칸으로 봅니다. 2칸·4칸으로 바꿀 수 있습니다." },
  { title: "빠지는 날 · 칸이 적은 요일", body: "여행과 설 연휴는 0칸, 특강 가는 요일은 2칸처럼 줄여 둡니다." },
  { title: "목표(교재)와 비중", body: "교재·범위·비중(상·중·하)을 넣습니다. 복습·선행·약점 보완을 따로 등록합니다." },
  { title: "칸 자동 배분 확인", body: "비중에 따라 칸을 나눠 제안합니다. 한 칸 분량을 보고 그대로 가거나 고칩니다." },
]

/** 기획서 화면 C 예시 — 총 89칸, 가중치 상3·중2·하1 */
const ALLOC = [
  { key: "ma", goal: "수학 선행 · 개념서", weight: "상", units: 22, per: "약 15쪽" },
  { key: "en", goal: "영어 · 구문", weight: "상", units: 22, per: "약 3강" },
  { key: "mb", goal: "수학 복습 · 문제집", weight: "중", units: 15, per: "30문제", warn: true },
  { key: "ko", goal: "국어 · 문학 개념", weight: "중", units: 15, per: "16쪽" },
  { key: "sc", goal: "과학 선행", weight: "하", units: 8, per: "15쪽" },
  { key: "rd", goal: "독서", weight: "하", units: 7, per: "칸만 배정" },
]

const LABEL: Record<string, string> = { ma: "수선", en: "영어", mb: "수복", ko: "국어", sc: "과학", rd: "독서" }

/** 기획서 화면 D 예시 — 월~토 × 오전·오후·저녁, 일요일은 예비일 */
const PATTERN: [string, (string | null)[]][] = [
  ["오전", ["ma", "ma", "ma", "en", "ma", "mb"]],
  ["오후", ["en", "ko", "en", "ko", "en", "ko"]],
  ["저녁", ["mb", null, "mb", null, "sc", "rd"]],
]
const DAYS = ["월", "화", "수", "목", "금", "토", "일"]

const PATTERN_POINTS = [
  "비중이 높은 목표를 오전 칸에 먼저 놓습니다.",
  "같은 목표는 하루 한 칸, 요일에 고르게 퍼지도록 놓습니다.",
  "빠지는 날이 있는 주는 그 날짜만 건너뜁니다. 주마다 다시 짜지 않습니다.",
  "자동 배치가 마음에 안 들면 칸을 눌러 바꿉니다.",
]

const DAILY_POINTS = [
  "오늘 분량 = 남은 분량 × (오늘 그 목표 칸 ÷ 남은 그 목표 칸)",
  "확정하면 오늘의 미션으로 들어가고, 결과를 입력하면 진도가 갱신됩니다.",
  "주 1회 예비일에는 새 계획을 넣지 않습니다. 밀린 분량을 따라잡거나 쉬는 날입니다.",
  "방학 홈에서 몇 주 차인지, 목표별로 얼마나 왔는지 한눈에 봅니다.",
]

const NEXT = ["주차별 목표(중간 마감)", "주 1회 주간 점검", "평소 속도보다 많으면 경고"]

const BAN_ROWS = [
  ["구성", "사관학교·경찰대를 준비하는 전교권 학생"],
  ["방식", "매일 학습량 등을 반 안에서 비교"],
  ["플랜", "겨울방학 플랜으로 방학 전체 계획"],
  ["모집", "플래너와 별도 · 현재 모집 중"],
]

const FAQ = [
  {
    q: "겨울방학 플랜은 언제부터 쓸 수 있나요?",
    a: "지금 만들고 있습니다. 겨울방학이 시작되기 전에 여는 것을 목표로 하고, 열리면 이 페이지와 플래너에서 바로 안내합니다.",
  },
  {
    q: "시간표처럼 몇 시부터 몇 시까지 정하지 않나요?",
    a: "정하지 않습니다. 하루를 오전·오후·저녁 같은 칸으로만 나누고, 칸마다 목표 하나를 놓습니다. 시각을 정해 두면 한 번 늦었을 때 하루 계획이 통째로 어긋나기 때문입니다.",
  },
  {
    q: "여행이나 설 연휴, 학원 특강이 있으면 어떻게 하나요?",
    a: "빠지는 날은 0칸으로, 특강처럼 매주 반복되는 날은 칸 수를 줄여 등록합니다. 분량은 남은 칸 기준으로 매일 다시 계산되므로 계획을 새로 짤 필요가 없습니다. 방학 중간에 갑자기 생긴 일정도 같은 방식으로 넣습니다.",
  },
  {
    q: "계획이 밀리면 어떻게 되나요?",
    a: "따로 처리하지 않아도 남은 분량이 남은 칸에 나뉘어 다음 날 제안에 반영됩니다. 주 1회 예비일은 새 계획을 넣지 않는 날이라 따라잡는 데 쓸 수 있습니다. 밀린 분량을 어떻게 처리할지 고르는 주간 점검은 방학 중 이어서 추가합니다.",
  },
  {
    q: "방학이 이미 시작된 뒤에 세워도 되나요?",
    a: "됩니다. 시작일을 오늘로 두면 남은 기간만으로 칸을 세고 분량을 나눕니다.",
  },
  {
    q: "사관반은 어떻게 들어가나요?",
    a: "사관반은 플래너와 별도로 모집하는 반으로, 전교권 학생들이 매일 학습량 등으로 서로 경쟁하는 구조입니다. 현재 모집 중이며, 신청 방법은 이 페이지의 사관반 안내에서 확인할 수 있습니다.",
  },
]

function Cell({ k }: { k: string | null }) {
  if (!k) return <i className="pmw-cell empty">–</i>
  return <i className={`pmw-cell g-${k}`}>{LABEL[k]}</i>
}

export default function PromoWinterPage() {
  const banHref = BAN_APPLY_HREF || "#ban"
  const banLabel = BAN_APPLY_HREF ? "사관반 신청하기" : "사관반 모집 안내"
  const banExternal = /^https?:/.test(BAN_APPLY_HREF)
  const banProps = banExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumb([
            ["홈", "/"],
            ["T사관 서비스 소개", "/promo"],
            ["겨울방학 플랜 세우기", "/promo/winter"],
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
              2026 겨울방학 · 사관학교 · 경찰대 준비생
            </p>
            <h1>
              겨울방학 계획,
              <br />
              <em>2주 차에 무너지지 않게.</em>
            </h1>
            <p className="pm-hero-lead">
              방학 전체에 쓸 수 있는 칸을 먼저 세고, 그 안에 목표를 담습니다. 넘치면 시작 전에 보입니다. 사관반에서는 그렇게
              세운 계획을 전교권 친구들과 매일 학습량으로 겨루며 지킵니다.
            </p>
            <div className="pm-actions">
              <a className="solid-link" href={banHref} {...banProps}>
                {banLabel} <ArrowRight size={18} />
              </a>
              {PLANNER_OPEN ? (
                <Link className="quiet-link" href={PLANNER_HREF}>
                  방학 플랜 세우기 <ArrowUpRight size={17} />
                </Link>
              ) : (
                <a className="quiet-link" href="#plan">
                  플랜 세우는 방법 <ArrowUpRight size={17} />
                </a>
              )}
            </div>
            <div className="pm-proof">
              <div>
                <b>3칸</b>
                <span>하루를 오전·오후·저녁으로</span>
              </div>
              <div>
                <b>주 패턴 1개</b>
                <span>방학 내내 반복</span>
              </div>
              <div>
                <b>매일</b>
                <span>남은 분량 ÷ 남은 칸</span>
              </div>
            </div>
          </div>

          <div className="pms-ticket" aria-label="사관반 모집 요약">
            <div className="pms-ticket-top">
              <span>사관반 · 모집 중</span>
              <Swords size={18} />
            </div>
            <h2>전교권끼리, 매일 학습량으로</h2>
            <p className="pms-ticket-sub">겨울방학 플랜과 함께 시작하는 반</p>
            <dl>
              {BAN_ROWS.map(([dt, dd]) => (
                <div key={dt}>
                  <dt>{dt}</dt>
                  <dd>{dd}</dd>
                </div>
              ))}
            </dl>
            <a className="pms-ticket-cta" href={banHref} {...banProps}>
              {banLabel} <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* ===== 방학 계획이 무너지는 이유 ===== */}
        <section className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  WHY IT BREAKS
                </p>
                <h2 className="pm-h2">방학 계획은 왜 매번 무너질까요</h2>
                <p className="pm-lead">
                  방학은 시작일과 끝나는 날이 정해진 통입니다. 학기 중과 같은 방식으로 짜면 같은 자리에서 어긋납니다.
                </p>
              </div>
            </div>
            <div className="pms-why">
              {PROBLEMS.map(({ icon: Icon, problem, title, body }) => (
                <article key={title}>
                  <span className="pms-icon">
                    <Icon size={20} />
                  </span>
                  <p className="pmw-problem">{problem}</p>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 플랜 세우기 ===== */}
        <section id="plan" className="pm-section">
          <div className="pm-wrap">
            <div className="pm-head-row">
              <div>
                <p className="eyebrow">
                  <span />
                  HOW IT WORKS
                </p>
                <h2 className="pm-h2">방학 시작 전 한 번, 그다음은 매일 확인만</h2>
                <p className="pm-lead">
                  앱이 먼저 채워서 보여 주고, 학생은 승인하거나 고칩니다. 시각은 정하지 않고 칸으로만 나눕니다.
                </p>
              </div>
              <span className="pmw-status">
                <Hourglass size={13} />
                {PLANNER_OPEN ? "지금 사용 가능" : "겨울방학 전 오픈 준비 중"}
              </span>
            </div>

            <div className="pm-features">
              {/* 1. 칸 세기 + 배분 */}
              <div className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <Layers size={14} />
                    STEP 1 · 칸 세기와 배분
                  </span>
                  <h3>학생은 칸 수가 아니라 「한 칸에 얼마」를 보고 판단합니다</h3>
                  <p>
                    6주 방학에서 일요일과 여행 3일을 빼고, 특강 가는 날을 2칸으로 줄이면 89칸이 남습니다. 이 칸을 목표의 비중대로
                    나누면 목표마다 한 칸 분량이 나옵니다.
                  </p>
                  <ul className="pms-steps">
                    {SETUP_STEPS.map((s, i) => (
                      <li key={s.title}>
                        <b>{i + 1}</b>
                        <div>
                          <strong>{s.title}</strong>
                          <span>{s.body}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pm-feature-visual">
                  <div className="pmw-panel" aria-label="칸 배분 예시">
                    <p className="pmw-panel-top">
                      <span>칸 자동 배분</span>
                      <b>총 89칸</b>
                    </p>
                    {ALLOC.map((a) => (
                      <div className="pmw-alloc" key={a.key}>
                        <i className={`pmw-dot g-${a.key}`} />
                        <span>
                          {a.goal}
                          <small>비중 {a.weight}</small>
                        </span>
                        <b>{a.units}칸</b>
                        <em className={a.warn ? "warn" : undefined}>{a.per}</em>
                      </div>
                    ))}
                    <small className="pms-src">예시 화면 · 개발 중이라 실제 화면과 다를 수 있습니다</small>
                  </div>
                </div>
              </div>

              {/* 2. 주 패턴 */}
              <div className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <LayoutGrid size={14} />
                    STEP 2 · 기본 주 패턴
                  </span>
                  <h3>6주 치 달력 대신, 한 주 패턴 하나</h3>
                  <p>
                    날짜마다 일일이 배치하지 않습니다. 요일 × 칸 그리드 하나를 자동으로 채워 보여 주고, 이 패턴이 방학 내내
                    반복됩니다.
                  </p>
                  <ul>
                    {PATTERN_POINTS.map((t) => (
                      <li key={t}>
                        <Check size={15} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pm-feature-visual">
                  <div className="pmw-panel" aria-label="기본 주 패턴 예시">
                    <p className="pmw-panel-top">
                      <span>기본 주 패턴</span>
                      <b>주 16칸</b>
                    </p>
                    <div className="pmw-grid">
                      <span />
                      {DAYS.map((d) => (
                        <span key={d} className="pmw-day">
                          {d}
                        </span>
                      ))}
                      {PATTERN.map(([slot, cells], r) => (
                        <div key={slot} style={{ display: "contents" }}>
                          <span className="pmw-slot">{slot}</span>
                          {cells.map((k, i) => (
                            <Cell key={i} k={k} />
                          ))}
                          {r === 0 && <i className="pmw-cell buffer">예비</i>}
                        </div>
                      ))}
                    </div>
                    <div className="pmw-legend">
                      {ALLOC.map((a) => (
                        <span key={a.key}>
                          <i className={`pmw-dot g-${a.key}`} />
                          {LABEL[a.key]} = {a.goal.split(" · ")[0]}
                        </span>
                      ))}
                    </div>
                    <small className="pms-src">예시 화면 · 일요일은 계획을 넣지 않는 예비일</small>
                  </div>
                </div>
              </div>

              {/* 3. 매일 */}
              <div className="pm-feature">
                <div className="pm-feature-copy">
                  <span className="pm-feature-label">
                    <CalendarCheck size={14} />
                    STEP 3 · 오늘 제안
                  </span>
                  <h3>매일 아침, 오늘 분량이 다시 계산돼 있습니다</h3>
                  <p>
                    어제 덜 했으면 오늘부터 조금씩 늘고, 더 했으면 줄어듭니다. 학생이 할 일은 제안을 확인하고 「이대로 확정」을
                    누르는 것입니다.
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
                  <div className="pmw-panel" aria-label="오늘 제안 예시">
                    <p className="pmw-panel-top">
                      <span>오늘의 방학 계획</span>
                      <b>2주차 화요일</b>
                    </p>
                    <div className="pmw-progress" aria-hidden="true">
                      <i style={{ width: "24%" }} />
                    </div>
                    <div className="pmw-today">
                      <span>오전</span>
                      <div>
                        <b>수학 선행</b>
                        <small>개념서 p.74 ~ 88</small>
                      </div>
                      <em>수정</em>
                    </div>
                    <div className="pmw-today">
                      <span>오후</span>
                      <div>
                        <b>국어</b>
                        <small>문학 개념 p.49 ~ 64</small>
                      </div>
                      <em>수정</em>
                    </div>
                    <div className="pmw-confirm">이대로 확정</div>
                    <small className="pms-src">예시 화면 · 화요일은 특강으로 2칸인 날</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="pms-soon">
              <span>이어서 추가</span>
              {NEXT.map((t) => (
                <p key={t}>
                  <Sparkles size={15} /> {t}
                </p>
              ))}
              <small>방학 중 순서대로 엽니다.</small>
            </div>
          </div>
        </section>

        {/* ===== 사관반 ===== */}
        <section id="ban" className="pm-section">
          <div className="pm-wrap">
            <div className="pm-mentor">
              <div>
                <p className="eyebrow">
                  <span />
                  사관반 · 별도 모집 중
                </p>
                <h2>
                  계획은 혼자 세우고,
                  <br />
                  지키는 건 같이 합니다.
                </h2>
                <p>
                  사관반은 사관학교·경찰대를 준비하는 전교권 학생들이 모여 매일 학습량 등으로 서로 경쟁하는 반입니다. 방학은
                  학교도 시험도 없어 긴장이 풀리기 쉬운 기간입니다. 잘 세운 계획 위에, 매일 비교되는 상대가 있어야 6주가
                  유지됩니다.
                </p>
                {BAN_APPLY_HREF ? (
                  <a className="solid-link" href={BAN_APPLY_HREF} {...banProps}>
                    사관반 신청하기 <ArrowRight size={18} />
                  </a>
                ) : (
                  <p className="pmw-ban-note">신청 방법은 곧 이 자리에 안내합니다.</p>
                )}
              </div>
              <ul>
                {BAN_ROWS.map(([k, v]) => (
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
                <h2 className="pm-h2">겨울방학 플랜 자주 묻는 질문</h2>
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
          <Snowflake size={30} color="#a56850" style={{ margin: "0 auto 18px" }} />
          <h2>
            방학 첫날 할 일은 공부가 아니라
            <br />
            칸을 세는 일입니다.
          </h2>
          <p>
            1차 시험 전에 오는 긴 방학은 많지 않습니다. 이번 겨울은 넘치지 않게 세우고, 사관반에서 끝까지 지켜 보세요.
          </p>
          <div className="pm-actions">
            <a className="solid-link" href={banHref} {...banProps}>
              {banLabel} <ArrowRight size={18} />
            </a>
            <Link className="quiet-link" href="/promo/start">
              모의 1회로 출발점부터 확인 <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
