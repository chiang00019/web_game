'use client'

import AuthButton from '@/components/auth/AuthButton'
import { SearchIcon, MailIcon, ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname()
  const isShopPage = pathname.startsWith('/shop/')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <header className="bg-[#4a3d8a] py-3 px-6 flex justify-between items-center">
        {isShopPage ? (
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold hover:text-gray-300">
              YH工作室
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-gray-300">主站</Link>
              <Link href="/shop" className="flex items-center text-white hover:text-gray-300">
                遊戲 <ChevronDownIcon className="w-4 h-4 ml-1" />
              </Link>
              <Link href="/admin" className="text-white hover:text-gray-300">管理</Link>
            </nav>
          </div>
        ) : (
          <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold hover:text-gray-300">
            YH工作室
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-gray-300">主站</Link>
            <Link href="/shop" className="flex items-center text-white hover:text-gray-300">
              遊戲 <ChevronDownIcon className="w-4 h-4 ml-1" />
            </Link>
            <Link href="/admin" className="text-white hover:text-gray-300">管理</Link>
          </nav>
        </div>
        )}
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="請輸入游戲或商品關鍵詞搜尋" 
              className="bg-[#2a2d4e] border border-gray-600 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>
          <button className="hidden md:flex items-center text-white hover:text-gray-300">
            TWD | 繁體中文 <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>
          <button className="text-white hover:text-gray-300">
            <MailIcon className="w-6 h-6" />
          </button>
          {mounted && (
            <div className="flex items-center gap-4">
              <AuthButton />
            </div>
          )}
        </div>
      </header>

      <div className="bg-[#2a2d4e] py-2 px-6 text-center text-sm">
        <p>
          <span className="bg-purple-600 p-1 rounded-md mr-2">$</span> 
          <Link href="/auth" className="underline ml-1 hover:text-gray-300">
            前往註冊 {'>'}
          </Link>
        </p>
      </div>
    </>
  );
} 