# 快速开始指南

## 5 分钟快速部署到 Cloudflare Pages

### 第 1 步：获取 API 密钥（2 分钟）

1. 访问 [https://www.remove.bg/api](https://www.remove.bg/api)
2. 注册账号（免费）
3. 获取 API 密钥

### 第 2 步：推送代码到 GitHub（2 分钟）

```bash
# 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库后
git remote add origin https://github.com/YOUR_USERNAME/image-background-remover.git
git push -u origin main
```

### 第 3 步：部署到 Cloudflare（1 分钟）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** > **创建应用程序** > **Pages**
3. 选择 **连接到 Git**，授权并选择你的仓库
4. 配置：
   - 构建命令：`npm run build`
   - 构建输出目录：`.next`
   - 环境变量：`REMOVEBG_API_KEY=你的API密钥`
5. 点击 **保存并部署**

✅ 完成！你会得到一个 `.pages.dev` 域名

---

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 创建 .env.local 文件
echo "REMOVEBG_API_KEY=你的API密钥" > .env.local

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
open http://localhost:3000
```

---

## 常见问题

### Q: 如何查看 API 使用量？

A: 登录 [Remove.bg Dashboard](https://www.remove.bg/api#dashboard) 查看剩余额度

### Q: 免费版够用吗？

A: 免费版每月 50 张，个人测试或小流量网站足够

### Q: 如何升级额度？

A: 在 Remove.bg Dashboard 升级到付费版，或考虑自建 API 服务

### Q: 支持哪些图片格式？

A: JPG、PNG、WebP、GIF，最大 12MB

---

## 下一步

- 📖 阅读 [完整部署指南](./DEPLOYMENT.md)
- 🎨 自定义主题和样式
- 🚀 配置自定义域名
- 📊 查看分析和监控

---

**需要帮助？** 查看 [README](./README.md) 或提交 [Issue](https://github.com/yourusername/image-background-remover/issues)
