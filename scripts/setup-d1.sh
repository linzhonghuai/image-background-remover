#!/bin/bash

# Cloudflare D1 数据库和 Worker 设置脚本
# 使用方法: ./scripts/setup-d1.sh

set -e

echo "🚀 开始设置 Cloudflare D1 数据库和 Worker..."

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI 未安装"
    echo "请运行: npm install -g wrangler"
    exit 1
fi

# 登录 Cloudflare (如果未登录)
echo "📝 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "请先登录 Cloudflare:"
    wrangler login
fi

# 创建 D1 数据库
echo "💾 创建 D1 数据库..."
DB_NAME="bg-remover-db"
wrangler d1 create $DB_NAME || echo "数据库可能已存在"

# 获取数据库 ID
echo "🔍 获取数据库信息..."
DB_INFO=$(wrangler d1 list | jq -r ".[] | select(.name==\"$DB_NAME\")")
DB_ID=$(echo $DB_INFO | jq -r '.uuid')

if [ -z "$DB_ID" ] || [ "$DB_ID" = "null" ]; then
    echo "❌ 无法获取数据库 ID"
    exit 1
fi

echo "✅ 数据库 ID: $DB_ID"

# 更新 wrangler.toml 中的 database_id
echo "📝 更新 wrangler.toml..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/database_id = \"auto-generated-on-create\"/database_id = \"$DB_ID\"/g" wrangler.toml
else
    # Linux
    sed -i "s/database_id = \"auto-generated-on-create\"/database_id = \"$DB_ID\"/g" wrangler.toml
fi

# 运行数据库迁移
echo "🔄 运行数据库迁移..."
wrangler d1 execute $DB_NAME --local --file=./migrations/0001_init.sql
wrangler d1 execute $DB_NAME --file=./migrations/0001_init.sql

echo ""
echo "✅ 设置完成！"
echo ""
echo "📋 下一步操作:"
echo "1. 更新 workers/api.ts 中的 API 路由"
echo "2. 部署 Worker: cd workers && npm run deploy"
echo "3. 在 Cloudflare Pages 设置中配置 Worker 路由:"
echo "   - /api/* -> bg-remover-worker"
echo ""
echo "📚 更多信息请查看 SETUP_D1.md"
