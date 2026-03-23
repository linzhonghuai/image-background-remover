'use client';

import React, { useState } from 'react';
import { Check, Crown, Building2, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/useLanguage';

type Plan = 'free' | 'pro' | 'business';

interface SubscriptionCardProps {
  compact?: boolean;
}

export default function SubscriptionCard({ compact = false }: SubscriptionCardProps) {
  const { t } = useLanguage();
  const [currentPlan, setCurrentPlan] = useState<Plan>('free');

  const plans = {
    free: {
      name: t.pricing.free.name,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      credits: 10,
      features: [t.pricing.free.f1, t.pricing.free.f2, t.pricing.free.f3, t.pricing.free.f4],
    },
    pro: {
      name: t.pricing.pro.name,
      icon: <Crown className="w-6 h-6" />,
      color: 'from-blue-600 to-purple-600',
      credits: 100,
      features: [t.pricing.pro.f1, t.pricing.pro.f2, t.pricing.pro.f3, t.pricing.pro.f4],
    },
    business: {
      name: t.pricing.business.name,
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-purple-600 to-pink-600',
      credits: 500,
      features: [t.pricing.business.f1, t.pricing.business.f2, t.pricing.business.f3, t.pricing.business.f4],
    },
  };

  const currentPlanData = plans[currentPlan];

  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 bg-gradient-to-br ${currentPlanData.color} rounded-lg text-white`}>
            {currentPlanData.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {currentPlanData.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentPlanData.credits} {t.dashboard.imagesPerMonth}
            </p>
          </div>
        </div>
        <button
          onClick={() => {}}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          {t.dashboard.upgrade}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t.dashboard.currentPlan}
        </h2>
        <span className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${currentPlanData.color} text-white rounded-full text-sm font-semibold`}>
          {currentPlanData.icon}
          {currentPlanData.name}
        </span>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        {currentPlanData.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 dark:text-gray-400">{feature}</span>
          </div>
        ))}
      </div>

      {/* Usage Stats */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t.dashboard.monthlyCredits}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {currentPlanData.credits}
          </span>
        </div>
      </div>

      {/* Upgrade Button */}
      {currentPlan !== 'business' && (
        <button
          onClick={() => {}}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
        >
          {t.dashboard.upgradePlan}
        </button>
      )}
    </div>
  );
}
