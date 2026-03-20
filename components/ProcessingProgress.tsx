'use client';

import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export interface ProcessingStatusProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string | null;
}

const STATUS_MESSAGES = {
  processing: '正在处理图片...',
  completed: '处理完成！',
  error: '处理失败',
};

export default function ProcessingProgress({ status, progress, error }: ProcessingStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={`
              p-4 rounded-full transition-all duration-500
              ${
                status === 'completed'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : status === 'error'
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30 animate-pulse'
              }
            `}
          >
            {status === 'processing' && (
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            )}
            {status === 'completed' && (
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            )}
            {status === 'error' && (
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {STATUS_MESSAGES[status]}
          </p>
          {status === 'processing' && progress < 10 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              首次使用需要下载模型（约 50MB），请稍候...
            </p>
          )}
          {error && status === 'error' && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
          )}
        </div>

        {/* Progress Bar */}
        {status === 'processing' && (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {progress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
