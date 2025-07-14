'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('密碼不相符');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(`登入錯誤：${error.message}`);
        } else {
          setMessage('登入成功！正在跳轉...');
          router.push('/');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              user_name: userName,
            },
          },
        });

        if (error) {
          setError(`註冊錯誤：${error.message}`);
        } else {
          setMessage('註冊成功！請檢查您的電子郵件以進行驗證。');
        }
      }
    } catch (error) {
      setError(`發生未知錯誤：${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">{isLogin ? '登入' : '註冊'}</h2>
      <form onSubmit={handleAuth}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="user_name">
              使用者名稱
            </label>
            <input
              id="user_name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Your Name"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
            電子郵件
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
            密碼
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
        </div>
        {!isLogin && (
          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="confirmPassword">
              確認密碼
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed text-blue-600 font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center border border-blue-600"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isLogin ? '登入中...' : '註冊中...'}
            </>
          ) : (
            isLogin ? '登入' : '註冊'
          )}
        </button>
      </form>
      {error && (
        <p className="mt-4 text-center text-sm text-red-500">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-4 text-center text-sm text-green-600">
          {message}
        </p>
      )}
      <div className="mt-6 text-center text-sm text-gray-800">
        {isLogin ? (
          <>
            <span>還沒有帳號嗎？ </span>
            <button
              onClick={() => setIsLogin(false)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              立即註冊
            </button>
            <span className="mx-2">|</span>
            <Link
              href="/auth/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              忘記密碼？
            </Link>
          </>
        ) : (
          <>
            <span>已經有帳號了？ </span>
            <button
              onClick={() => setIsLogin(true)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              立即登入
            </button>
          </>
        )}
      </div>
    </div>
  );
}
