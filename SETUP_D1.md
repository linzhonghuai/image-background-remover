# Cloudflare D1 数据库设置指南

本指南将帮助你设置 Cloudflare D1 数据库和 Worker API，实现跨设备配额同步。

## 📋 前置要求

- Node.js 18+ 已安装
- Cloudflare 账号
- Wrangler CLI 已安装: `npm install -g wrangler`

## 🚀 快速开始

### 方式一：自动设置（推荐）

**Windows 用户:**
```bash
scripts\setup-d1.bat
```

**Mac/Linux 用户:**
```bash
chmod +x scripts/setup-d1.sh
./scripts/setup-d1.sh
```

### 方式二：手动设置

#### 步骤 1: 创建 D1 数据库

```bash
# 登录 Cloudflare
wrangler login

# 创建数据库
wrangler d1 create bg-remover-db

# 记下返回的 database_id
```

#### 步骤 2: 更新 wrangler.toml

```toml
[[d1_databases]]
binding = "DB"
database_name = "bg-remover-db"
database_id = "你的数据库ID"  # 替换这里
```

#### 步骤 3: 运行数据库迁移

```bash
# 本地测试
wrangler d1 execute bg-remover-db --local --file=./migrations/0001_init.sql

# 生产环境
wrangler d1 execute bg-remover-db --file=./migrations/0001_init.sql
```

#### 步骤 4: 部署 Worker

```bash
cd workers
npm install
npm run deploy
```

#### 步骤 5: 配置 Cloudflare Pages Functions

1. 进入 Cloudflare Dashboard
2. 选择你的 Pages 项目
3. 进入 Settings → Functions
4. 添加 D1 数据库绑定:
   - Variable name: `DB`
   - D1 database: `bg-remover-db`
5. 添加路由重定向 (可选):
   - `/api/*` → Worker

## 📊 数据库表结构

### users 表
```sql
- id: 用户唯一标识
- google_id: Google OAuth ID
- email: 邮箱
- name: 名称
- picture: 头像
- plan: 套餐 (free/pro/business)
- created_at, updated_at
```

### quotas 表
```sql
- user_id: 用户 ID
- used: 已使用次数
- total: 总配额
- reset_date: 重置日期
- plan: 当前套餐
```

### usage_records 表
```sql
- id: 记录 ID
- user_id: 用户 ID
- processed_at: 处理时间
- image_size: 图片大小
- resolution_mp: 分辨率
- status: 状态
```

## 🔧 API 端点

### GET /api/quota
获取用户配额信息

**响应:**
```json
{
  "used": 5,
  "total": 10,
  "resetDate": "2024-04-01T00:00:00.000Z",
  "plan": "free",
  "isLoggedIn": true
}
```

### POST /api/usage
记录使用次数

**请求体:**
```json
{
  "imageSize": 1024000,
  "resolutionMp": 5.2
}
```

### POST /api/sync-user
同步/创建用户

**请求体:**
```json
{
  "googleId": "google-oauth-id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://..."
}
```

## 🔍 验证部署

### 测试数据库连接

```bash
# 查询数据库
wrangler d1 execute bg-remover-db --command="SELECT * FROM users"

# 查看配额
wrangler d1 execute bg-remover-db --command="SELECT * FROM quotas"
```

### 测试 API

```bash
# 健康检查
curl https://your-worker.workers.dev/health

# 获取配额
curl https://your-worker.workers.dev/api/quota
```

## 🛠️ 故障排查

### 问题 1: Worker 返回 404

**解决方案:**
- 检查 Worker 是否正确部署
- 确认路由配置正确

### 问题 2: D1 绑定错误

**解决方案:**
```bash
# 查看 D1 列表
wrangler d1 list

# 确认 database_id 正确
cat wrangler.toml
```

### 问题 3: CORS 错误

**解决方案:**
Worker API 已配置 CORS，如仍有问题，检查:
- 请求来源是否在允许列表中
- Headers 是否正确设置

## 📚 相关文档

- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

## 🆘 获取帮助

如有问题，请查看:
1. Cloudflare Dashboard 日志
2. Worker 的 `console.log` 输出
3. 浏览器开发者工具网络请求

---

**注意:** localStorage 作为降级方案已内置，即使 API 不可用，应用仍可正常运行。
