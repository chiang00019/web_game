"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createSupabaseClient()

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleAuthAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error) {
        router.refresh(); // 強制刷新 server component
        router.push("/");
      }
    } else {
      // Sign Up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_name: username,
          },
        },
      });
      if (!error) {
        router.refresh(); // 強制刷新 server component
        router.push("/");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#2a2d4e] rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">
          {isLogin ? "登入" : "註冊"}
        </h1>
        <form onSubmit={handleAuthAction} className="space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                使用者名稱
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-[#1a1b2e] border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
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
              className="w-full px-3 py-2 mt-1 bg-[#1a1b2e] border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-[#1a1b2e] border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              {isLogin ? "登入" : "註冊"}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isLogin ? "需要帳號？立即註冊" : "已有帳號？立即登入"}
          </button>
        </div>
      </div>
    </div>
  );
}