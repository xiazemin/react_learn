// src/app/page.js — 首页：Next.js 的定位
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* ====== 一句话定位 ====== */}
      <div className="card">
        <h1>📘 Next.js 的定位与用法</h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Next.js 是一个 <strong>基于 React 的全栈 Web 框架</strong>。
          它不是 React 的替代品，而是在 React 之上补全了路由、数据获取、部署等能力。
        </p>
      </div>

      {/* ====== 核心关系图 ====== */}
      <div className="card">
        <h2>📐 React vs Next.js 的关系</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`┌─────────────────────────────────────────────────────┐
│                    你的应用                          │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │              Next.js 框架层                    │  │
│  │  ┌──────────┬──────────┬──────────┬────────┐  │  │
│  │  │ 文件路由  │ 数据获取  │ API 路由  │ 部署   │  │  │
│  │  │ 动态路由  │ SSR/SSG  │ Middleware│ 优化   │  │  │
│  │  └──────────┴──────────┴──────────┴────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │              React 核心层                      │  │
│  │  ┌──────────┬──────────┬──────────┬────────┐  │  │
│  │  │ 组件模型  │ JSX      │ Hooks    │ 虚拟DOM│  │  │
│  │  │ 状态管理  │ 事件系统  │ Context  │ ...    │  │  │
│  │  └──────────┴──────────┴──────────┴────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  裸 React（Vite/CRA）：只用 React 层，其他自己搞     │
│  Next.js：React 层 + 框架层，开箱即用                │
└─────────────────────────────────────────────────────┘`}
        </pre>
      </div>

      {/* ====== Next.js 补了什么 ====== */}
      <div className="card">
        <h2>🔧 React 不做，Next.js 补了什么</h2>
        <table style={{ marginTop: '0.8rem' }}>
          <thead>
            <tr>
              <th>能力</th>
              <th>裸 React</th>
              <th>Next.js</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['路由', '需装 react-router，手动配置', '文件系统自动路由，零配置'],
              ['SSR', '需手动搭建 Express + renderToString', '内置，一个配置项'],
              ['SSG', '需手动 configure + 构建脚本', '默认行为（Server Component）'],
              ['ISR', '不存在', 'revalidate 配置即可'],
              ['API 路由', '需另起后端服务', 'app/api/ 目录即后端'],
              ['代码分割', '需配置 React.lazy + Suspense', '按路由自动分割'],
              ['图片优化', '需手动处理 lazyload/格式/尺寸', '<Image> 组件自动优化'],
              ['部署', '需配置 nginx/Apache 服务静态文件', 'Vercel 一键，或 standalone 模式'],
              ['TypeScript', '需手动配置 tsconfig', '自动检测，零配置'],
              ['SEO', 'SPA 天然弱项', 'SSR/SSG 天然支持'],
            ].map(([feature, react, nextjs]) => (
              <tr key={feature}>
                <td style={{ fontWeight: 500 }}>{feature}</td>
                <td style={{ color: '#999' }}>{react}</td>
                <td style={{ color: '#2d7a2d' }}>{nextjs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====== 什么时候用 Next.js ====== */}
      <div className="card">
        <h2>🎯 什么时候该用 Next.js</h2>
        <div style={{ marginTop: '0.8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#e8f8e8', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#2d7a2d' }}>✅ 适合用 Next.js</h3>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
              <li>内容型网站（博客、文档、营销页）</li>
              <li>电商首页（需要 SEO + 首屏性能）</li>
              <li>全栈应用（前后端一起）</li>
              <li>需要 SSR/SSG/ISR 的场景</li>
              <li>团队协作（约定优于配置）</li>
            </ul>
          </div>
          <div style={{ background: '#fef3e2', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#c05621' }}>⚠️ 不一定需要 Next.js</h3>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
              <li>纯后台管理系统（无 SEO 需求）</li>
              <li>嵌入式 Widget / 小程序</li>
              <li>已有独立后端 + 微服务架构</li>
              <li>移动端 React Native 项目</li>
              <li>学习 React 本身（用 Vite 更轻量）</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ====== Next.js 核心能力图谱 ====== */}
      <div className="card">
        <h2>🗺️ 本项目 Demo 导航</h2>
        <div className="grid" style={{ marginTop: '0.8rem' }}>
          <div className="demo-card">
            <h3>📁 文件路由</h3>
            <p>文件系统即路由，零配置。支持动态路由、Catch-all、路由组。</p>
            <Link href="/demo/routing" className="link">查看 Demo →</Link>
          </div>
          <div className="demo-card">
            <h3>⚡ 数据获取</h3>
            <p>SSR / SSG / ISR / Streaming 四种模式对比，理解渲染策略选择。</p>
            <Link href="/demo/data-fetching" className="link">查看 Demo →</Link>
          </div>
          <div className="demo-card">
            <h3>🔌 API Routes</h3>
            <p>前端即后端。Route Handler 处理 HTTP 请求，无需独立后端。</p>
            <Link href="/demo/api" className="link">查看 Demo →</Link>
          </div>
          <div className="demo-card">
            <h3>🌊 Streaming</h3>
            <p>Suspense + 流式渲染，渐进式加载，告别白屏等待。</p>
            <Link href="/demo/streaming" className="link">查看 Demo →</Link>
          </div>
        </div>
      </div>

      {/* ====== 与 exp1/exp2/exp3 的关系 ====== */}
      <div className="card">
        <h2>📚 与本项目其他实验的关系</h2>
        <table style={{ marginTop: '0.8rem' }}>
          <thead>
            <tr>
              <th>实验</th>
              <th>定位</th>
              <th>核心价值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>exp1</strong></td>
              <td>基础骨架</td>
              <td>理解 SSR 的最小结构</td>
            </tr>
            <tr>
              <td><strong>exp2</strong></td>
              <td>手动 SSR</td>
              <td>亲手实现 renderToString → hydrateRoot 全链路</td>
            </tr>
            <tr>
              <td><strong>exp3</strong></td>
              <td>Next.js App Router</td>
              <td>Server Components / Client Components / Server Actions</td>
            </tr>
            <tr>
              <td style={{ color: '#4a90d9' }}><strong>exp4 ← 你在这里</strong></td>
              <td>Next.js 框架全景</td>
              <td>定位、路由、数据获取、API、Streaming</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
