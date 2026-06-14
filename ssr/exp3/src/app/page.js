// src/app/page.js — 首页（Server Component）
// 这是一个服务端组件：直接在 Node.js 中运行，代码不发送到浏览器

import Link from 'next/link';

// 这个函数在服务端执行，获取当前时间
// 浏览器看到的是渲染后的 HTML，不会执行这段 JS
async function getServerTime() {
  // 模拟异步数据获取
  await new Promise((r) => setTimeout(r, 10));
  return new Date().toISOString();
}

export default async function HomePage() {
  const serverTime = await getServerTime();

  return (
    <div>
      <div className="card">
        <h1>🚀 Next.js App Router — SSR 完整示例</h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          基于 React Server Components (RSC) 的服务端渲染，对比 exp1/exp2
          手动搭建的方案，体验框架带来的开发效率提升。
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <span className="tag tag-server">Server Component</span>
          页面在服务端渲染，代码不会发送到浏览器。当前时间：
          <code className="server-time">{serverTime}</code>
        </p>
      </div>

      <div className="card">
        <h2>📌 核心概念：Server Components vs Client Components</h2>
        <table style={{ width: '100%', marginTop: '0.8rem', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e8e8e8', textAlign: 'left' }}>
              <th style={{ padding: '0.4rem 0.8rem' }}>特性</th>
              <th style={{ padding: '0.4rem 0.8rem' }}>
                <span className="tag tag-server">Server</span>
              </th>
              <th style={{ padding: '0.4rem 0.8rem' }}>
                <span className="tag tag-client">Client</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['默认渲染位置', '服务端 (Node.js)', '浏览器'],
              ['如何标记', '默认（无需标记）', '"use client" 指令'],
              ['能否用 useState/useEffect', '❌', '✅'],
              ['能否直接访问后端资源', '✅（DB、FS、API Key）', '❌（只能通过 API）'],
              ['代码是否发送到浏览器', '❌ 不发送', '✅ 打包发送'],
              ['SEO', '✅ 完整 HTML', '⚠️ 需等 JS 加载'],
            ].map(([feature, server, client]) => (
              <tr key={feature} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '0.4rem 0.8rem', fontWeight: 500 }}>{feature}</td>
                <td style={{ padding: '0.4rem 0.8rem' }}>{server}</td>
                <td style={{ padding: '0.4rem 0.8rem' }}>{client}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>📁 项目结构（App Router 约定）</h2>
        <pre style={{ marginTop: '0.8rem', fontSize: '0.85rem', lineHeight: 1.5, background: '#f8f8f8', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
{`src/app/
├── layout.js          ← 根布局（Server Component，包裹所有页面）
├── page.js            ← 首页 "/"（就是这个文件）
├── globals.css        ← 全局样式
├── products/
│   ├── page.js        ← "/products" 商品列表（Server Component）
│   └── [id]/
│       └── page.js    ← "/products/1" 动态路由（Server Component）
│       └── AddToCartButton.js  ← 加购按钮（Client Component "use client"）
├── cart/
│   └── page.js        ← "/cart" 购物车（Server Component + Server Action）
└── demo/
    └── page.js        ← "/demo" 交互演示（Server + Client 组件混合）`}
        </pre>
      </div>

      <div className="card">
        <h2>🔗 快速导航</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
          <Link href="/products" className="btn btn-primary">📦 商品列表（数据获取）</Link>
          <Link href="/cart" className="btn btn-secondary">🛒 购物车（Server Action）</Link>
          <Link href="/demo" className="btn btn-primary">🎮 交互演示（混合渲染）</Link>
        </div>
      </div>
    </div>
  );
}
