import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Phone, Mail, ArrowRight, CheckCircle, Calendar, Clock, Sparkles, Target, Shield, Swords, Heart, Dumbbell } from "lucide-react"
import Navigation from "@/components/navigation"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-red-800/10 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-6 text-center max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-red-300" />
              <span className="text-sm font-semibold text-red-200">국가를 이끌 리더를 양성합니다</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              사관학교 합격을 위한
              <br />
              <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">전문 입시 컨설팅</span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100/80 mb-10 leading-relaxed">
              육사 · 해사 · 공사 · 국간사 전문가와 함께하는
              <br />
              1차 필기, 체력검정, 면접까지 체계적 합격 전략
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg shadow-red-500/25"
              >
                무료 상담 시작하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold border-2 border-white/20 text-white hover:bg-white/10 rounded-lg bg-transparent"
              >
                서비스 둘러보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 🆕 AI 플랫폼 기능 소개 섹션 */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-50 rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-700">T Skool AI 플랫폼</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              컨설팅을 넘어,<br />
              <span className="text-red-700">AI 플랫폼</span>으로 관리합니다
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              사관학교만의 특수한 평가 기준(리더십, 국가관, 체력)에 맞춰
              AI가 생기부를 정밀 분석하고, 학습부터 체력 훈련까지 체계적으로 관리합니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* 생기북 사관 AI 진단 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-red-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">🎖️ 사관학교 전용 생기북 AI 진단</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                일반 대학과는 완전히 다른 사관학교 면접관의 시각으로 AI가 내 생기부를 분석합니다.
                리더십, 국가관, 희생정신, 체육 활동을 최우선으로 발췌하여 평가합니다.
              </p>
              <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-6">
                {[
                  { label: "리더십 · 통솔력", score: 92, color: "bg-red-500" },
                  { label: "국가관 · 안보의식", score: 88, color: "bg-amber-500" },
                  { label: "체육 활동 · 체력", score: 95, color: "bg-emerald-500" },
                  { label: "학업 역량 (국영수)", score: 85, color: "bg-blue-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-xs font-semibold text-gray-700">
                      <span>{item.label}</span>
                      <span className="text-gray-900">{item.score}점</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">육사·해사·공사·국간사 맞춤 진단</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <CheckCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">리더십·봉사·체육 키워드 자동 추출</span>
              </div>
            </div>

            {/* 사관학교 맞춤 플래너 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="h-7 w-7 text-amber-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">📅 사관학교 맞춤 Study Planner</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                1차 필기(국영수 + 공간능력 + 국사) 학습 관리뿐 아니라,
                체력검정 훈련 일정과 면접 준비까지 한 곳에서 체계적으로 관리합니다.
              </p>
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <div className="relative ml-3 border-l-2 border-gray-200 pl-4">
                  {[
                    { time: "06:00", subj: "체력", title: "달리기 1.5km + 윗몸일으키기 3세트", color: "#dc2626", done: true },
                    { time: "09:00", subj: "국영수", title: "사관학교 기출 수학 문제풀이", color: "#2563eb", done: false },
                    { time: "14:00", subj: "국사", title: "한국사 근현대사 핵심 정리", color: "#7c3aed", done: false },
                    { time: "19:00", subj: "면접", title: "국가안보 시사 이슈 브리핑 연습", color: "#b45309", done: false },
                  ].map((item) => (
                    <div key={item.title} className="relative mb-4 last:mb-0">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: item.color }} />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{item.time}</span>
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: item.color }}>{item.subj}</span>
                      </div>
                      <p className={`mt-0.5 text-sm font-medium ${item.done ? "text-gray-400 line-through" : "text-gray-800"}`}>{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">체력검정 훈련 기록 & 추이 관리</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <CheckCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">면접·국사·공간능력 맞춤 루틴</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 전형별 서비스 */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">전형별 전문 대비</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">사관학교 입시의 모든 단계를 체계적으로 지원합니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 1차 필기시험 */}
            <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300 rounded-xl">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">1차 필기시험 대비</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  국영수 + 공간능력 + 국사 완벽 대비
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">사관학교 전용 기출 분석</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">공간능력 특화 훈련 프로그램</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">한국사 근현대사 집중 코스</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-2">
                  자세히 보기 <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* 체력검정 */}
            <Card className="bg-white border-red-200 hover:shadow-xl transition-all duration-300 rounded-xl border-2">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  체력검정 대비
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-semibold">핵심</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  합격 커트라인을 넘는 맞춤 체력 훈련
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">1.5km 달리기 기록 단축 프로그램</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">윗몸일으키기 · 팔굽혀펴기 훈련</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">주차별 체력 측정 & 기록 관리</span>
                  </div>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg mt-2">
                  체력 훈련 보기 <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* 면접 대비 */}
            <Card className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300 rounded-xl">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">면접 대비</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  사관학교 면접관 출신 멘토의 실전 대비
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">국가관 · 안보의식 답변 설계</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">리더십 사례 구조화 훈련</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">모의 면접 실전 연습 (영상 피드백)</span>
                  </div>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg mt-2">
                  면접 대비 보기 <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 사관학교별 전형 일정 */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">사관학교별 전형 일정</h2>
            <p className="text-xl text-gray-600">각 사관학교의 주요 전형 일정을 한눈에 확인하세요</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { name: "육군사관학교", short: "육사", color: "green", icon: "🟢", dates: { apply: "6~7월", written: "7월", fitness: "8월", interview: "9~10월", final: "11월" } },
              { name: "해군사관학교", short: "해사", color: "blue", icon: "🔵", dates: { apply: "6~7월", written: "7월", fitness: "8월", interview: "10월", final: "11월" } },
              { name: "공군사관학교", short: "공사", color: "sky", icon: "🔷", dates: { apply: "6~7월", written: "7월", fitness: "8월", interview: "10월", final: "11월" } },
              { name: "국군간호사관학교", short: "국간사", color: "pink", icon: "🏥", dates: { apply: "6~7월", written: "7월", fitness: "8월", interview: "10월", final: "11월" } },
            ].map((school) => (
              <Card key={school.short} className="bg-white border-gray-200 hover:shadow-lg transition-all rounded-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{school.icon}</span>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">{school.name}</CardTitle>
                      <CardDescription className="text-gray-500">2026학년도 전형 일정</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { label: "원서 접수", value: school.dates.apply, icon: <Calendar className="h-4 w-4" /> },
                      { label: "1차 필기시험", value: school.dates.written, icon: <BookOpen className="h-4 w-4" /> },
                      { label: "체력검정", value: school.dates.fitness, icon: <Dumbbell className="h-4 w-4" /> },
                      { label: "면접", value: school.dates.interview, icon: <Users className="h-4 w-4" /> },
                      { label: "최종 발표", value: school.dates.final, icon: <Award className="h-4 w-4" /> },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-gray-400">{step.icon}</span>
                          {step.label}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{step.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">무료 상담 신청</h2>
            <p className="text-xl text-gray-600 mb-12">사관학교 합격을 위한 맞춤형 전략을 상담받아보세요</p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <Card className="bg-white border-gray-200 rounded-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-7 w-7 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">전화 상담</h3>
                  <p className="text-2xl font-bold text-red-600 mb-2">010-2518-7139</p>
                  <p className="text-sm text-gray-600">06:00~22:00</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 rounded-xl">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-7 w-7 text-red-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">이메일 상담</h3>
                  <p className="text-lg font-semibold text-red-600 mb-2">withjuno@naver.com</p>
                  <p className="text-sm text-gray-600">24시간 접수</p>
                </CardContent>
              </Card>
            </div>

            <Button
              size="lg"
              className="bg-red-700 hover:bg-red-800 text-white px-12 py-6 text-lg font-semibold rounded-lg shadow-sm"
            >
              지금 무료 상담 신청하기
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">사관</span>
                </div>
                <span className="text-2xl font-bold">TS 사관</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                육군사관학교, 해군사관학교, 공군사관학교, 국군간호사관학교
                <br />
                합격을 위한 전문 입시 컨설팅 + AI 플랫폼 서비스
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-xs text-gray-400">
              <div>
                <h5 className="font-semibold mb-3 text-gray-300">거북스쿨</h5>
                <p>대표: 강준호</p>
                <p>사업자등록번호: 772-87-02782</p>
                <p>소재지: 서울 성북구 화랑로 211 벤처창업센터 105</p>
              </div>
              <div>
                <h5 className="font-semibold mb-3 text-gray-300">부설학원 (TS학원)</h5>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-gray-300">대전지점</p>
                    <p>주소: 대전 서구 월평동 286, 6층</p>
                    <p>연락처: 042-484-3356, 010-2518-7139</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 TS 사관. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
