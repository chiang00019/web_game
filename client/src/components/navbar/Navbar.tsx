'use client'

import AuthButton from '@/components/auth/AuthButton'
import { SearchIcon, MailIcon, ChevronDownIcon, Menu, X, Home, ShoppingBag, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname()
  const isShopPage = pathname.startsWith('/shop/')
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <header className="bg-[#4a3d8a] py-3 px-6 flex justify-between items-center relative z-50">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold hover:text-gray-300" onClick={closeMenu}>
            YH工作室
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-gray-300 flex items-center gap-2">
              <Home className="w-4 h-4" />
              主站
            </Link>
            <Link href="/shop" className="flex items-center text-white hover:text-gray-300 gap-2">
              <ShoppingBag className="w-4 h-4" />
              遊戲 <ChevronDownIcon className="w-4 h-4 ml-1" />
            </Link>
            <Link href="/admin" className="text-white hover:text-gray-300 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              管理
            </Link>
          </nav>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="請輸入游戲或商品關鍵詞搜尋" 
              className="bg-[#2a2d4e] border border-gray-600 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>
          <button className="text-white hover:text-gray-300">
            <MailIcon className="w-6 h-6" />
          </button>
          {mounted && (
            <div className="flex items-center gap-4">
              <AuthButton />
            </div>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="md:hidden flex items-center space-x-2">
          <button className="text-white hover:text-gray-300">
            <MailIcon className="w-6 h-6" />
          </button>
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-300 p-2 rounded-md transition-colors"
            aria-label="開啟選單"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out relative z-40 ${
        isMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-[#4a3d8a] border-t border-purple-400/30 shadow-lg">
          <div className="px-6 py-4 space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜尋遊戲..." 
                className="bg-[#2a2d4e] border border-gray-600 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>

            {/* Mobile Navigation Links */}
            <Link
              href="/"
              className="text-white hover:text-gray-300 hover:bg-purple-600/30 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center gap-3"
              onClick={closeMenu}
            >
              <Home className="w-5 h-5" />
              主站
            </Link>
            <Link
              href="/shop"
              className="text-white hover:text-gray-300 hover:bg-purple-600/30 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center gap-3"
              onClick={closeMenu}
            >
              <ShoppingBag className="w-5 h-5" />
              遊戲商店
            </Link>
            <Link
              href="/admin"
              className="text-white hover:text-gray-300 hover:bg-purple-600/30 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center gap-3"
              onClick={closeMenu}
            >
              <Settings className="w-5 h-5" />
              管理後台
            </Link>
            
            
            {/* Mobile Auth Section */}
            <div className="pt-2 border-t border-purple-400/30">
              <div className="px-3">
                {mounted && <AuthButton />}
              </div>
            </div>
          </div>
        </div>
      </div>


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