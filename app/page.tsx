'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, Zap, Heart, AlertCircle } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import ProcessingProgress from '@/components/ProcessingProgress';
import ImageResult from '@/components/ImageResult';
import BackgroundSelector, { BackgroundType } from '@/components/BackgroundSelector';
import BackgroundRemovalDemo from '@/components/BackgroundRemovalDemo';
import BlogSection from '@/components/BlogSection';
import FAQSection from '@/components/FAQSection';
import PricingSection from '@/components/PricingSection';
import QuotaDisplay from '@/components/QuotaDisplay';
import UpgradeModal from '@/components/UpgradeModal';
import { useBackgroundRemoval } from '@/lib/useBackgroundRemoval';
import { useSession, login } from '@/lib/useSession';
import LoginButton from '@/components/LoginButton';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/i18n/useLanguage';
import { canProcessImage, recordUsage, getUserQuota } from '@/lib/quota';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('transparent');
  const [backgroundValue, setBackgroundValue] = useState<string | undefined>();
  const [oauthHandled, setOauthHandled] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [quota, setQuota] = useState<{ used: number; total: number; plan: 'free' | 'pro' | 'business' }>({
    used: 0,
    total: 5,
    plan: 'free',
  });
  const { t } = useLanguage();

  const { user, loading, setSession } = useSession();

  const { status, progress, processedBlob, error, removeBackgroundFromImage, reset } =
    useBackgroundRemoval();

  // Track if usage has been recorded for current processing
  const [usageRecorded, setUsageRecorded] = useState(false);

  // Load quota on mount and when user changes
  useEffect(() => {
    getUserQuota().then(setQuota).catch(console.error);
  }, [user]);

  // Record usage when processing completes
  useEffect(() => {
    if (status === 'completed' && !usageRecorded) {
      recordUsage().then(() => {
        setUsageRecorded(true);
        // Refresh quota
        getUserQuota().then(setQuota).catch(console.error);
      }).catch(console.error);
    }
  }, [status, usageRecorded]);

  const handleImageSelect = useCallback(async (file: File) => {
    // Check quota before processing
    const check = await canProcessImage();
    if (!check.canUse) {
      setShowUpgradeModal(true);
      return;
    }

    setUsageRecorded(false);
    setSelectedFile(file);
    await removeBackgroundFromImage(file);
  }, [removeBackgroundFromImage]);

  const handleReset = useCallback(() => {
    reset();
    setSelectedFile(null);
    setBackgroundType('transparent');
    setBackgroundValue(undefined);
    setUsageRecorded(false);
  }, [reset]);

  const handleBackgroundChange = useCallback((type: BackgroundType, value?: string) => {
    setBackgroundType(type);
    setBackgroundValue(value);
  }, []);

  // 处理 OAuth 回调
  useEffect(() => {
    if (oauthHandled) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // 使用 token 创建会话
      login(token)
        .then((userData) => {
          setSession(userData);
          // 清除 URL 中的 token 参数
          window.history.replaceState({}, '', window.location.pathname);
        })
        .catch((error) => {
          console.error('登录失败:', error);
        })
        .finally(() => {
          setOauthHandled(true);
        });
    } else {
      setOauthHandled(true);
    }
  }, [oauthHandled, setSession]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t.header.title}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t.header.subtitle}
                </p>
              </div>
            </div>

            {/* Features & Login */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>{t.header.featureFast}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>{t.header.featureHighQuality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>{t.header.featureMultiFormat}</span>
              </div>
              <LanguageSelector />
              {/* Login Button */}
              <LoginButton />
            </div>

            {/* Mobile Login */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSelector />
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Processing */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            {status === 'idle' && !selectedFile && (
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {t.hero.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t.hero.description}
                </p>
              </div>
            )}

            {/* Upload Area */}
            {status === 'idle' && !selectedFile && (
              <ImageUploader
                onImageSelect={handleImageSelect}
                isProcessing={false}
                disabled={false}
              />
            )}

            {/* Processing Progress */}
            {(status === 'processing' || status === 'error') && (
              <ProcessingProgress status={status} progress={progress} error={error} />
            )}

            {/* Result */}
            {status === 'completed' && processedBlob && selectedFile && (
              <ImageResult
                processedBlob={processedBlob}
                originalFile={selectedFile}
                onReset={handleReset}
                backgroundType={backgroundType}
                backgroundValue={backgroundValue}
              />
            )}
          </div>

          {/* Right Column - Background Options */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quota Display */}
              <QuotaDisplay used={quota.used} total={quota.total} plan={quota.plan} compact />

              {/* Background Selector */}
              {status === 'completed' && processedBlob && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <BackgroundSelector
                    onBackgroundChange={handleBackgroundChange}
                    selectedType={backgroundType}
                    selectedValue={backgroundValue}
                    disabled={false}
                  />
                </div>
              )}

              {/* Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t.instructions.title}
                </h3>
                <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xs">
                      1
                    </span>
                    <span>{t.instructions.step1}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xs">
                      2
                    </span>
                    <span>{t.instructions.step2}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xs">
                      3
                    </span>
                    <span>{t.instructions.step3}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xs">
                      4
                    </span>
                    <span>{t.instructions.step4}</span>
                  </li>
                </ol>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {t.instructions.supportedFormats}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['PNG', 'JPG', 'JPEG', 'WebP', 'GIF', 'BMP'].map((format) => (
                      <span
                        key={format}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    💡 <strong>{t.privacy.notice.split('：')[0]}：</strong>{t.privacy.notice.split('：')[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Animated Demo Section */}
      <BackgroundRemovalDemo />

      {/* Blog Section */}
      <BlogSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>{t.footer.copyright}</p>
            <p>{t.footer.poweredBy}</p>
          </div>
        </div>
      </footer>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={quota.plan}
      />
    </div>
  );
}
