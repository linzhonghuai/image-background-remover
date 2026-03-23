'use client';

import { useState, useRef, useEffect } from 'react';
import { LogIn, User, Loader2, ChevronDown } from 'lucide-react';
import { useSession, logout } from '@/lib/useSession';
import { useLanguage } from '@/lib/i18n/useLanguage';
import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  className?: string;
}

export default function LoginButton({ className = '' }: LoginButtonProps) {
  const { user, loading, clearSession } = useSession();
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setShowDropdown(false);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 已登录状态
  if (user) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
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
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block max-w-[120px] truncate">
            {user.name}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <button
              onClick={() => {
                router.push('/dashboard');
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-200">{t.dashboard.title}</span>
            </button>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-200">{t.login.signOut}</span>
            </button>
          </div>
        )}
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
