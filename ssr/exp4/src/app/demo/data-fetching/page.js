// src/app/demo/data-fetching/page.js — Demo 2: 数据获取模式
// 展示 SSR / SSG / ISR / Streaming 四种渲染策略

import Link from 'next/link';

const strategies = [
  {
    name: 'SSR（Server-Side Rendering）',
    tag: '每次请求',
    tagClass: 'tag-red',
    href: '/demo/data-fetching/ssr',
    desc: '每次用户请求都在服务端获取最新数据，然后渲染 HTML。适合实时性要求高的页面。',
    when: '用户仪表盘、实时数据看板、个性化内容',
  },
  {
    name: 'SSG（Static Site Generation）',
    tag: '构建时',
    tagClass: 'tag-green',
    href: '/demo/data-fetching/ssg',
    desc: '构建时一次性生成 HTML，之后所有请求都返回同一个文件。速度最快，适合不变的内容。',
    when: '博客文章、文档、营销着陆页',
  },
  {
    name: 'ISR（Incremental Static Regeneration）',
    tag: '定时更新',
    tagClass: 'tag-blue',
    href: '/demo/data-fetching/isr',
    desc: 'SSG 的升级版：构建时生成，但每隔 N 秒自动重新生成。兼顾速度和新鲜度。',
    when: '电商商品列表、新闻首页、社交 feed',
  },
  {
    name: 'Streaming（流式渲染）',
    tag: '渐进式',
    tagClass: 'tag-orange',
    href: '/demo/data-fetching/streaming',
    desc: '页面分块传输，快的先到、慢的后到。用户先看到骨架，再逐步填充内容。',
    when: '有多个独立数据源的复杂页面',
  },
];

export default function DataFetchingPage() {
  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-green">Demo 2</span>
          ⚡ 数据获取 — 四种渲染策略对比
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Next.js 最大的优势之一是提供了多种渲染策略，开发者可以根据页面特点选择最合适的方案。
          这在纯 React（CSR）中是做不到的。
        </p>
      </div>

      <div className="card">
        <h2>🗺️ 策略全景图</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`                    数据何时获取？          HTML 何时生成？        更新频率
                    ─────────────          ─────────────        ────────
  SSG              构建时                  构建时                不更新（或手动重新构建）
  ISR              构建时 + 定时重新构建    构建时 + 定时重新生成  每 N 秒
  SSR              每次请求时              每次请求时            实时
  Streaming        每次请求时（分块）       每次请求时（渐进）    实时

  ┌──────────────────────────────────────────────────────────────┐
  │                                                              │
  │  速度最快 ←─────────────────────────────────→ 数据最新鲜     │
  │                                                              │
  │    SSG        ISR           Streaming       SSR              │
  │    (静态)    (半静态)        (流式)         (动态)            │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘`}
        </pre>
      </div>

      <div className="card">
        <h2>🧪 选择指南</h2>
        <table style={{ marginTop: '0.8rem' }}>
          <thead>
            <tr>
              <th>你的情况</th>
              <th>推荐策略</th>
              <th>原因</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>内容几乎不变（文档、博客）</td><td style={{ color: '#2d7a2d' }}><strong>SSG</strong></td><td>构建一次，永久可用，速度最快</td></tr>
            <tr><td>内容偶尔变化（商品列表）</td><td style={{ color: '#2563eb' }}><strong>ISR</strong></td><td>自动更新，不需要重新部署</td></tr>
            <tr><td>内容实时变化（仪表盘）</td><td style={{ color: '#e74c3c' }}><strong>SSR</strong></td><td>每次都是最新数据</td></tr>
            <tr><td>页面有快有慢的数据源</td><td style={{ color: '#c05621' }}><strong>Streaming</strong></td><td>快的先显示，慢的后加载</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {strategies.map(s => (
          <div key={s.name} className="demo-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <h3 style={{ fontSize: '1rem' }}>{s.name}</h3>
              <span className={`tag ${s.tagClass}`}>{s.tag}</span>
            </div>
            <p>{s.desc}</p>
            <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: '#999' }}>适用场景：{s.when}</p>
            <Link href={s.href} className="link">查看 Demo →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
