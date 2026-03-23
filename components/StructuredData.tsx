export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PureBGRemover - AI 背景移除工具",
    "url": "https://purebgremover.com",
    "description": "免费 AI 背景移除工具，5 秒自动去除图片背景。支持人像、产品、动物等多种类型。",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI 自动背景移除",
      "支持 PNG、JPG、WebP、GIF 格式",
      "透明背景导出",
      "多种纯色和渐变背景",
      "完全免费使用",
      "无需注册",
      "保护隐私"
    ],
    "browserRequirements": "需要支持现代 Web 浏览器（Chrome、Firefox、Safari、Edge）",
    "softwareVersion": "1.0",
    "author": {
      "@type": "Organization",
      "name": "PureBGRemover",
      "url": "https://purebgremover.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
