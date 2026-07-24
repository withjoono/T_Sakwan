"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/use-auth"
import { PLANS, KRW } from "@/lib/sakwan/mock-products"
import { ArrowLeft, CheckCircle2, Check, Copy, CreditCard, Loader2, Lock, MessageSquare, ShieldCheck } from "lucide-react"

// 허브(tskool.kr) — 카드 결제는 허브 주문 페이지의 검증된 Iamport 플로우로 진행.
const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "https://tskool.kr"
// 사관 "7월 5회 패키지"에 해당하는 허브 상품 id. 미설정 시 이용권 목록(/products)으로 이동.
const HUB_PRODUCT_ID = process.env.NEXT_PUBLIC_SAKWAN_MOCK_PRODUCT_ID

// 수동 결제(계좌이체 · 카톡송금) 안내 정보
const BANK = { name: "하나은행", account: "208-91000-2233-08", holder: "강준호" }
const CONTACT_PHONE = "010-2518-7139"
const KATALK_ID = "withjuno"

const PAY_METHODS = [
  { id: "card", label: "신용/체크카드", icon: "💳" },
  { id: "trans", label: "계좌이체", icon: "🏦" },
  { id: "katalk", label: "카카오페이 송금", icon: "💬" },
] as const

function CheckoutInner() {
  const { isAuthenticated } = useAuth()

  const plan = PLANS.package
  const rounds = useMemo(() => [1, 2, 3, 4, 5], [])

  const [method, setMethod] = useState<(typeof PAY_METHODS)[number]["id"]>("card")
  const [agree, setAgree] = useState(false)
  const [paying, setPaying] = useState(false)
  const [copied, setCopied] = useState(false)

  const isManual = method === "trans" || method === "katalk"
  // 입금 확인 메시지 — 학교·학생명·현금영수증 번호만 채워 보내면 됩니다.
  const depositMsg = `○○고등학교 ○○○(학생명) ${plan.name} 이용권 ${KRW(plan.price)} 입금했습니다. 현금영수증은 ○○○-○○○○-○○○○ 번호로 발행해주세요.`
  const smsHref = `sms:${CONTACT_PHONE}?body=${encodeURIComponent(depositMsg)}`

  const copyMsg = async () => {
    try {
      await navigator.clipboard.writeText(depositMsg)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard 불가 시 무시 */
    }
  }

  const handlePay = () => {
    if (!agree || paying) return
    setPaying(true)
    // 실제 결제는 허브 주문 페이지(Iamport 결제창)에서 진행.
    // 결제 완료 시 허브가 앱 라이선스(hub_app_subscriptions: mock.all)를 부여하고,
    // 다운로드 페이지가 허브 라이선스를 조회해 회차 잠금을 해제한다.
    const target = HUB_PRODUCT_ID
      ? `${HUB_URL}/order/${HUB_PRODUCT_ID}`
      : `${HUB_URL}/products`
    window.location.href = target
  }

  const displayName = plan.name

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-orange-900 py-10">
        <div className="container mx-auto max-w-3xl px-6">
          <Link href="/mock/tsagwan" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-orange-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> T사관 모의고사
          </Link>
          <h1 className="text-2xl font-bold text-white md:text-3xl">신청 · 결제</h1>
          <p className="mt-1 text-sm text-orange-100">결제 완료 후 회차별 문제지를 바로 다운로드할 수 있어요.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto grid max-w-3xl gap-6 px-6">
          {/* 주문 요약 */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="mb-4 text-xs font-bold text-amber-700">주문 상품</div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-gray-900">{displayName}</div>
                  <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {rounds.map((r) => (
                      <span key={r} className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        {r}회 문제지 포함
                      </span>
                    ))}
                  </div>
                </div>
                <div className="whitespace-nowrap text-xl font-black text-gray-900">{KRW(plan.price)}</div>
              </div>

              <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                {plan.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 결제 수단 */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="mb-4 text-xs font-bold text-amber-700">결제 수단</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PAY_METHODS.map((m) => {
                  const on = method === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`rounded-xl border-2 p-3 text-center text-sm font-bold transition-all ${
                        on ? "border-amber-400 bg-amber-50 text-amber-800" : "border-gray-200 bg-white text-gray-600 hover:border-amber-200"
                      }`}
                    >
                      <div className="text-xl">{m.icon}</div>
                      <div className="mt-1">{m.label}</div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 결제 금액 + 동의 + 버튼 */}
          <Card className="border-2 border-amber-200 bg-amber-50/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between border-b border-amber-200 pb-4">
                <span className="text-sm font-bold text-gray-700">총 결제 금액</span>
                <span className="text-2xl font-black text-amber-700">{KRW(plan.price)}</span>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-amber-500"
                />
                <span>주문 내용을 확인했으며, 결제 및 환불 규정에 동의합니다. (디지털 콘텐츠 특성상 다운로드 후 환불 제한)</span>
              </label>

              {!isAuthenticated && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <Lock className="h-3.5 w-3.5" /> 로그인하면 결제·다운로드 내역이 계정에 저장됩니다.
                </p>
              )}

              {!isManual ? (
                <>
                  <Button
                    onClick={handlePay}
                    disabled={!agree || paying}
                    size="lg"
                    className="mt-4 w-full bg-amber-500 py-6 text-lg font-bold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 결제 진행 중…
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" /> {KRW(plan.price)} 결제하기
                      </>
                    )}
                  </Button>
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> 안전한 결제 · 결제 완료 시 문제지 다운로드 페이지로 이동합니다
                  </div>
                </>
              ) : (
                <div className="mt-4 space-y-3">
                  {/* 입금 대상 (계좌 / 카카오페이) */}
                  {method === "trans" ? (
                    <div className="rounded-xl border-2 border-amber-200 bg-white p-4">
                      <div className="mb-1 text-xs font-bold text-amber-700">입금 계좌</div>
                      <div className="text-lg font-bold text-gray-900">
                        {BANK.name} {BANK.account}
                      </div>
                      <div className="text-sm text-gray-500">
                        예금주 {BANK.holder} · 입금액 {KRW(plan.price)}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-amber-200 bg-white p-4">
                      <div className="mb-1 text-xs font-bold text-amber-700">카카오페이 송금</div>
                      <div className="text-lg font-bold text-gray-900">{CONTACT_PHONE}</div>
                      <div className="text-sm text-gray-500">
                        카카오톡 검색: {KATALK_ID} · 송금액 {KRW(plan.price)}
                      </div>
                    </div>
                  )}

                  {/* 입금 후 안내 메시지 */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-700">
                      {method === "trans" ? (
                        <>
                          입금 후 <b className="text-gray-900">{CONTACT_PHONE}</b> 로 아래 내용을 <b>문자</b>로 보내주세요.
                        </>
                      ) : (
                        <>
                          송금 후 <b className="text-gray-900">카카오톡</b>으로 아래 내용을 보내주세요.
                        </>
                      )}{" "}
                      확인 후 이용권을 활성화해 드립니다.
                    </p>
                    <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-900">
                      {depositMsg}
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      {method === "trans" && (
                        <a
                          href={smsHref}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-600"
                        >
                          <MessageSquare className="h-4 w-4" /> 입금 확인 문자 보내기
                        </a>
                      )}
                      <button
                        onClick={copyMsg}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-amber-300 bg-white px-4 py-3 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-50"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" /> 복사됨
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" /> 메시지 복사
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-center text-[11px] text-gray-400">
                    * 메시지의 학교·학생명·현금영수증 번호를 채워 보내주세요.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> 결제 후 언제든 다운로드 페이지에서 문제지를 다시 받을 수 있어요.
          </p>
        </div>
      </section>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">로딩 중...</div>}>
      <CheckoutInner />
    </Suspense>
  )
}
