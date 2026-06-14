// src/app/demo/routing/[slug]/page.js — 动态路由
// [slug] 表示这个段是动态的，slug 的值会作为 params 传入

import Link from 'next/link';

export default async function SlugPage({ params }) {
  const { slug } = await params;

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-blue">动态路由</span>
          [slug] = &quot;{slug}&quot;
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          URL 中 <code>/demo/routing/</code> 后面的任意一段都会被捕获为 <code>slug</code> 参数。
        </p>
      </div>

      <div className="card">
        <h2>🔧 代码解析</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`// app/demo/routing/[slug]/page.js
export default async function SlugPage({ params }) {
  const { slug } = await params;  // ← Next.js 15 中 params 是 Promise
  return <h1>slug = {slug}</h1>;
}

// 访问 /demo/routing/hello  → slug = "hello"
// 访问 /demo/routing/nextjs → slug = "nextjs"
// 访问 /demo/routing/123    → slug = "123"`}
        </pre>
      </div>

      <div className="card">
        <h2>🧪 试试其他 slug</h2>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['hello', 'nextjs', 'react', '123', 'hello-world'].map(s => (
            <Link key={s} href={`/demo/routing/${s}`} className="btn btn-secondary">
              /demo/routing/{s}
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
