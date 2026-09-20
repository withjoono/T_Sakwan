import Link from "next/link"
import { ArrowUpRight, Compass } from "lucide-react"

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-intro">
    <div className="page-intro-inner">
      <div><p className="eyebrow"><span />{eyebrow}</p><h1>{title}</h1><p className="page-intro-description">{description}</p></div>
      <Link href="/admission" className="intro-guide"><Compass size={24} /><span>목표 학교의 전형부터<br /><strong>2027 전형안내 확인</strong></span><ArrowUpRight size={19} /></Link>
    </div>
  </section>
}
