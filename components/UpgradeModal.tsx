'use client';

import React, { useEffect } from 'react';
import { X, Crown, Building2, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/useLanguage';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: 'free' | 'pro' | 'business';
}

export default function UpgradeModal({ isOpen, onClose, currentPlan = 'free' }: UpgradeModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'pro',
      name: t.pricing.pro.name,
      price: '¥9',
      yearlyPrice: '¥84',
      period: t.pricing.pro.period,
      perImage: t.pricing.pro.perImage,
      features: [t.pricing.pro.f1, t.pricing.pro.f2, t.pricing.pro.f3, t.pricing.pro.f4],
      icon: Crown,
      color: 'from-blue-600 to-purple-600',
      cta: t.pricing.pro.cta,
    },
    {
      id: 'business',
      name: t.pricing.business.name,
      price: '¥29',
      yearlyPrice: '¥276',
      period: t.pricing.business.period,
      perImage: t.pricing.business.perImage,
      features: [t.pricing.business.f1, t.pricing.business.f2, t.pricing.business.f3, t.pricing.business.f4],
      icon: Building2,
      color: 'from-purple-600 to-pink-600',
      cta: t.pricing.business.cta,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {t.quota.upgradeRequired}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t.quota.upgradeDesc}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6 space-y-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`border-2 rounded-xl p-6 transition-all ${
                  plan.id === 'pro'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-gradient-to-br ${plan.color} rounded-xl text-white flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                        {plan.id === 'pro' ? t.pricing.mostPopular : ''}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        /{plan.period}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({plan.perImage})
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        年付只需 {plan.yearlyPrice}（省 20%）
                      </p>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        // 处理升级逻辑
                        window.location.href = `/pricing?plan=${plan.id}`;
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                        plan.id === 'pro'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alternative */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t.quota.oneTimePurchase}
            </p>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {t.quota.viewPricing} →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
