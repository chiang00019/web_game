'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
  
    getSession();
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);  

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const AuthLinks = () => (
    <div className="flex items-center gap-4">
      {loading ? (
        <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
      ) : user ? (
        <>
          <span className="text-sm text-gray-600 hidden sm:block">{user.user_metadata.user_name || user.email}</span>
          <button 
            onClick={handleSignOut} 
            className="hidden md:block text-sm font-medium text-gray-700 hover:text-black"
          >
            登出
          </button>
        </>
      ) : (
        <Link href="/auth" className="hidden md:block text-sm font-medium text-gray-700 hover:text-black">登入</Link>
      )}
    </div>
  );

  return (
    <>
      <header className="w-full bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
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
            
            <Image src="/logo.png" alt="Logo" className="h-8 w-auto" width={32} height={32}/>
            <span className="font-bold text-lg">YH移動</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700 items-center">
            <Link href="/" className="hover:text-black">首頁</Link>
            <Link href="/shop" className="hover:text-black">商店</Link>
            <Link href="/disclaimer" className="hover:text-black">代儲免責聲明</Link>
            <Link href="/contact" className="hover:text-black">聯絡我們</Link>
            {user && <Link href="/account" className="hover:text-black">我的帳號</Link>}
          </nav>

          <div className="flex items-center gap-4">
            <AuthLinks />
            <span className="text-sm text-gray-600">NT$0</span>
            <Link href="/cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-4h-4" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-200/60 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" className="h-8 w-auto" width={32} height={32}/>
              <span className="font-bold text-lg">YH移動</span>
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
          <Link href="/" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>首頁</Link>
          <Link href="/shop" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>商店</Link>
          <Link href="/disclaimer" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>代儲免責聲明</Link>
          <Link href="/contact" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>聯絡我們</Link>
          {user ? (
            <>
              <Link href="/account" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>我的帳號</Link>
              <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="w-full text-left block px-4 py-3 text-base font-medium text-red-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors">登出</button>
            </>
          ) : (
            <Link href="/auth" className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>登入</Link>
          )}
        </nav>
      </div>
    </>
  );
}