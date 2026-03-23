'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  CreditCard,
  History,
  Settings,
  LogOut,
  TrendingUp,
  Calendar,
  Download,
  Crown,
  Building2
} from 'lucide-react';
import { useSession, logout } from '@/lib/useSession';
import { useLanguage } from '@/lib/i18n/useLanguage';
import UsageCard from '@/components/dashboard/UsageCard';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AccountSettings from '@/components/dashboard/AccountSettings';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, loading } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'subscription' | 'history' | 'settings'>('overview');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: t.dashboard.overview, icon: TrendingUp },
    { id: 'subscription', label: t.dashboard.subscription, icon: CreditCard },
    { id: 'history', label: t.dashboard.history, icon: History },
    { id: 'settings', label: t.dashboard.settings, icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t.dashboard.title}
                </h1>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t.dashboard.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              {/* User Profile */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-20 h-20 rounded-full mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Message */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    {t.dashboard.welcome}, {user.name.split(' ')[0]}! 👋
                  </h2>
                  <p className="opacity-90">
                    {t.dashboard.welcomeSubtitle}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <UsageCard />
                  <SubscriptionCard compact />
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        加入日期
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Recent Activity */}
                <RecentActivity />
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <SubscriptionCard />
                {/* Billing History */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t.dashboard.billingHistory}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.dashboard.noBillingHistory}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <RecentActivity full />
            )}

            {activeTab === 'settings' && (
              <AccountSettings user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
