"use client"

import { useEffect, useState } from "react"
import { List } from "lucide-react"

export function GuideToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const update = () => {
      const passed = items.filter(item => (document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) < 210)
      setActive(passed.at(-1)?.id ?? items[0]?.id)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [items])
  return <nav className="guide-toc" aria-label="전형안내 목차">
    <p><List size={16} />이 페이지에서</p>
    <ol>{items.map((item, index) => <li key={item.id}><a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</a></li>)}</ol>
    <div className="guide-toc-note">2027학년도 모집요강 기준<br />학교별 공식 공고를 함께 확인하세요.</div>
  </nav>
}
