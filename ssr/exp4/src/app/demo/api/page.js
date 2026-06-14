// src/app/demo/api/page.js — Demo 3: API Routes
// Next.js 的 Route Handler 让前端项目也能提供后端 API

'use client';

import { useState, useEffect } from 'react';

export default function APIDemoPage() {
  const [hello, setHello] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState('');

  const fetchHello = async () => {
    setLoading('hello');
    const res = await fetch('/api/hello');
    const data = await res.json();
    setHello(data);
    setLoading('');
  };

  const fetchProducts = async () => {
    setLoading('products');
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading('');
  };

  const createProduct = async () => {
    setLoading('create');
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '新课程', price: 199.9 }),
    });
    const data = await res.json();
    // 刷新列表
    await fetchProducts();
    setLoading('');
  };

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-green">Demo 3</span>
          🔌 API Routes — 前端即后端
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Next.js 的 <code>app/api/</code> 目录就是后端。你不需要另起一个 Express 服务，
          前后端在同一个项目中。点击下面的按钮测试 API 调用。
        </p>
      </div>

      <div className="card">
        <h2>📁 API 文件结构</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`app/api/
├── hello/
│   └── route.js        →  GET /api/hello
└── products/
    └── route.js        →  GET /api/products
                         →  POST /api/products`}
        </pre>
      </div>

      {/* 交互按钮 */}
      <div className="card">
        <h2>🧪 交互测试</h2>
        <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={fetchHello} disabled={loading === 'hello'}>
            {loading === 'hello' ? '⏳' : '📡'} GET /api/hello
          </button>
          <button className="btn btn-primary" onClick={fetchProducts} disabled={loading === 'products'}>
            {loading === 'products' ? '⏳' : '📦'} GET /api/products
          </button>
          <button className="btn btn-secondary" onClick={createProduct} disabled={loading === 'create'}>
            {loading === 'create' ? '⏳' : '➕'} POST /api/products
          </button>
        </div>

        {hello && (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>GET /api/hello 响应：</h3>
            <div className="api-response">{JSON.stringify(hello, null, 2)}</div>
          </div>
        )}

        {products && (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>GET /api/products 响应：</h3>
            <div className="api-response">{JSON.stringify(products, null, 2)}</div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>🔧 Route Handler 代码</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`// app/api/hello/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Next.js API Route!',
    timestamp: new Date().toISOString(),
  });
}

// app/api/products/route.js
import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/mock-data';

// GET /api/products — 获取商品列表
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

// POST /api/products — 创建商品
export async function POST(request) {
  const body = await request.json();
  // ... 保存到数据库
  return NextResponse.json({ success: true, product: body }, { status: 201 });
}`}
        </pre>
      </div>

      <div className="card">
        <h2>⚖️ 对比：传统架构 vs Next.js 全栈</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`传统架构（前后端分离）：               Next.js 全栈：

  前端项目 (Vite)                       前端 + 后端（一个项目）
  ├── src/                              ├── app/
  │   └── components/                   │   ├── page.js          ← 前端页面
  └── package.json                      │   ├── components/      ← 前端组件
      react, react-dom                  │   └── api/             ← 后端 API
                                         │       └── products/
  后端项目 (Express)                     │           └── route.js
  ├── routes/                           └── package.json
  │   └── products.js                       next, react, react-dom
  └── package.json
      express, cors, ...               一个项目 = 前端 + 后端

  两个项目需要分别部署、分别维护`}
        </pre>
      </div>
    </div>
  );
}
