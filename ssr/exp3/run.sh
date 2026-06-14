#!/bin/bash
# Exp3 一键启动：安装依赖 → 启动 Next.js 开发服务器
cd "$(dirname "$0")"
set -e

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting Next.js dev server (port 3002)..."
echo ""
echo "  首页:     http://localhost:3002"
echo "  商品列表: http://localhost:3002/products"
echo "  购物车:   http://localhost:3002/cart"
echo "  交互演示: http://localhost:3002/demo"
echo ""
npm run dev
