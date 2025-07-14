'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, profile, loading } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              GameStore
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/shop" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  商店
                </Link>
                {profile?.is_admin && (
                  <Link href="/admin" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                    管理後台
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {!loading && (
                <>
                  {user ? (
                    <div className="ml-3 relative">
                      <span className="text-gray-800 text-sm font-medium mr-4">歡迎, {user.email}</span>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        登出
                      </button>
                    </div>
                  ) : (
                    <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      登入 / 註冊
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
