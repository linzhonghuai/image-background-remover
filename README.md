# AI 背景移除工具

基于 Remove.bg API 的智能背景移除工具，支持一键去除图片背景。

## ✨ 特性

- ⚡ **快速处理** - 5 秒内完成背景移除
- 🎨 **多种背景** - 支持透明、纯色、渐变背景
- 📥 **多格式导出** - PNG（透明）和 JPG（带背景）
- 🌐 **响应式设计** - 完美适配桌面和移动设备
- 🌙 **暗黑模式** - 支持系统主题切换
- 🔒 **隐私保护** - 图片处理完成后立即删除，不存储

## 🚀 技术栈

- **Next.js 16** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 现代化样式
- **Remove.bg API** - 专业背景移除服务
- **Edge Runtime** - Cloudflare Workers 支持

## 📦 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 并添加你的 Remove.bg API 密钥：

```env
REMOVEBG_API_KEY=your_api_key_here
```

> 💡 **获取 API 密钥**：访问 [https://www.remove.bg/api](https://www.remove.bg/api) 注册账号并获取免费 API 密钥（每月 50 张免费额度）

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🌐 部署到 Cloudflare Pages

### 方式一：通过 Git 仓库部署（推荐）

1. **推送代码到 GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **连接 Cloudflare Pages**

- 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
- 进入 **Pages** > **创建项目** > **连接到 Git**
- 选择你的 GitHub 仓库
- 配置构建设置：

```
构建命令：npm run build
构建输出目录：.next
环境变量：
  REMOVEBG_API_KEY: your_api_key_here
```

3. **部署**

Cloudflare Pages 会自动部署，完成后获得 `.pages.dev` 域名

### 方式二：通过 Wrangler CLI 部署

1. **安装 Wrangler CLI**

```bash
npm install -g wrangler
```

2. **登录 Cloudflare**

```bash
wrangler login
```

3. **配置环境变量**

在 Cloudflare Dashboard 中设置环境变量 `REMOVEBG_API_KEY`

4. **部署**

```bash
wrangler pages deploy .next
```

### 配置自定义域名（可选）

在 Cloudflare Pages 项目设置中添加自定义域名：
- 进入项目 > **自定义域** > **设置自定义域**
- 输入你的域名（如 `bg-remover.yourdomain.com`）
- Cloudflare 会自动配置 DNS

## 🔧 环境变量

| 变量名 | 说明 | 必填 | 默认值 |
|--------|------|------|--------|
| `REMOVEBG_API_KEY` | Remove.bg API 密钥 | 是 | - |

## 📝 API 限制

Remove.bg API 免费版限制：
- 每月 50 张图片
- 最大文件大小：12MB
- 支持格式：JPG、PNG、WebP、GIF

付费版可提升至：
- 每月数千张图片
- 最大文件大小：25MB
- 优先处理队列

查看完整定价：[https://www.remove.bg/pricing](https://www.remove.bg/pricing)

## 🎯 使用说明

1. **上传图片** - 拖拽或点击上传
2. **等待处理** - AI 自动移除背景（约 3-5 秒）
3. **选择背景** - 保持透明或选择纯色/渐变
4. **下载图片** - 下载 PNG（透明）或 JPG（带背景）

## 📁 项目结构

```
image-background-remover/
├── app/
│   ├── api/
│   │   └── remove-background/
│   │       └── route.ts          # Remove.bg API 集成
│   ├── page.tsx                   # 主页面
│   ├── layout.tsx                 # 布局
│   └── globals.css                # 全局样式
├── components/
│   ├── ImageUploader.tsx          # 图片上传组件
│   ├── ProcessingProgress.tsx    # 进度显示
│   ├── ImageResult.tsx            # 结果展示
│   └── BackgroundSelector.tsx     # 背景选择器
├── lib/
│   └── useBackgroundRemoval.ts    # 背景移除 Hook
└── package.json
```

## 🛠️ 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 🌟 特色功能

### 背景替换
- 透明背景（PNG）
- 10 种预设纯色
- 6 种渐变效果
- 自定义颜色选择器

### 图片导出
- PNG 格式（透明背景）
- JPG 格式（带选择背景）
- 缩放预览功能

### 用户体验
- 拖拽上传支持
- 实时处理进度
- 响应式设计
- 暗黑模式支持

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请通过 [GitHub Issues](https://github.com/yourusername/image-background-remover/issues) 联系。

---

**注意**：本项目使用 Remove.bg API，需要遵守其[服务条款](https://www.remove.bg/terms)和[隐私政策](https://www.remove.bg/privacy)。
