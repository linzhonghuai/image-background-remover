# 配额系统架构说明

## 系统概述

配额系统采用 **Cloudflare D1 + Workers API + localStorage 降级** 的三层架构：

```
用户请求
    ↓
[前端] quota.ts
    ↓
尝试: Cloudflare Worker API
    ↓ (失败)
降级: localStorage
```

## 数据流

### 1. 用户登录流程

```
Google OAuth
    ↓
/api/auth/session (验证 JWT)
    ↓
保存会话到 localStorage + sessionStorage
    ↓
调用 /api/sync-user 同步到 D1
    ↓
创建用户记录和配额记录
```

### 2. 配额查询流程

```
前端调用 getUserQuota()
    ↓
尝试: GET /api/quota
    ├─ 成功 → 返回 D1 数据
    └─ 失败 → 降级到 localStorage
```

### 3. 使用记录流程

```
图片处理完成
    ↓
前端调用 recordUsage()
    ↓
尝试: POST /api/usage
    ├─ 成功 → 写入 D1
    └─ 失败 → 写入 localStorage
```

## 配额规则

| 用户类型 | 配额 | 重置周期 | 最大分辨率 |
|---------|------|---------|-----------|
| 未登录 | 5次 | 每天 | 2MP |
| 免费版 | 10次 | 每月 | 5MP |
| 专业版 | 100次 | 每月 | 25MP |
| 企业版 | 500次 | 每月 | 50MP |

## 数据库设计

### 表关系

```
users (用户表)
  ↓ 1:N
usage_records (使用记录表)

users (用户表)
  ↓ 1:1
quotas (配额表)

users (用户表)
  ↓ 1:N
subscriptions (订阅表)
```

### 索引优化

- `users.google_id` - 快速查找用户
- `quotas.user_id` - 配额查询
- `usage_records.user_id` + `processed_at` - 使用历史查询

## API 设计

### 端点列表

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/quota | 获取配额 |
| POST | /api/usage | 记录使用 |
| POST | /api/sync-user | 同步用户 |
| GET | /health | 健康检查 |

### 认证方式

- Cookie-based session (`user_session`)
- JWT token in sessionStorage
- Worker 从 Cookie 中提取用户身份

## 部署架构

```
Cloudflare Pages (静态站点)
    ↓
Functions (/api/*)
    ↓
Cloudflare Worker (API 处理)
    ↓
D1 Database (数据存储)
```

## 容错机制

### 1. API 不可用
- 自动降级到 localStorage
- 用户仍可正常使用
- 数据暂时本地存储

### 2. 数据库连接失败
- Worker 返回错误
- 前端捕获并降级
- 保证用户体验不中断

### 3. 网络超时
- 设置合理的超时时间
- 超时后自动降级
- 不阻塞用户操作

## 性能优化

### 1. 缓存策略
- 配额数据短期缓存 (30s)
- localStorage 作为持久缓存
- 减少数据库查询

### 2. 批量操作
- 使用事务确保一致性
- 批量插入使用记录
- 减少网络往返

### 3. 边缘计算
- Worker 分布在全球边缘节点
- D1 数据库本地化访问
- 低延迟响应

## 安全考虑

### 1. 输入验证
- 所有 API 输入验证
- 防止 SQL 注入
- 参数化查询

### 2. 访问控制
- Cookie-based 认证
- 验证用户身份
- 防止越权访问

### 3. 数据加密
- HTTPS 传输
- Cookie Secure 标志
- 敏感数据保护

## 监控和日志

### 1. Worker 日志
- console.log 输出
- Cloudflare Dashboard 查看
- 错误追踪

### 2. 数据库查询
- 慢查询监控
- 错误查询记录
- 性能分析

### 3. 用户行为
- 配额使用趋势
- API 调用统计
- 降级比例

## 扩展性

### 1. 水平扩展
- Worker 自动扩展
- D1 数据库限制宽松
- 支持高并发

### 2. 功能扩展
- 添加新的 API 端点
- 扩展数据库表结构
- 支持更多认证方式

### 3. 多环境
- wrangler.toml 配置
- 独立的生产/预览环境
- 数据库隔离

## 未来改进

1. **实时同步**: WebSockets 实时更新配额
2. **离线支持**: Service Worker 缓存
3. **批量操作**: 批量记录使用
4. **数据分析**: 使用趋势分析
5. **预警系统**: 配额不足提醒

---

**维护者**: 开发团队
**最后更新**: 2024-03-24
