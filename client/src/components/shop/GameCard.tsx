import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  game: {
    id: string;
    name: string;
    description: string;
    image_url: string;
  };
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/shop/${game.id}`}>
      <div className="overflow-hidden bg-white rounded-lg shadow-md cursor-pointer">
        <Image
          src={game.image_url}
          alt={game.name}
          width={500}
          height={300}
          className="object-cover w-full h-48"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold">{game.name}</h3>
          <p className="mt-2 text-gray-600">{game.description}</p>
        </div>
      </div>
    </Link>
  );
}
