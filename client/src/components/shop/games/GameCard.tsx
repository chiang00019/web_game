import Link from 'next/link'

export default function GameCard({ game }) {
  return (
    <Link href={`/shop/${game.id}`}>
      <a className="block border rounded-lg p-4 hover:shadow-lg">
        <img src={game.icon_url} alt={game.name} className="w-full h-48 object-cover mb-4" />
        <h2 className="text-lg font-bold">{game.name}</h2>
      </a>
    </Link>
  )
}
