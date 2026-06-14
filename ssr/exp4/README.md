# Exp4 — Next.js 定位与用法指南

> 通过 4 个独立 Demo，系统理解 Next.js 是什么、怎么和 React 配合、核心能力如何使用。

## 快速启动

```bash
cd D:\code\frontend\study\react_learn\ssr\exp4
bash run.sh
```

| Demo | URL | 核心概念 |
|------|-----|---------|
| 首页 | http://localhost:3003 | Next.js 定位、与 React 的关系 |
| Demo 1 路由 | http://localhost:3003/demo/routing | 文件系统路由、动态路由、Catch-all |
| Demo 2 数据获取 | http://localhost:3003/demo/data-fetching | SSR / SSG / ISR / Streaming 对比 |
| Demo 3 API | http://localhost:3003/demo/api | Route Handler、全栈开发 |
| Demo 4 Streaming | http://localhost:3003/demo/streaming | 流式渲染（跳转到 Demo 2 子页面） |

## 项目结构

```
exp4/
├── package.json
├── next.config.mjs
├── jsconfig.json
├── run.sh
└── src/
    ├── lib/
    │   └── mock-data.js              ← 共享模拟数据
    └── app/
        ├── layout.js                 ← 根布局（导航栏）
        ├── page.js                   ← 首页：Next.js 定位概述
        ├── globals.css
        ├── demo/
        │   ├── routing/              ← Demo 1: 文件路由
        │   │   ├── page.js           ← 静态路由说明
        │   │   ├── [slug]/page.js    ← 动态路由
        │   │   └── [...all]/page.js  ← Catch-all 路由
        │   ├── data-fetching/        ← Demo 2: 数据获取
        │   │   ├── page.js           ← 策略总览
        │   │   ├── ssr/page.js       ← SSR（force-dynamic）
        │   │   ├── ssg/page.js       ← SSG（默认行为）
        │   │   ├── isr/page.js       ← ISR（revalidate）
        │   │   └── streaming/page.js ← Streaming（Suspense）
        │   ├── api/                  ← Demo 3: API Routes
        │   │   └── page.js           ← 交互式 API 测试界面
        │   └── streaming/
        │       └── page.js           ← 重定向到 streaming 子页面
        └── api/                      ← Route Handlers（后端）
            ├── hello/route.js        ← GET /api/hello
            └── products/route.js     ← GET/POST /api/products
```

---

## Next.js 的一句话定位

> **Next.js 是一个基于 React 的全栈 Web 框架。**

它不是 React 的替代品，而是在 React 之上补全了路由、数据获取、部署等能力。

```
裸 React（Vite/CRA）          Next.js
──────────────────          ──────────
只用 React 核心层             React 核心层 + 框架层
路由自己配（react-router）     文件系统自动路由
SSR 自己搭（Express）         内置 SSR/SSG/ISR
API 自己起（Express）         内置 API Routes
部署自己配（nginx）           内置部署方案
```

## React vs Next.js 的职责划分

| 职责 | React | Next.js |
|------|-------|---------|
| 组件模型 | ✅ 定义 | 使用 |
| JSX / Hooks | ✅ 定义 | 使用 |
| 状态管理 | ✅ useState/useContext | 使用 |
| 路由 | ❌ 不提供 | ✅ 文件系统路由 |
| SSR | ❌ 只提供 renderToString 工具 | ✅ 完整 SSR 方案 |
| 数据获取 | ❌ 不提供 | ✅ Server Components + async/await |
| API 后端 | ❌ 不提供 | ✅ Route Handlers |
| 构建优化 | ❌ 不提供 | ✅ 自动代码分割、图片优化 |
| 部署 | ❌ 不提供 | ✅ Vercel / standalone |

## 四种渲染策略速查

| 策略 | 配置方式 | 数据获取时机 | HTML 生成时机 | 适用场景 |
|------|---------|-------------|-------------|---------|
| **SSG** | 默认（无需配置） | 构建时 | 构建时 | 博客、文档、不变内容 |
| **ISR** | `export const revalidate = N` | 构建时 + 每 N 秒 | 构建时 + 每 N 秒 | 商品列表、新闻首页 |
| **SSR** | `export const dynamic = 'force-dynamic'` | 每次请求 | 每次请求 | 仪表盘、个性化内容 |
| **Streaming** | `<Suspense>` + async 组件 | 每次请求（分块） | 每次请求（渐进） | 多数据源复杂页面 |

---

## 渲染策略的判定逻辑 — Next.js 怎么决定用 SSG 还是 SSR

### 核心原则

> **默认就是 SSG。只有当你显式声明或使用了动态 API，Next.js 才会升级为 SSR/ISR。**

这不是你手动选择 "我要用 SSR"，而是 Next.js 在**构建时静态分析**你的代码，自动判断每个页面该用哪种策略。

### 判定决策树

```
Next.js 分析 page.js（构建时）
        │
        ↓
┌─ 这个页面有 "use client" 吗？──────────────────────────┐
│  有 → Client Component，跳过服务端数据获取              │
│       → CSR（客户端渲染）                               │
│                                                         │
│  没有 → Server Component，继续判断 ↓                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─ 检查是否使用了 "动态 API" ─────────────────────────────┐
│                                                         │
│  ① export const dynamic = 'force-dynamic' ？            │
│     有 → 强制 SSR ✅                                    │
│                                                         │
│  ② 使用了 cookies() 或 headers() ？                    │
│     有 → 强制 SSR ✅（这些 API 依赖请求上下文）         │
│                                                         │
│  ③ 使用了 noStore() ？                                  │
│     有 → 强制 SSR ✅（显式关闭缓存）                    │
│                                                         │
│  ④ searchParams 作为 props 传入 ？                      │
│     有 → 强制 SSR ✅（URL 参数每次不同）                │
│                                                         │
│  ⑤ 以上都没有 → 检查是否有 revalidate ↓                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ↓
┌─ 检查是否配置了 revalidate ─────────────────────────────┐
│                                                         │
│  ⑥ export const revalidate = N ？                       │
│     有 → ISR（每 N 秒重新生成） ✅                      │
│                                                         │
│  ⑦ fetch(..., { next: { revalidate: N } }) ？           │
│     有 → 该 fetch 触发 ISR ✅（页面级 + fetch 级）      │
│                                                         │
│  ⑧ 以上都没有 → SSG（默认） ✅                          │
└─────────────────────────────────────────────────────────┘
```

### 一张图看懂：什么触发什么

```
┌──────────────────────────────────────────────────────────────┐
│                    触发条件 → 渲染策略                        │
│                                                              │
│  默认（无任何标记）          →  SSG（静态）                   │
│                                                              │
│  export const dynamic =      ┐                               │
│    'force-dynamic'           │                               │
│  使用 cookies() / headers()  ├──→  SSR（每次请求）            │
│  使用 noStore()              │                               │
│  searchParams 作为 props     ┘                               │
│                                                              │
│  export const revalidate = N  ┐                              │
│  fetch(..., { revalidate })   ├──→  ISR（定时重新生成）       │
│  revalidateTag('tag')         ┘                              │
│                                                              │
│  <Suspense> + async 组件     →  Streaming（流式 SSR）        │
└──────────────────────────────────────────────────────────────┘
```

### 本项目中的实际判定

```bash
npm run build  # 观察构建输出中的 ○ 和 ƒ 标记
```

```
Route (app)                              标记    实际策略    为什么
─────────────────────────────────────────────────────────────────────
┌ ○ /                                     ○     SSG        默认行为，无动态 API
┌ ƒ /api/hello                            ƒ     Dynamic    API Route（天然动态）
┌ ○ /demo/routing                         ○     SSG        无动态 API
┌ ƒ /demo/routing/[slug]                  ƒ     Dynamic    动态路由参数
┌ ƒ /demo/routing/[...all]                ƒ     Dynamic    Catch-all 参数
┌ ○ /demo/data-fetching/ssg               ○     SSG        无动态 API
┌ ƒ /demo/data-fetching/ssr               ƒ     Dynamic    force-dynamic 显式声明
┌ ○ /demo/data-fetching/isr               ○     ISR        revalidate = 10
└ ○ /demo/data-fetching/streaming         ○     SSG        Suspense 不改变渲染策略

○ = Static（构建时生成）    ƒ = Dynamic（请求时生成）
```

### 触发 SSR 的具体代码对照

```js
// ❌ 触发 SSR：export const dynamic
export const dynamic = 'force-dynamic';
export default async function Page() { ... }

// ❌ 触发 SSR：使用 cookies()
import { cookies } from 'next/headers';
export default async function Page() {
  const token = cookies().get('auth');  // 依赖请求上下文
  return <div>{token ? '已登录' : '未登录'}</div>;
}

// ❌ 触发 SSR：使用 headers()
import { headers } from 'next/headers';
export default async function Page() {
  const ua = headers().get('user-agent');  // 依赖请求头
  return <div>浏览器：{ua}</div>;
}

// ❌ 触发 SSR：使用 noStore()
import { noStore } from 'next/cache';
export default async function Page() {
  noStore();  // 显式关闭缓存
  const data = await fetch('https://api.com/data');
  return <div>...</div>;
}

// ❌ 触发 SSR：searchParams 作为 props
export default async function Page({ searchParams }) {
  const { q } = await searchParams;  // URL 参数每次不同
  return <div>搜索：{q}</div>;
}
```

### 触发 ISR 的具体代码对照

```js
// ✅ ISR：按时间重新验证
export const revalidate = 60;  // 每 60 秒
export default async function Page() { ... }

// ✅ ISR：按 fetch 级别重新验证
async function getProducts() {
  const res = await fetch('https://api.com/products', {
    next: { revalidate: 30 },  // 这个 fetch 每 30 秒重新执行
  });
  return res.json();
}
export default async function Page() {
  const products = await getProducts();
  return <div>...</div>;
}
```

### 多个标记同时存在时的优先级

```
优先级从高到低：

  force-dynamic  >  revalidate  >  默认 SSG

  如果同时设置了 dynamic = 'force-dynamic' 和 revalidate = 60：
  → dynamic 优先，页面变成 SSR
  （revalidate 在 SSR 模式下无效）
```

---

## SSG 详解 — Static Site Generation（静态站点生成）

### 是什么

SSG 在 `next build`（构建阶段）执行所有 Server Component 中的数据获取逻辑，生成纯静态 HTML 文件。之后每一次用户请求都直接返回这个 HTML，**不需要运行任何 JavaScript 或访问数据库**。

### 工作原理

```
next build（构建阶段）
        │
        ↓
┌──────────────────────────────────────────────────────┐
│  Next.js 扫描所有页面组件                              │
│                                                       │
│  发现 page.js 是 Server Component（无 "use client"）  │
│  且没有 dynamic/force-dynamic 标记                    │
│  → 判定为 SSG 页面                                    │
│                                                       │
│  执行 getBuildTimeData()                              │
│  → 返回 { buildTime: "2026-06-14T09:00:00Z", ... }  │
│                                                       │
│  调用 renderToString(<SSGPage data={...} />)          │
│  → 生成 HTML 字符串                                   │
│                                                       │
│  写入 .next/server/app/demo/data-fetching/ssg.html   │
│  → 一个静态文件，永久有效                               │
└──────────────────────────────────────────────────────┘

用户请求 /demo/data-fetching/ssg
        │
        ↓
┌──────────────────────────────────────────────────────┐
│  服务器直接返回 ssg.html（不需要 Node.js 执行代码）    │
│  TTFB 极短（通常 < 50ms）                              │
└──────────────────────────────────────────────────────┘
```

### 代码示例

```js
// app/blog/[slug]/page.js
// 这个页面默认就是 SSG — 不需要任何特殊配置

import { getAllPosts, getPostBySlug } from '@/lib/blog';

// 可选：告诉 Next.js 预生成哪些 slug
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
  // 返回 [{ slug: "hello" }, { slug: "nextjs-guide" }, ...]
  // Next.js 会为每个 slug 生成一个独立的 HTML 文件
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);  // 只在构建时执行
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

构建后生成的文件：
```
.next/server/app/blog/hello.html       ← /blog/hello 的静态 HTML
.next/server/app/blog/nextjs-guide.html ← /blog/nextjs-guide 的静态 HTML
```

### 验证方法

```bash
npm run build

# 构建输出中看到 ○ 标记 = SSG
# ┌ ○ /blog/hello              ← ○ = Static (SSG)
# ┌ ○ /blog/nextjs-guide       ← ○ = Static (SSG)

npm start
# 刷新页面：数据不变（因为是构建时生成的静态文件）
# 修改代码后再次 npm run build：数据才会更新
```

### 优缺点

| 维度 | 评价 |
|------|------|
| **速度** | ⚡⚡⚡ 极快，直接返回静态文件 |
| **安全性** | ⚡⚡⚡ 没有服务端代码执行，无攻击面 |
| **CDN** | ⚡⚡⚡ 静态文件天然适合全球 CDN 缓存 |
| **服务器成本** | ⚡⚡⚡ 几乎为零（可以部署到纯静态托管） |
| **SEO** | ⚡⚡⚡ 搜索引擎拿到完整 HTML |
| **数据新鲜度** | ❌ 构建后就不变了，更新需要重新构建 |
| **适用范围** | ⚠️ 只适合内容不变或很少变的页面 |

### 适用场景

- 博客文章（写完就不改了）
- 文档站（如 Next.js 官方文档）
- 营销着陆页（改版频率低）
- 个人作品集
- 帮助中心 / FAQ

---

## ISR 详解 — Incremental Static Regeneration（增量静态再生）

### 是什么

ISR = SSG + 定时自动重建。构建时生成静态 HTML，但每隔 N 秒自动在后台重新生成一次。用户在 revalidate 间隔内访问拿到的是缓存的旧页面，间隔过后下一次访问触发后台重建，重建完成后新用户看到新页面。

**ISR 的核心思想：你不需要为了数据更新而重新部署，也不需要为了性能而放弃数据新鲜度。**

### 工作原理

```
时间线 ──────────────────────────────────────────────────────────→

next build (t=0)
  │
  ↓ 生成 HTML_v1（包含 { random: 0.1234 }）
  │
  ├── 用户A 请求 (t=5s)  → 返回 HTML_v1（缓存命中，< 50ms）
  ├── 用户B 请求 (t=8s)  → 返回 HTML_v1（缓存命中）
  │
  ├── t=10s → revalidate 到期，触发后台重建
  │   └── 后台执行 getProductData() → { random: 0.5678 }
  │   └── 生成 HTML_v2
  │
  ├── 用户C 请求 (t=9s)   → 返回 HTML_v1（重建还没完成，用旧的）
  ├── 用户D 请求 (t=11s)  → 返回 HTML_v1（重建中，继续用旧的）
  ├── 用户E 请求 (t=12s)  → 返回 HTML_v2（重建完成，新页面生效）✅
  │
  ├── 用户F 请求 (t=15s)  → 返回 HTML_v2（缓存命中）
  │
  └── ... 直到下一个 revalidate 周期
```

### 关键机制：Stale-While-Revalidate

```
┌──────────────────────────────────────────────────────────────┐
│                    ISR 缓存策略                               │
│                                                              │
│  ┌─ revalidate = 10s ──────────────────────────────────┐    │
│  │                                                      │    │
│  │  t=0s     t=10s    t=12s              t=20s          │    │
│  │  │         │        │                  │              │    │
│  │  ├─Fresh───┤        │                  │              │    │
│  │  │返回缓存 │        │                  │              │    │
│  │  │(快速)   ├──Stale─┤                  │              │    │
│  │  │         │返回缓存│  重建完成         │              │    │
│  │  │         │(快速)  │  下次用新缓存     │              │    │
│  │  │         │        │                  │              │    │
│  └──┴─────────┴────────┴──────────────────┴──────────────┘    │
│                                                              │
│  Fresh = 缓存新鲜期，直接返回缓存                              │
│  Stale = 缓存过期但仍可用，返回旧缓存的同时后台触发重建          │
│  重建完成 → 替换缓存 → 下次请求拿到新页面                       │
└──────────────────────────────────────────────────────────────┘
```

### 代码示例

```js
// app/products/page.js

// 方式 1：按时间重新验证（每 60 秒）
export const revalidate = 60;

async function getProducts() {
  const res = await fetch('https://api.store.com/products');
  return await res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  // 构建时执行一次，之后每 60 秒执行一次
  return products.map(p => <ProductCard key={p.id} product={p} />);
}
```

```js
// 方式 2：按页面级别配置（不同页面不同更新频率）

// app/products/page.js    → 每 60 秒
export const revalidate = 60;

// app/news/page.js        → 每 30 秒（新闻更新更快）
export const revalidate = 30;

// app/docs/guide/page.js  → 永不更新（等同 SSG）
export const revalidate = false;
```

```js
// 方式 3：按时间段重新验证（路径级配置）
// next.config.mjs
const nextConfig = {
  experimental: {
    // /products 下所有页面每 60 秒重新验证
    // /blog 下所有页面每 3600 秒重新验证
    revalidateRoutes: [
      { source: '/products/:path*', revalidate: 60 },
      { source: '/blog/:path*', revalidate: 3600 },
    ],
  },
};
```

### On-Demand Revalidation（按需重新验证）

除了定时重新验证，还可以在数据变化时**主动触发**重新生成：

```js
// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// 方式 1：按路径重新验证
export async function POST(request) {
  const { path } = await request.json();
  revalidatePath(path);  // 例：revalidatePath('/products')
  return NextResponse.json({ revalidated: true, path });
}

// 方式 2：按 Tag 重新验证（更精确）
export async function POST(request) {
  const { tag } = await request.json();
  revalidateTag(tag);  // 例：revalidateTag('products')
  return NextResponse.json({ revalidated: true, tag });
}
```

```js
// 配合 fetch 的 cache + tag 使用
async function getProducts() {
  const res = await fetch('https://api.store.com/products', {
    next: {
      revalidate: 60,      // 定时：60 秒
      tags: ['products'],   // 标签：用于按需触发
    },
  });
  return await res.json();
}

// 当管理员修改了商品数据后：
// POST /api/revalidate { "path": "/products" }
// 或
// POST /api/revalidate { "tag": "products" }
// → 对应页面立即重新生成
```

### 验证方法

```bash
npm run build

# 构建输出中看到 ○ + Revalidate = ISR
# ┌ ○ /products         1.19 kB    106 kB    10s    1y
#                                  ↑          ↑      ↑
#                                  │          │      └── 过期时间
#                                  │          └── 每 10 秒重新验证
#                                  └── First Load JS

npm start
# 刷新页面：前 10 秒数据不变
# 等 10 秒后再刷新：数据更新了
```

### 优缺点

| 维度 | 评价 |
|------|------|
| **速度** | ⚡⚡⚡ 缓存命中时和 SSG 一样快 |
| **数据新鲜度** | ⚡⚡ 每 N 秒更新一次，不是实时但够用 |
| **服务器负载** | ⚡⚡⚡ 极低（只在后台重建时消耗资源） |
| **灵活性** | ⚡⚡ 可按页面、按路径、按 Tag 不同频率 |
| **部署复杂度** | ⚡⚡ 需要支持 ISR 的平台（Vercel / 自建 Node.js） |
| **实时性** | ⚠️ 不适合需要秒级更新的场景 |
| **成本** | ⚠️ 后台重建消耗计算资源（但远低于 SSR） |

### 适用场景

- 电商商品列表（价格/库存每分钟更新即可）
- 新闻首页（文章每 30 秒更新）
- 社交媒体 Feed（内容分钟级更新）
- 产品目录（定时同步数据库）
- 数据仪表盘（非实时，分钟级更新）

### SSG vs ISR 选型指南

```
你的页面内容变化频率是？
        │
        ├── 几乎不变（博客、文档）     → SSG
        │                              不需要配置 revalidate
        │
        ├── 偶尔变化（商品列表）       → ISR
        │                              export const revalidate = 60
        │
        ├── 经常变化（新闻 feed）       → ISR（短间隔）
        │                              export const revalidate = 30
        │
        └── 实时变化（股票、聊天）     → SSR
                                   export const dynamic = 'force-dynamic'
```

### ISR 与缓存平台的关系

```
┌────────────────────────────────────────────────────────────┐
│  ISR 需要一个持久化缓存来存储生成的 HTML                    │
│                                                            │
│  Vercel（官方平台）：                                       │
│  ├── 自带 Data Cache，ISR 开箱即用                         │
│  ├── 每个页面自动缓存到边缘节点                              │
│  └── revalidate 配置直接生效                                │
│                                                            │
│  自建部署（Node.js / Docker）：                             │
│  ├── Next.js 内存缓存（进程内，重启丢失）                    │
│  ├── 可配置 Redis / 文件系统作为外部缓存                     │
│  └── 需要额外配置 next.config.mjs 的 cacheHandler          │
│                                                            │
│  static export（next export）：                             │
│  ├── 不支持 ISR（纯静态文件没有运行时）                      │
│  └── 只能用 SSG                                            │
└────────────────────────────────────────────────────────────┘
```

---

## API Routes vs 传统后端

```
传统前后端分离：                  Next.js 全栈：

  前端 (Vite)                     一个项目
  ├── src/                        ├── app/
  │   └── components/             │   ├── page.js        ← 页面
  └── package.json                │   ├── components/    ← 组件
      react, react-dom            │   └── api/           ← 后端
                                   │       └── route.js
  后端 (Express)                  └── package.json
  ├── routes/                         next, react, react-dom
  │   └── products.js
  └── package.json                前后端同一个项目、同一个仓库、同一个部署
      express, cors
```

## 文件路由 vs react-router

| | react-router | Next.js 文件路由 |
|---|---|---|
| 路由定义 | `<Route path="/users/:id" />` | `app/users/[id]/page.js` |
| 新增路由 | 手动加一行配置 | 创建一个文件 |
| 删除路由 | 手动删一行配置 | 删除文件 |
| 代码分割 | 需配置 React.lazy | 按路由自动分割 |
| 嵌套路由 | 需嵌套 `<Route>` | 嵌套目录 |
| 404 | 需配置 `*` 路由 | `not-found.js`（约定） |
| 加载状态 | 手动实现 | `loading.js`（约定） |
| 错误处理 | 手动 ErrorBoundary | `error.js`（约定） |

## 与 exp1/exp2/exp3 的递进关系

| 实验 | 学到了什么 | 下一步 |
|------|-----------|--------|
| **exp1** | SSR 的最小结构 | → 想知道完整流程 |
| **exp2** | 手动实现 renderToString → hydrateRoot | → 想知道框架怎么封装的 |
| **exp3** | Next.js 的 Server/Client Components | → 想知道更多框架能力 |
| **exp4** | Next.js 全景：路由、数据获取、API、Streaming | → 可以开始实际项目了 |

## 进一步学习

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev)
- [Next.js Learn 教程](https://nextjs.org/learn)
