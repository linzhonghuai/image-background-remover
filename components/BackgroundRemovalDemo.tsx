'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/useLanguage';

interface BackgroundRemovalDemoProps {
  originalImage?: string;
  processedImage?: string;
}

export default function BackgroundRemovalDemo({
  originalImage = '/demo/original.png',
  processedImage = '/demo/processed.png',
}: BackgroundRemovalDemoProps) {
  const { t } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.demo.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t.demo.description}
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
            style={{ aspectRatio: '16/10' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsHovering(true)}
            onTouchEnd={() => setIsHovering(false)}
          >
            {/* Original Image (Background) */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
              <img
                src={originalImage}
                alt={t.demo.originalLabel}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg">
                <span className="text-white font-semibold text-sm">{t.demo.originalLabel}</span>
              </div>
            </div>

            {/* Processed Image (Foreground) - Clipped */}
            <div
              className="absolute inset-0 overflow-hidden bg-gray-50 dark:bg-gray-600"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              {/* Checkerboard pattern for transparency - more visible */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }} />

              <img
                src={processedImage}
                alt={t.demo.processedLabel}
                className="w-full h-full object-cover relative z-10"
              />
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4 z-30 px-4 py-2 bg-green-600/90 backdrop-blur-sm rounded-lg">
                <span className="text-white font-semibold text-sm">{t.demo.processedLabel}</span>
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className={`absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-opacity ${
                isHovering ? 'opacity-100' : 'opacity-60'
              }`}
              style={{ left: `${sliderPosition}%` }}
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center transition-transform ${
                  isHovering ? 'scale-110' : 'scale-100'
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </div>
            </div>

            {/* Animated Background Removal Effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-40"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  mixBlendMode: 'overlay',
                }}
              />
            </motion.div>
          </div>

          {/* Instruction */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            {t.demo.sliderInstruction}
            <svg
              className="w-4 h-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.demo.featureFastTitle}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.demo.featureFastDesc}</p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.demo.featureQualityTitle}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.demo.featureQualityDesc}</p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t.demo.featurePrivacyTitle}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t.demo.featurePrivacyDesc}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
