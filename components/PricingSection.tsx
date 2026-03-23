'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/useLanguage';

type BillingPeriod = 'monthly' | 'yearly';

export default function PricingSection() {
  const { t } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const plans = [
    {
      name: t.pricing.free.name,
      description: t.pricing.free.description,
      price: 0,
      period: t.pricing.free.period,
      features: [
        t.pricing.free.f1,
        t.pricing.free.f2,
        t.pricing.free.f3,
        t.pricing.free.f4,
      ],
      cta: t.pricing.free.cta,
      popular: false,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      name: t.pricing.pro.name,
      description: t.pricing.pro.description,
      price: billingPeriod === 'monthly' ? 9 : 7,
      originalPrice: 9,
      period: t.pricing.pro.period,
      features: [
        t.pricing.pro.f1,
        t.pricing.pro.f2,
        t.pricing.pro.f3,
        t.pricing.pro.f4,
        t.pricing.pro.f5,
        t.pricing.pro.f6,
      ],
      cta: t.pricing.pro.cta,
      popular: true,
      icon: <Crown className="w-6 h-6" />,
    },
    {
      name: t.pricing.business.name,
      description: t.pricing.business.description,
      price: billingPeriod === 'monthly' ? 29 : 23,
      originalPrice: 29,
      period: t.pricing.business.period,
      features: [
        t.pricing.business.f1,
        t.pricing.business.f2,
        t.pricing.business.f3,
        t.pricing.business.f4,
        t.pricing.business.f5,
        t.pricing.business.f6,
        t.pricing.business.f7,
      ],
      cta: t.pricing.business.cta,
      popular: false,
      icon: <Building2 className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {t.pricing.subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t.pricing.monthly}
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t.pricing.yearly}
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                {t.pricing.save20}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500 transform md:-translate-y-2' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-xl">
                  {t.pricing.mostPopular}
                </div>
              )}

              <div className="p-8">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${plan.popular ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price === 0 ? '免费' : `¥${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  {plan.originalPrice && plan.price < plan.originalPrice && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="line-through">¥{plan.originalPrice}/月</span>
                      <span className="text-green-600 dark:text-green-400 ml-2">
                        {t.pricing.billedYearly}
                      </span>
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.pricing.comparison}{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t.pricing.learnMore}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
