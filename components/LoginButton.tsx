'use client';

import { useState } from 'react';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { useSession, logout } from '@/lib/useSession';
import { useLanguage } from '@/lib/i18n/useLanguage';

interface LoginButtonProps {
  className?: string;
}

export default function LoginButton({ className = '' }: LoginButtonProps) {
  const { user, loading, clearSession } = useSession();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  // 处理登录
  const handleLogin = () => {
    setIsLoading(true);
    // 重定向到 Google OAuth
    window.location.href = '/api/auth/google';
  };

  // 处理登出
  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    clearSession();
    setIsLoading(false);
  };

  // 已登录状态
  if (user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
            {user.name}
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{t.login.signOut}</span>
        </button>
      </div>
    );
  }

  // 未登录状态
  return (
    <button
      onClick={handleLogin}
      disabled={isLoading || loading}
      className={`flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <LogIn className="w-5 h-5" />
      )}
      <span>{t.login.signIn}</span>
    </button>
  );
}
