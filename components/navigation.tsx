"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SatelliteHeader, type HeaderLinkProps, type HeaderGroup } from "@tskool/satellite-header"
import { useAuth } from "@/lib/use-auth"
import { contentNav, preparationGroups } from "@/lib/header-navigation"

const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || "https://tskool.kr"

export default function Navigation() {
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout, loginUrl } = useAuth()
  const accountGroup: HeaderGroup = {
    id: "account", label: "사용자별", title: isAuthenticated ? `${user?.userName || "회원"}님의 T사관` : "학생·학부모·선생님과 함께 준비",
    description: "T스쿨 공통 계정으로 로그인하고 준비 상황을 함께 확인하세요.",
    guide: { label: isAuthenticated ? "내 프로필" : "T스쿨 로그인", href: isAuthenticated ? `${HUB_URL}/users/profile` : loginUrl },
    tools: [
      { title: "수험생 학습", description: "나의 학습 계획을 관리합니다.", app: "T사관", url: "/planner" },
      { title: "학부모·선생님 계정연동", description: "T스쿨에서 학생 계정과 연결합니다.", app: "T스쿨", url: `${HUB_URL}/account-linkage` },
      { title: "내 프로필", description: "공통 계정 정보를 확인합니다.", app: "T스쿨", url: `${HUB_URL}/users/profile` },
      { title: "결제 내역", description: "구매한 이용권과 결제 내역을 확인합니다.", app: "T스쿨", url: `${HUB_URL}/users/payment` },
    ],
  }
  // 패키지의 링크 어댑터에서 기존 SSO 로그아웃 동작을 연결한다.
  function HeaderLink({ href, onClick, children, ...props }: HeaderLinkProps) {
    if (href === "#sakwan-logout") return <a {...props} href={href} onClick={event => {
      event.preventDefault()
      onClick?.(event)
      logout()
      window.location.assign(HUB_URL)
    }}>{children}</a>
    if (/^https?:\/\//.test(href)) return <a {...props} href={href} onClick={onClick}>{children}</a>
    return <Link {...props} href={href} onClick={onClick}>{children}</Link>
  }
  return <SatelliteHeader
    brand={{ name: "T사관", suffix: "사관", caption: "사관학교·경찰대 입시 준비", logoSrc: "/logo.png?v=2" }}
    pathname={pathname}
    LinkComponent={HeaderLink}
    groups={[...preparationGroups, accountGroup]}
    nav={[...contentNav, { label: isLoading ? "계정 확인 중" : isAuthenticated ? "로그아웃" : "로그인", href: isAuthenticated ? "#sakwan-logout" : loginUrl }]}
    utilities={{
      productsUrl: `${HUB_URL}/products`,
      loginUrl,
      accountLinkageUrl: `${HUB_URL}/account-linkage`,
      notifications: <><p>T스쿨에 로그인한 뒤 상단 알림 메뉴에서 개인 알림을 확인하세요.</p><a className="utility-action" href={HUB_URL} target="_blank" rel="noopener noreferrer">T스쿨로 이동 (새 탭)</a></>,
      shareTitle: "사관학교·경찰대 준비, 함께 보기",
      shareDescription: "현재 입시 정보를 공유하거나 학부모·선생님 계정과 연결하세요.",
    }}
  />
}
