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
    // Force a reload to clear all state and redirect to the auth page
    router.push('/auth');
    router.refresh();
  };

  const displayName = profile?.user_name || user?.email;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              YH工作坊
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/shop" className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  商店
                </Link>
                {profile?.is_admin && (
                  <Link href="/admin" className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                    管理後台
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {loading ? (
                <div className="animate-pulse h-8 w-24 bg-gray-200 rounded-md"></div>
              ) : (
                <>
                  {user ? (
                    <div className="ml-3 relative flex items-center">
                      <span className="text-gray-800 text-sm font-medium mr-4">歡迎, {displayName}</span>
                      <button
                        onClick={handleLogout}
                        className="bg-white hover:bg-gray-100 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-red-600"
                      >
                        登出
                      </button>
                    </div>
                  ) : (
                    <Link href="/auth" className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-md text-sm font-medium border border-blue-600">
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