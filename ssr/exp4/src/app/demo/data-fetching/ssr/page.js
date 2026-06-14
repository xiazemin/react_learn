// src/app/demo/data-fetching/ssr/page.js — SSR 演示
// 每次请求都在服务端获取数据，HTML 中包含最新内容
// force-dynamic = 强制每次请求都重新渲染（不使用缓存）

import Link from 'next/link';

// 强制动态渲染（每次都获取新数据）
export const dynamic = 'force-dynamic';

async function getLatestData() {
  // 模拟数据库查询（每次调用返回不同时间戳）
  await new Promise(r => setTimeout(r, 100));
  return {
    serverTime: new Date().toISOString(),
    random: Math.random().toFixed(4),
    pid: process.pid,
  };
}

export default async function SSRPage() {
  const data = await getLatestData();

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-red">SSR</span>
          Server-Side Rendering
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          每次请求都在服务端执行数据获取和渲染。<strong>刷新页面</strong>可以看到时间戳和随机数变化。
        </p>
      </div>

      <div className="card">
        <h2>📊 本次请求的数据</h2>
        <table style={{ marginTop: '0.8rem' }}>
          <tbody>
            <tr><td style={{ fontWeight: 500, width: '150px' }}>服务端时间</td><td><code className="timestamp">{data.serverTime}</code></td></tr>
            <tr><td style={{ fontWeight: 500 }}>随机数</td><td><code className="timestamp">{data.random}</code></td></tr>
            <tr><td style={{ fontWeight: 500 }}>Node.js PID</td><td><code className="timestamp">{data.pid}</code></td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: '#999' }}>
          👆 刷新页面试试：时间戳和随机数会变（每次请求重新获取），PID 不变（同一 Node 进程）。
        </p>
      </div>

      <div className="card">
        <h2>🔧 实现方式</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`// app/demo/data-fetching/ssr/page.js

// 关键：告诉 Next.js 每次请求都重新渲染
export const dynamic = 'force-dynamic';

// 这个函数每次请求都会执行
async function getLatestData() {
  await new Promise(r => setTimeout(r, 100));
  return {
    serverTime: new Date().toISOString(),  // 每次不同
    random: Math.random().toFixed(4),       // 每次不同
  };
}

export default async function SSRPage() {
  const data = await getLatestData();  // 服务端 await
  return <div>...</div>;               // 渲染成 HTML
}`}
        </pre>
      </div>

      <Link href="/demo/data-fetching" style={{ display: 'inline-block', color: '#4a90d9', textDecoration: 'none' }}>
        ← 返回数据获取 Demo
      </Link>
    </div>
  );
}
