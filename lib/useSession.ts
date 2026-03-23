'use client';

import { useState, useCallback, useEffect } from 'react';
import { analytics } from './useAnalytics';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Session {
  user: User | null;
  loading: boolean;
}

const SESSION_KEY = 'user_session';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化时从 localStorage 读取会话
  useEffect(() => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setUser(session);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  // 设置会话
  const setSession = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  }, []);

  // 清除会话
  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return {
    user,
    loading,
    setSession,
    clearSession,
  };
}

// 登录
export async function login(token: string): Promise<User> {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error('登录失败');
  }

  const data = await response.json();

  // 保存会话到 localStorage
  localStorage.setItem('user_session', JSON.stringify(data.user));

  // 追踪登录事件
  analytics.login();

  return data.user;
}

// 登出
export async function logout(): Promise<void> {
  await fetch('/api/auth/session', { method: 'DELETE' });

  // 清除本地会话
  localStorage.removeItem('user_session');

  // 追踪登出事件
  analytics.logout();

  // 重定向到首页
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

// 获取当前用户
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}
