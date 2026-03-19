'use client';

import React, { useState, useCallback } from 'react';
import { Sparkles, Zap, Heart } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import ProcessingProgress from '@/components/ProcessingProgress';
import ImageResult from '@/components/ImageResult';
import BackgroundSelector, { BackgroundType } from '@/components/BackgroundSelector';
import { useBackgroundRemoval } from '@/lib/useBackgroundRemoval';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('transparent');
  const [backgroundValue, setBackgroundValue] = useState<string | undefined>();

  const { status, progress, processedBlob, error, removeBackgroundFromImage, reset } =
    useBackgroundRemoval();

  const handleImageSelect = useCallback((file: File) => {
    setSelectedFile(file);
    removeBackgroundFromImage(file);
  }, [removeBackgroundFromImage]);

  const handleReset = useCallback(() => {
    reset();
    setSelectedFile(null);
    setBackgroundType('transparent');
    setBackgroundValue(undefined);
  }, [reset]);

  const handleBackgroundChange = useCallback((type: BackgroundType, value?: string) => {
    setBackgroundType(type);
    setBackgroundValue(value);
  }, []);

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
                  AI 背景移除工具
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  5 秒自动去除图片背景
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>快速处理</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>高质量输出</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>多种格式</span>
              </div>
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
                  一键移除图片背景
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  使用最先进的 AI 技术，在几秒钟内自动去除任何图片的背景。
                  支持人像、产品、动物等多种类型。
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
                  使用说明
                </h3>
                <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xs">
                      1
                    </span>
                    <span>拖拽或点击上传图片</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xs">
                      2
                    </span>
                    <span>AI 自动处理（约 5 秒）</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xs">
                      3
                    </span>
                    <span>选择背景或保持透明</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-semibold text-xs">
                      4
                    </span>
                    <span>下载处理后的图片</span>
                  </li>
                </ol>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    支持的格式
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
                    💡 <strong>隐私说明：</strong>图片会发送到 Remove.bg API 进行处理，
                    处理完成后立即删除，不会存储在任何服务器。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>© 2024 AI 背景移除工具. 完全免费使用.</p>
            <p>由 Next.js 和 AI 技术驱动</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
