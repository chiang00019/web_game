'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// A simple component to display the error message
function ErrorMessage() {
  const searchParams = useSearchParams();
  const errorDescription = searchParams.get('error_description');
  const [isVisible, setIsVisible] = useState(!!errorDescription);

  useEffect(() => {
    if (errorDescription) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [errorDescription]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
      {errorDescription}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-white px-4">
      <ErrorMessage />
      
      {/* Hero Section */}
      <section className="w-full max-w-3xl p-6 sm:p-10 rounded-3xl bg-gray-100 shadow-md mt-8 text-center">
        
        {/* 主標題 */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-6 leading-tight text-gray-800">
          YH移動代儲網
        </h1>

        {/* 副標題 */}
        <p className="text-base xs:text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
          正規安全手遊代儲 包售後服務 <br />
          讓你隨時隨地都可以快速儲值
        </p>

        {/* Call to Action */}
        <a
          href="/shop"
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition text-base xs:text-lg sm:text-xl border border-black"
        >
          快速下單購買
          <span className="text-lg">↗</span>
        </a>

        {/* 用戶頭像 + 信任文字 */}
        <div className="mt-10 flex flex-col items-center">
          <div className="flex -space-x-4">
            <Image src="https://randomuser.me/api/portraits/women/1.jpg" alt="User1" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white" width={48} height={48} />
            <Image src="https://randomuser.me/api/portraits/women/2.jpg" alt="User2" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white" width={48} height={48} />
            <Image src="https://randomuser.me/api/portraits/men/1.jpg" alt="User3" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white" width={48} height={48} />
            <Image src="https://randomuser.me/api/portraits/men/2.jpg" alt="User4" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white" width={48} height={48} />
          </div>
          <p className="text-sm xs:text-base text-gray-700 mt-3">
            經營一年 完成破萬筆訂單 安全放心
          </p>
        </div>
      </section>
    </main>
  );
}