'use client';

import { useState, useCallback, useRef } from 'react';
import { analytics } from './useAnalytics';

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface UseBackgroundRemovalReturn {
  status: ProcessingStatus;
  progress: number;
  processedBlob: Blob | null;
  error: string | null;
  removeBackgroundFromImage: (file: File) => Promise<void>;
  reset: () => void;
}

export function useBackgroundRemoval(): UseBackgroundRemovalReturn {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const removeBackgroundFromImage = useCallback(async (file: File) => {
    // Cancel any ongoing processing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setStatus('processing');
      setProgress(0);
      setError(null);
      setProcessedBlob(null);

      // 追踪背景移除开始
      analytics.backgroundRemovalStart();

      // 模拟进度（因为 API 调用无法获取真实进度）
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // 准备表单数据
      const formData = new FormData();
      formData.append('file', file);

      // 调用我们的 API 路由
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      clearInterval(progressInterval);

      // 检查错误响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: '处理失败，请重试'
        }));
        throw new Error(errorData.error || '处理失败');
      }

      // 获取处理后的图片
      const blob = await response.blob();

      setProcessedBlob(blob);
      setStatus('completed');
      setProgress(100);

      // 追踪背景移除完成
      analytics.backgroundRemovalComplete();
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setStatus('idle');
        setProgress(0);
      } else {
        console.error('Background removal error:', err);
        const errorMessage = err instanceof Error ? err.message : '处理失败，请重试';
        setError(errorMessage);
        setStatus('error');
        setProgress(0);

        // 追踪背景移除失败
        analytics.backgroundRemovalFailed(errorMessage);
      }
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus('idle');
    setProgress(0);
    setProcessedBlob(null);
    setError(null);
  }, []);

  return {
    status,
    progress,
    processedBlob,
    error,
    removeBackgroundFromImage,
    reset,
  };
}
