'use client';

import React from 'react';
import { TrendingUp, Crown, Building2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/useLanguage';

interface QuotaDisplayProps {
  used: number;
  total: number;
  plan: 'free' | 'pro' | 'business';
  compact?: boolean;
}

export default function QuotaDisplay({ used, total, plan, compact = false }: QuotaDisplayProps) {
  const { t } = useLanguage();
  const percentage = Math.min((used / total) * 100, 100);
  const remaining = total - used;

  const planInfo = {
    free: { icon: TrendingUp, color: 'from-yellow-500 to-orange-500', name: t.pricing.free.name },
    pro: { icon: Crown, color: 'from-blue-600 to-purple-600', name: t.pricing.pro.name },
    business: { icon: Building2, color: 'from-purple-600 to-pink-600', name: t.pricing.business.name },
  };

  const info = planInfo[plan];
  const Icon = info.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className={`p-2 bg-gradient-to-br ${info.color} rounded-lg text-white`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {info.name}
            </span>
            <span className={`text-xs font-semibold ${remaining < 3 ? 'text-red-600' : 'text-gray-500'}`}>
              {remaining}/{total}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-full rounded-full transition-all ${
                remaining < 3
                  ? 'bg-red-500'
                  : `bg-gradient-to-r ${info.color}`
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 bg-gradient-to-br ${info.color} rounded-lg text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {info.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {plan === 'free' ? t.pricing.free.description : plan === 'pro' ? t.pricing.pro.description : t.pricing.business.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t.dashboard.usage}
          </span>
          <span className={`text-sm font-semibold ${remaining < 3 ? 'text-red-600' : 'text-blue-600 dark:text-blue-400'}`}>
            {remaining}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              remaining < 3
                ? 'bg-red-500'
                : `bg-gradient-to-r ${info.color}`
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Warning for low quota */}
      {remaining < 3 && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {t.quota.lowQuotaWarning.replace('{n}', remaining.toString())}
          </p>
        </div>
      )}
    </div>
  );
}
