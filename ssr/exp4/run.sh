#!/bin/bash
cd "$(dirname "$0")"
set -e
echo "📦 Installing dependencies..."
npm install
echo "🚀 Starting Next.js dev server (port 3003)..."
echo ""
echo "  首页:           http://localhost:3003"
echo "  Demo 1 路由:    http://localhost:3003/demo/routing"
echo "  Demo 2 数据获取: http://localhost:3003/demo/data-fetching"
echo "  Demo 3 API:     http://localhost:3003/demo/api"
echo "  Demo 4 Streaming: http://localhost:3003/demo/streaming"
echo ""
npm run dev
