'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Download } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/useLanguage';
import { useSession } from '@/lib/useSession';

interface UsageData {
  used: number;
  total: number;
  resetDate: string;
}

export default function UsageCard() {
  const { t } = useLanguage();
  const { user } = useSession();
  const [usage, setUsage] = useState<UsageData>({
    used: 0,
    total: 10,
    resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  const percentage = (usage.used / usage.total) * 100;
  const remaining = usage.total - usage.used;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {t.dashboard.usage}
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {usage.used} / {usage.total} {t.dashboard.images}
          </span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t.dashboard.remaining}
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {remaining}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t.dashboard.resets}
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date(usage.resetDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
