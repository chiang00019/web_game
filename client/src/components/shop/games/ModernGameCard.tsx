import Image from "next/image";
import Link from "next/link";
import { Gamepad2, ArrowRight, Zap } from "lucide-react";

interface GameCardProps {
  game: {
    id: number;
    name: string;
    description?: string;
    icon_path?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

export default function ModernGameCard({ game }: GameCardProps) {
  return (
    <Link href={`/shop/${game.id}`}>
      <div className="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Game Icon/Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          {game.icon_path ? (
            <Image
              src={game.icon_path}
              alt={game.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 group-hover:from-blue-300/30 group-hover:to-purple-300/30 transition-all duration-300"></div>
              <div className="relative">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                  <Gamepad2 className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {game.name.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>上線中</span>
            </div>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm font-medium">立即儲值</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 line-clamp-1">
              {game.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          
          {game.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {game.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-500">熱門遊戲</span>
            </div>
            
            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
              <span>進入儲值</span>
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </Link>
  );
}