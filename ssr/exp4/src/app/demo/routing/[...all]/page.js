// src/app/demo/routing/[...all]/page.js — Catch-all 路由
// [...all] 捕获剩余所有路径段，all 是一个数组

import Link from 'next/link';

export default async function CatchAllPage({ params }) {
  const { all } = await params;

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-orange">Catch-all 路由</span>
          [...all] = {JSON.stringify(all)}
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          <code>[...all]</code> 会捕获 URL 中该位置之后的<strong>所有路径段</strong>，
          以数组形式传入。适合做文档路由、嵌套页面等。
        </p>
      </div>

      <div className="card">
        <h2>🔧 代码解析</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`// app/demo/routing/[...all]/page.js
export default async function CatchAllPage({ params }) {
  const { all } = await params;
  // all 是一个数组，包含所有路径段
  return <pre>{JSON.stringify(all)}</pre>;
}

// 访问 /demo/routing/a       → all = ["a"]
// 访问 /demo/routing/a/b     → all = ["a", "b"]
// 访问 /demo/routing/a/b/c   → all = ["a", "b", "c"]`}
        </pre>
      </div>

      <div className="card">
        <h2>🧪 试试不同的路径</h2>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            ['a', 'a'],
            ['a/b', 'a, b'],
            ['a/b/c', 'a, b, c'],
            ['docs/react/hooks', 'docs, react, hooks'],
          ].map(([path, label]) => (
            <Link key={path} href={`/demo/routing/${path}`} className="btn btn-secondary">
              /demo/routing/{path}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/demo/routing" style={{ display: 'inline-block', marginTop: '0.5rem', color: '#4a90d9', textDecoration: 'none' }}>
        ← 返回路由 Demo
      </Link>
    </div>
  );
}
