'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Left Side - Mobile Menu Button + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 mr-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            
            {/* Logo */}
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg">水豚移動</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
            <Link href="/" className="hover:text-black">首頁</Link>
            <Link href="/shop" className="hover:text-black">商店</Link>
            <Link href="/disclaimer" className="hover:text-black">代儲免責聲明</Link>
            <Link href="/contact" className="hover:text-black">聯絡我們</Link>
            <Link href="/account" className="hover:text-black">我的帳號</Link>
          </nav>

          {/* Right Side - Cart + Price */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">NT$0</span>
            <Link href="/cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-4h-4" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-200/60 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              <span className="font-bold text-lg">水豚移動</span>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link 
            href="/" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            首頁
          </Link>
          <Link 
            href="/shop" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            商店
          </Link>
          <Link 
            href="/disclaimer" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            代儲免責聲明
          </Link>
          <Link 
            href="/contact" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            聯絡我們
          </Link>
          <Link 
            href="/account" 
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            我的帳號
          </Link>
        </nav>
      </div>
    </>
  );
}
