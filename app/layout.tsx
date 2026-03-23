import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import { LanguageProvider } from "@/lib/i18n/useLanguage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI 背景移除工具 - 免费在线图片背景去除 | PureBGRemover",
    template: "%s | PureBGRemover"
  },
  description: "免费 AI 背景移除工具，5 秒自动去除图片背景。支持人像、产品、动物等多种类型，无需注册，保护隐私。支持 PNG、JPG、WebP 等格式，最高质量输出。",
  keywords: [
    "背景移除",
    "图片背景去除",
    "AI 背景移除",
    "免费背景移除",
    "在线背景移除",
    "background remover",
    "remove background",
    "透明背景",
    "图片处理",
    "抠图"
  ],
  authors: [{ name: "PureBGRemover" }],
  creator: "PureBGRemover",
  publisher: "PureBGRemover",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://purebgremover.com",
    title: "AI 背景移除工具 - 免费在线图片背景去除",
    description: "5 秒自动去除图片背景，完全免费，支持多种格式。使用先进的 AI 技术，轻松创建透明背景图片。",
    siteName: "PureBGRemover",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PureBGRemover - AI 背景移除工具"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 背景移除工具 - 免费在线图片背景去除",
    description: "5 秒自动去除图片背景，完全免费，支持多种格式。",
    images: ["/twitter-image.png"],
    creator: "@purebgremover",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://purebgremover.com"
  },
  verification: {
    google: "yTL13ptc3IdBrR6uUPO-NlizirjiAZwwERRA_Bfd_E0"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <GoogleAnalytics />
        <MicrosoftClarity />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
