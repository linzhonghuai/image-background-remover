# 🚀 Cloudflare Pages 部署指南

## 快速部署（3 分钟）

### 1. 连接 GitHub 仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. 选择 **GitHub**，授权 Cloudflare 访问你的仓库
4. 选择 `image-background-remover` 仓库

### 2. 配置构建设置

在 **Build and deploy** 设置中：

```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
```

**重要配置：**
- ✅ 确保选择 **Next.js** 作为框架
- ❌ **不要**设置自定义部署命令（如 `npx wrangler deploy`）
- ❌ **不要**启用 `wrangler.toml` 配置文件

### 3. 设置环境变量

在 **Environment variables** 中添加：

```
Name: REMOVEBG_API_KEY
Value: P3RsWsQvbUaDpfNJ8KEsi6tv
```

- 在 **Production** 和 **Preview** 环境中都添加
- 不要勾选其他的可选配置

### 4. 开始部署

点击 **Save and Deploy**，等待 2-3 分钟。

---

## 部署成功后

你会得到一个 `.pages.dev` 域名，例如：
```
https://image-background-remover.pages.dev
```

访问这个域名测试你的应用！

---

## 常见错误排查

### 错误 1: `Missing entry-point to Worker script`

**原因：** 设置了自定义部署命令或 wrangler.toml 配置

**解决：**
1. 在项目设置中移除自定义部署命令
2. 删除或重命名 `wrangler.toml` 文件
3. 重新部署

### 错误 2: API 调用失败

**原因：** 环境变量未设置

**解决：**
1. 进入项目的 **Settings** → **Environment variables**
2. 添加 `REMOVEBG_API_KEY`
3. 重新部署

### 错误 3: 构建失败

**原因：** Node.js 版本不兼容

**解决：**
1. 进入 **Settings** → **Builds**
2. 设置 **Node.js version** 为 `22` 或 `20`
3. 重新部署

---

## 自定义域名（可选）

1. 在项目中进入 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名，例如：`remove-bg.yourdomain.com`
4. 按照提示配置 DNS 记录

---

## 监控使用情况

### Remove.bg API 配额
访问：https://www.remove.bg/api

查看每月 API 调用次数和剩余额度。

### Cloudflare Analytics
在 Cloudflare Dashboard 中查看：
- 访问量统计
- 请求分布
- 错误率

---

## 需要帮助？

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Remove.bg API 文档](https://www.remove.bg/api)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)

---

**祝你部署成功！** 🎉
