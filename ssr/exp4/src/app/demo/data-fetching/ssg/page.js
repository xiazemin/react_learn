// src/app/demo/data-fetching/ssg/page.js — SSG 演示
// 构建时生成 HTML，之后所有请求都返回同一个静态文件
// 刷新页面数据不会变（除非重新构建）

import Link from 'next/link';

async function getBuildTimeData() {
  // 这个函数只在 `next build` 时执行一次
  await new Promise(r => setTimeout(r, 50));
  return {
    buildTime: new Date().toISOString(),
    random: Math.random().toFixed(4),
    message: '这段数据在构建时就确定了，之后不会变',
  };
}

export default async function SSGPage() {
  const data = await getBuildTimeData();

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-green">SSG</span>
          Static Site Generation
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          构建时一次性生成 HTML。之后所有请求都返回同一个文件。<strong>刷新页面数据不会变</strong>。
        </p>
      </div>

      <div className="card">
        <h2>📊 构建时的数据</h2>
        <table style={{ marginTop: '0.8rem' }}>
          <tbody>
            <tr><td style={{ fontWeight: 500, width: '150px' }}>构建时间</td><td><code className="timestamp">{data.buildTime}</code></td></tr>
            <tr><td style={{ fontWeight: 500 }}>随机数</td><td><code className="timestamp">{data.random}</code></td></tr>
            <tr><td style={{ fontWeight: 500 }}>说明</td><td>{data.message}</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: '#999' }}>
          👆 刷新页面试试：所有值都不变。这是构建时生成的静态 HTML。
        </p>
      </div>

      <div className="card">
        <h2>🔧 实现方式</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`// app/demo/data-fetching/ssg/page.js

// 不需要任何特殊配置！
// 在 Server Component 中直接 await 就是 SSG
// Next.js 默认行为：构建时获取数据，生成静态 HTML

async function getBuildTimeData() {
  return {
    buildTime: new Date().toISOString(),  // 构建时确定
    random: Math.random().toFixed(4),       // 构建时确定
  };
}

export default async function SSGPage() {
  const data = await getBuildTimeData();  // 只在 build 时执行一次
  return <div>...</div>;
}

// 验证方法：
// 1. npm run build → 看到 "○ /demo/data-fetching/ssg"（○ = Static）
// 2. npm start → 刷新页面，数据不变
// 3. 再次 npm run build → 数据更新为新的构建时间`}
        </pre>
      </div>

      <div className="card" style={{ background: '#e8f8e8' }}>
        <h2>💡 SSG 的优势</h2>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
          <li><strong>速度极快</strong>：HTML 已经生成好了，服务器只需返回文件</li>
          <li><strong>CDN 友好</strong>：静态文件可以被全球 CDN 缓存</li>
          <li><strong>零服务器负载</strong>：不需要运行时计算</li>
          <li><strong>安全性高</strong>：没有服务端代码执行</li>
        </ul>
      </div>

      <Link href="/demo/data-fetching" style={{ display: 'inline-block', color: '#4a90d9', textDecoration: 'none' }}>
        ← 返回数据获取 Demo
      </Link>
    </div>
  );
}
