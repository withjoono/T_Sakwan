"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenCheck, Newspaper, Sparkles } from "lucide-react"

const TABS = [
  { href: "/promo", label: "서비스 소개", icon: Sparkles },
  { href: "/promo/guide", label: "사용법", icon: BookOpenCheck },
  { href: "/promo/blog", label: "블로그", icon: Newspaper },
]

export default function PromoTabs() {
  const pathname = (usePathname() || "").replace(/\/$/, "")
  return (
    <nav className="pm-tabs" aria-label="T사관 소개">
      <ul>
        {TABS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} aria-current={pathname === href ? "page" : undefined}>
              <Icon size={14} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
