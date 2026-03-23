import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',

  // 明确指定输出目录
  distDir: 'out',

  // 图片优化（静态导出需要）
  images: {
    unoptimized: true,
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
