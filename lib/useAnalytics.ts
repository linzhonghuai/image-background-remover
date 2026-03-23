// Google Analytics 事件追踪

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-3J33JX53T5';

// 页面访问追踪
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: url,
    });
  }
};

// 事件追踪
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 预定义的事件追踪函数
export const analytics = {
  // 图片上传
  imageUpload: () => trackEvent('upload', 'image', 'user uploaded an image'),

  // 背景移除开始
  backgroundRemovalStart: () => trackEvent('background_removal_start', 'processing'),

  // 背景移除完成
  backgroundRemovalComplete: () => trackEvent('background_removal_complete', 'processing'),

  // 背景移除失败
  backgroundRemovalFailed: (error: string) => trackEvent('background_removal_failed', 'processing', error),

  // 图片下载
  imageDownload: (format: 'png' | 'jpg') => trackEvent('download', 'image', format),

  // 背景选择
  backgroundChange: (type: string) => trackEvent('background_change', 'customization', type),

  // 页面错误
  error: (description: string) => trackEvent('error', 'system', description),

  // 登录
  login: () => trackEvent('login', 'authentication', 'google'),

  // 登出
  logout: () => trackEvent('logout', 'authentication'),
};
