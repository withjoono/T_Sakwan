import Link from "next/link"
import { AlertTriangle, ArrowRight, HelpCircle, Info, Lightbulb } from "lucide-react"
import type { AdmissionCta, DataTable, Faq, KeyFact } from "@/lib/admission/types"
import { SCHOOL_LIST } from "@/lib/admission"

/** ===== /admission 공통 컴포넌트 =====
 *  전부 서버 컴포넌트다. `output: 'export'` 정적 사이트이므로
 *  본문이 빌드 시점 HTML 에 들어가야 JS 를 실행하지 않는 AI 크롤러도 읽는다.
 *  표를 이미지로 만들지 말 것 — 실제 <table> 이어야 인용된다.
 */

export function AdmissionHero({
  badge,
  title,
  lead,
  gradient = "from-slate-800 via-slate-900 to-black",
  updated,
}: {
  badge?: string
  title: string
  lead: string
  gradient?: string
  updated: string
}) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white`}>
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />
      <div className="relative mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-20">
        {badge && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
            {badge}
          </div>
        )}
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">{lead}</p>
        <p className="mt-6 text-xs text-white/70">
          각 학교 2027학년도 모집요강 원문 기준 · 최종 확인 {updated}
        </p>
      </div>
    </section>
  )
}

export function Section({
  id,
  title,
  lead,
  children,
  tone = "default",
}: {
  id?: string
  title: string
  lead?: string
  children: React.ReactNode
  tone?: "default" | "muted"
}) {
  return (
    <section
      id={id}
      className={
        tone === "muted"
          ? "scroll-mt-20 border-t bg-secondary/30 px-6 py-12 sm:px-8 sm:py-16"
          : "scroll-mt-20 border-t px-6 py-12 sm:px-8 sm:py-16"
      }
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
        {lead && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{lead}</p>}
        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </section>
  )
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-foreground">{children}</h3>
}

/** 표 — 모바일에서 가로 스크롤한다. 첫 열은 왼쪽에 고정한다. */
export function Table({ data, dense = false }: { data: DataTable; dense?: boolean }) {
  const pad = dense ? "px-3 py-2" : "px-3 py-2.5"
  return (
    <div className="space-y-2">
      <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-secondary/50">
              {data.head.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`${pad} text-left font-semibold text-foreground whitespace-nowrap`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, r) => (
              <tr key={r} className="border-b border-border/60 align-top">
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`${pad} ${c === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.notes && data.notes.length > 0 && (
        <ul className="space-y-1 text-[13px] leading-relaxed text-muted-foreground">
          {data.notes.map((n, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true">·</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const TONES = {
  warn: {
    wrap: "border-red-300 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100",
    label: "주의",
    Icon: AlertTriangle,
  },
  info: {
    wrap: "border-blue-300 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100",
    label: "참고",
    Icon: Info,
  },
  note: {
    wrap: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100",
    label: "해석",
    Icon: Lightbulb,
  },
} as const

/** 경고/참고/해석 3종. 색만으로 의미를 전달하지 않도록 텍스트 라벨을 함께 찍는다. */
export function AlertBox({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof TONES
  title: string
  children?: React.ReactNode
}) {
  const t = TONES[tone]
  const Icon = t.Icon
  return (
    <div className={`rounded-2xl border p-5 ${t.wrap}`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {t.label}
      </div>
      <p className="mt-2 text-[15px] font-semibold leading-snug">{title}</p>
      {children && <div className="mt-2 space-y-2 text-sm leading-relaxed opacity-90">{children}</div>}
    </div>
  )
}

export function FactGrid({ items }: { items: KeyFact[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <div key={f.label} className="rounded-2xl border bg-card p-4">
          <div className="text-xs font-medium text-muted-foreground">{f.label}</div>
          <div className="mt-1 text-lg font-bold leading-snug text-foreground">{f.value}</div>
          {f.note && <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{f.note}</div>}
        </div>
      ))}
    </div>
  )
}

export function Bullets({ items, marker = "·" }: { items: string[]; marker?: string }) {
  if (items.length === 0) return null
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden="true" className="shrink-0">
            {marker}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="space-y-3">
      {items.map((f) => (
        <details key={f.q} className="group rounded-2xl border bg-card p-5" open>
          <summary className="flex cursor-pointer items-start gap-2 text-[15px] font-semibold text-foreground marker:content-['']">
            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {f.q}
          </summary>
          <p className="mt-3 pl-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </div>
  )
}

/** 5개 기관 전환. 모든 하위 페이지 상단·하단에 둔다. */
export function SchoolSwitcher({ current }: { current?: string }) {
  return (
    <nav aria-label="대학별 전형 안내" className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-6 py-3 sm:px-8">
        <Link
          href="/admission"
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            current ? "text-muted-foreground hover:bg-secondary" : "border-primary bg-primary text-primary-foreground"
          }`}
        >
          전체 비교
        </Link>
        {SCHOOL_LIST.map((s) => (
          <Link
            key={s.slug}
            href={`/admission/${s.slug}`}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              current === s.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {s.icon} {s.short}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="이 페이지 목차" className="rounded-2xl border bg-card p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">이 페이지에서 확인할 수 있는 것</div>
      <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className="text-sm text-foreground underline-offset-4 hover:underline">
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** 페이지당 하나만. 정보를 다 준 뒤에 배치한다. */
export function AdmissionCTA({ cta }: { cta: AdmissionCta }) {
  return (
    <section className="border-t px-6 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-card p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{cta.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cta.body}</p>
        <Link
          href={cta.href}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          {cta.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export function SourceNote({
  sourceDoc,
  updated,
  disclaimer,
  extra,
  homepage,
  contact,
}: {
  sourceDoc: string
  updated: string
  disclaimer: string
  extra?: string
  homepage?: { label: string; url: string }
  contact?: string
}) {
  return (
    <section className="border-t bg-secondary/40 px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-2 text-[13px] leading-relaxed text-muted-foreground">
        <p>{disclaimer}</p>
        {extra && <p>{extra}</p>}
        <p>
          <span className="font-medium text-foreground">출처</span> {sourceDoc} ·{" "}
          <span className="font-medium text-foreground">최종 확인</span> {updated}
        </p>
        {homepage && (
          <p>
            <span className="font-medium text-foreground">공식 홈페이지</span>{" "}
            <a
              href={homepage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              {homepage.label}
            </a>
            {contact && <span> · {contact}</span>}
          </p>
        )}
      </div>
    </section>
  )
}
