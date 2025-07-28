import Link from 'next/link'
import Image from 'next/image'

export default function GameCard({ game }) {
  return (
    <Link href={`/shop/${game.id}`}>
      <Link href={`/shop/${game.id}`}>
        <div className="block border rounded-lg p-4 hover:shadow-lg">
          <div className="w-full h-48 relative mb-4">
            <Image src={game.icon_url} alt={game.name} fill className="object-cover rounded" />
          </div>
          <h2 className="text-lg font-bold">{game.name}</h2>
        </div>
      </Link>
    </Link>
  )
}
