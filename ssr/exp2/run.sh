#!/bin/bash
# Exp2 一键启动：安装依赖 → 打包客户端 → 启动服务器
cd "$(dirname "$0")"
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building client bundle..."
node build.js

echo "🚀 Starting SSR server..."
node server.js
