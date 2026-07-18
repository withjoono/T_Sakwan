import RoundDetail from "./round-detail"

// 정적 export — 1~5회 페이지 프리렌더
export function generateStaticParams() {
  return [1, 2, 3, 4, 5].map((round) => ({ round: String(round) }))
}

export default async function RoundPage({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params
  return <RoundDetail round={Number(round)} />
}
