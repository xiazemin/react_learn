// src/app/demo/data-fetching/isr/page.js — ISR 演示
// 构建时生成 HTML，但每隔 revalidate 秒自动重新生成
// 兼顾 SSG 的速度和 SSR 的新鲜度

import Link from 'next/link';

// ISR 关键配置：每 10 秒重新生成一次
export const revalidate = 10;

async function getProductData() {
  await new Promise(r => setTimeout(r, 50));
  return {
    generatedAt: new Date().toISOString(),
    random: Math.random().toFixed(4),
    revalidateInterval: '10 秒',
    products: [
      { id: 1, name: 'React 实战教程', price: 79.9 },
      { id: 2, name: 'Next.js 权威指南', price: 99.9 },
      { id: 3, name: 'TypeScript 入门', price: 59.9 },
    ],
  };
}

export default async function ISRPage() {
  const data = await getProductData();

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-blue">ISR</span>
          Incremental Static Regeneration
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          SSG + 定时更新。构建时生成，之后每 <strong>10 秒</strong> 自动重新生成。
          刷新页面可以看到数据变化。
        </p>
      </div>

      <div className="card">
        <h2>📊 本次渲染的数据</h2>
        <table style={{ marginTop: '0.8rem' }}>
          <tbody>
            <tr><td style={{ fontWeight: 500, width: '150px' }}>生成时间</td><td><code className="timestamp">{data.generatedAt}</code></td></tr>
            <tr><td style={{ fontWeight: 500 }}>随机数</td><td><code className="timestamp">{data.random}</code></td></tr>
            <tr><td style={{ fontWeight: 500 }}>更新间隔</td><td>{data.revalidateInterval}</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#999' }}>
          👆 刷新页面：前 10 秒内数据不变，10 秒后刷新会看到新数据。
        </p>
      </div>

      <div className="card">
        <h2>📦 商品数据（ISR 缓存中）</h2>
        <div style={{ marginTop: '0.8rem' }}>
          {data.products.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span>{p.name}</span>
              <span style={{ color: '#e74c3c', fontWeight: 600 }}>¥{p.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>🔧 实现方式</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`// app/demo/data-fetching/isr/page.js

// 关键：revalidate = 10 表示每 10 秒重新生成
export const revalidate = 10;

async function getProductData() {
  // 构建时执行一次，之后每 10 秒执行一次
  // 在 revalidate 间隔内，所有请求都返回缓存的 HTML
  return {
    generatedAt: new Date().toISOString(),
    random: Math.random().toFixed(4),
  };
}

export default async function ISRPage() {
  const data = await getProductData();
  return <div>...</div>;
}

// 工作流程：
// 1. next build → 生成静态 HTML（t=0）
// 2. 用户请求（t=5s）→ 返回 t=0 的 HTML（缓存命中）
// 3. 用户请求（t=12s）→ 返回 t=0 的 HTML（触发后台重新生成）
// 4. 后台生成完成 → 下次请求返回新的 HTML（t=12s）`}
        </pre>
      </div>

      <div className="card" style={{ background: '#e8f0fd' }}>
        <h2>💡 ISR vs SSR vs SSG</h2>
        <table style={{ marginTop: '0.5rem' }}>
          <thead>
            <tr><th></th><th>SSG</th><th>ISR</th><th>SSR</th></tr>
          </thead>
          <tbody>
            <tr><td style={{ fontWeight: 500 }}>速度</td><td>⚡⚡⚡</td><td>⚡⚡⚡（缓存时）/ ⚡（重建时）</td><td>⚡</td></tr>
            <tr><td style={{ fontWeight: 500 }}>新鲜度</td><td>❌ 不更新</td><td>✅ 每 N 秒</td><td>✅ 实时</td></tr>
            <tr><td style={{ fontWeight: 500 }}>服务器负载</td><td>零</td><td>低（后台重建）</td><td>高（每次渲染）</td></tr>
            <tr><td style={{ fontWeight: 500 }}>复杂度</td><td>简单</td><td>简单（加一行配置）</td><td>中等</td></tr>
          </tbody>
        </table>
      </div>

      <Link href="/demo/data-fetching" style={{ display: 'inline-block', color: '#4a90d9', textDecoration: 'none' }}>
        ← 返回数据获取 Demo
      </Link>
    </div>
  );
}
