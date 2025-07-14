'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('如果您輸入的電子郵件存在，將會收到一封密碼重設信件。');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 pt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md h-fit">
        <h1 className="text-2xl font-bold text-center text-gray-900">忘記密碼</h1>
        <p className="text-center text-gray-800">
          請輸入您的電子郵件地址，我們將會寄送重設密碼的連結給您。
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              電子郵件
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>

          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? '傳送中...' : '傳送重設連結'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link href="/auth" className="text-sm text-blue-600 hover:underline">
            返回登入頁面
          </Link>
        </div>
      </div>
    </div>
  );
}
