// src/app/demo/routing/page.js — Demo 1: 文件路由
// 展示 Next.js 的文件系统路由如何映射到 URL

import Link from 'next/link';

const demos = [
  { url: '/demo/routing',          file: 'app/demo/routing/page.js',             desc: '当前页面（静态路由）' },
  { url: '/demo/routing/hello',     file: 'app/demo/routing/[slug]/page.js',      desc: '动态路由：slug = "hello"' },
  { url: '/demo/routing/nextjs',    file: 'app/demo/routing/[slug]/page.js',      desc: '动态路由：slug = "nextjs"' },
  { url: '/demo/routing/a/b/c',     file: 'app/demo/routing/[...all]/page.js',    desc: 'Catch-all：all = ["a","b","c"]' },
  { url: '/demo/routing/x/y/z',     file: 'app/demo/routing/[...all]/page.js',    desc: 'Catch-all：all = ["x","y","z"]' },
];

export default function RoutingPage() {
  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-green">Demo 1</span>
          📁 文件路由 — 文件系统即路由
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Next.js 的路由完全由文件系统决定。你不需要写 <code>&lt;Route&gt;</code> 配置，
          只要在 <code>app/</code> 目录下创建 <code>page.js</code>，URL 路由就自动生成了。
        </p>
      </div>

      {/* 文件 → URL 映射 */}
      <div className="card">
        <h2>🔗 文件 → URL 映射规则</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`app/
├── page.js                 →  /
├── demo/
│   ├── page.js             →  /demo
│   └── routing/
│       ├── page.js         →  /demo/routing          ← 你在这里
│       ├── [slug]/
│       │   └── page.js     →  /demo/routing/:slug    ← 动态路由
│       └── [...all]/
│           └── page.js     →  /demo/routing/*        ← Catch-all
│
├── products/
│   ├── page.js             →  /products
│   └── [id]/
│       └── page.js         →  /products/:id
│
└── api/
    └── hello/
        └── route.js        →  /api/hello             ← API Route`}
        </pre>
      </div>

      {/* 实际演示 */}
      <div className="card">
        <h2>🧪 亲自试试</h2>
        <div style={{ marginTop: '0.8rem' }}>
          {demos.map(d => (
            <div key={d.url} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <code style={{ color: '#2563eb' }}>{d.url}</code>
                <span style={{ color: '#999', marginLeft: '0.5rem', fontSize: '0.85rem' }}>{d.desc}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#999', fontSize: '0.8rem' }}>←</span>
                <code style={{ fontSize: '0.8rem', color: '#999' }}>{d.file}</code>
                <Link href={d.url} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>
                  访问 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 对比 react-router */}
      <div className="card">
        <h2>⚖️ 对比 react-router 的路由定义方式</h2>
        <div style={{ marginTop: '0.8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', color: '#999' }}>react-router（手动配置）</h3>
            <pre style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
{`// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/posts/*" element={<Posts />} />
        {/* 每加一个路由都要手动加一行 */}
      </Routes>
    </BrowserRouter>
  );
}`}
            </pre>
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', color: '#2d7a2d' }}>Next.js（自动路由）</h3>
            <pre style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
{`// 不需要任何路由配置文件！
// 只需要创建对应的文件：

app/
├── page.js           →  /
├── about/
│   └── page.js       →  /about
├── users/
│   └── [id]/
│       └── page.js   →  /users/:id
└── posts/
    └── [...all]/
        └── page.js   →  /posts/*

// 创建文件 = 注册路由
// 删除文件 = 删除路由`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
