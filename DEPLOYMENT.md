# 部署指南 - Cloudflare Pages

本文档详细说明如何将 AI 背景移除工具部署到 Cloudflare Pages。

## 📋 前置要求

- Cloudflare 账号（免费）
- GitHub 账号
- Remove.bg API 密钥

## 🔑 获取 Remove.bg API 密钥

1. 访问 [https://www.remove.bg/api](https://www.remove.bg/api)
2. 点击 "Get API Key" 注册账号
3. 验证邮箱
4. 在 Dashboard 获取 API 密钥
5. 免费版每月可处理 50 张图片

## 🚀 部署步骤

### 方式一：通过 GitHub 自动部署（推荐）

#### 1. 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI Background Remover"

# 创建 GitHub 仓库后，添加远程地址
git remote add origin https://github.com/YOUR_USERNAME/image-background-remover.git

# 推送代码
git push -u origin main
```

#### 2. 在 Cloudflare Pages 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **创建应用程序** > **Pages** > **连接到 Git**
4. 选择你的 GitHub 仓库并授权

#### 3. 配置构建设置

在部署配置页面填写：

```
项目名称：image-background-remover
生产分支：main
构建命令：npm run build
构建输出目录：.next
根目录：/ (留空)
```

#### 4. 设置环境变量

在 **环境变量** 部分添加：

```
REMOVEBG_API_KEY=your_actual_api_key_here
```

⚠️ **重要**：
- 不要在代码中硬编码 API 密钥
- 生产环境和预览环境使用不同的 API 密钥（推荐）

#### 5. 部署

点击 **保存并部署**，Cloudflare 会：
1. 从 GitHub 拉取代码
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build` 构建应用
4. 部署到全球 CDN

部署完成后，你会获得一个 `.pages.dev` 域名，例如：
- `https://image-background-remover.pages.dev`

### 方式二：通过 Wrangler CLI 部署

#### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare

```bash
wrangler login
```

这会打开浏览器进行授权。

#### 3. 构建项目

```bash
npm run build
```

#### 4. 部署

```bash
wrangler pages deploy .next --project-name=image-background-remover
```

#### 5. 设置环境变量

在 Cloudflare Dashboard 中手动添加环境变量：
1. 进入 **Workers & Pages** > 你的项目
2. **设置** > **环境变量**
3. 添加 `REMOVEBG_API_KEY`

## 🌐 配置自定义域名

### 在 Cloudflare Pages 中配置

1. 进入你的 Pages 项目
2. 点击 **自定义域**
3. 点击 **设置自定义域**
4. 输入你的域名，例如：
   - `bg-remover.yourdomain.com`
   - 或 `yourdomain.com`（根域名）

5. Cloudflare 会自动配置 DNS

### 更新 DNS 记录

如果域名不在 Cloudflare，需要手动添加 DNS 记录：

```
类型：CNAME
名称：bg-remover
目标：your-project.pages.dev
TTL：自动
```

## 🔄 自动部署

配置后，每次推送到 GitHub 主分支，Cloudflare 会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "Update feature"
git push origin main

# Cloudflare 自动触发部署
```

## 🔐 安全建议

### 1. 环境变量管理

- ✅ 使用 Cloudflare 环境变量存储 API 密钥
- ❌ 不要在代码中硬编码密钥
- ❌ 不要将 `.env.local` 提交到 Git

### 2. API 密钥轮换

定期更换 API 密钥：
1. 在 Remove.bg Dashboard 生成新密钥
2. 在 Cloudflare Pages 环境变量中更新
3. 重新部署应用

### 3. 速率限制

Remove.bg API 有速率限制：
- 免费版：每月 50 张图片
- 如需更高额度，考虑升级到付费版

## 📊 监控和分析

### Cloudflare Analytics

在 Cloudflare Pages Dashboard 查看：
- 访问量统计
- 地理分布
- 性能指标
- 错误日志

### Remove.bg Usage

在 Remove.bg Dashboard 查看：
- API 使用量
- 剩余额度
- 计费信息

## 🐛 故障排除

### 问题 1：部署失败

**错误**：构建失败

**解决方案**：
```bash
# 本地测试构建
npm run build

# 检查错误信息并修复
```

### 问题 2：API 密钥无效

**错误**：`API 密钥无效`

**解决方案**：
1. 检查 Cloudflare 环境变量是否正确设置
2. 确认 Remove.bg API 密钥有效
3. 重新部署应用

### 问题 3：图片处理失败

**错误**：`背景移除失败`

**可能原因**：
- API 配额已用完
- 图片格式不支持
- 图片过大（超过 12MB）

**解决方案**：
1. 检查 Remove.bg 使用额度
2. 确认图片格式为 JPG/PNG/WebP/GIF
3. 压缩大图片后再处理

## 💰 成本估算

### Cloudflare Pages（免费版）

- ✅ 无限带宽
- ✅ 无限请求
- ✅ 全球 CDN
- ✅ SSL 证书
- ✅ 500 个构建/月

### Remove.bg API

| 版本 | 价格 | 额度 |
|------|------|------|
| 免费版 | $0/月 | 50 张/月 |
| 基础版 | $0.20/张 | 无限制 |
| 专业版 | 联系销售 | 高级功能 |

**估算**：
- 个人项目：免费版足够
- 小型应用：约 $10/月（50 张/月）
- 中型应用：约 $100/月（500 张/月）

## 🚀 性能优化

### 1. 启用缓存

在 `next.config.ts` 中配置：

```typescript
const nextConfig: NextConfig = {
  // ...其他配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
};
```

### 2. 图片优化

- 限制上传图片大小
- 压缩图片后再处理
- 使用 WebP 格式

### 3. CDN 缓存

Cloudflare 自动缓存静态资源，无需额外配置。

## 📚 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Remove.bg API 文档](https://www.remove.bg/api)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

## 🆘 获取帮助

如遇到问题：
1. 查看 [Cloudflare Pages 常见问题](https://developers.cloudflare.com/pages/support/faq/)
2. 查看 [Remove.bg API 文档](https://www.remove.bg/api)
3. 提交 [GitHub Issue](https://github.com/yourusername/image-background-remover/issues)

---

祝你部署顺利！🎉
