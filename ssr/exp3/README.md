# Exp3 — Next.js App Router SSR

基于 Next.js 15 App Router + React Server Components (RSC) 的完整 SSR 示例。

## 快速启动

```bash
cd D:\code\frontend\study\react_learn\ssr\exp3
bash run.sh
```

或分步执行：

```bash
npm install
npm run dev
```

| 页面 | URL | 说明 |
|------|-----|------|
| 首页 | http://localhost:3002 | SSR 概念介绍、导航入口 |
| 商品列表 | http://localhost:3002/products | Server Component 数据获取 |
| 商品详情 | http://localhost:3002/products/1 | 动态路由 + Server/Client 组件组合 |
| 购物车 | http://localhost:3002/cart | Server Action 数据写入 |
| 交互演示 | http://localhost:3002/demo | Server + Client 混合渲染对比 |

## 项目结构

```
exp3/
├── package.json
├── next.config.mjs
├── run.sh                          ← 一键启动
├── src/
│   ├── lib/
│   │   └── mock-data.js            ← 模拟数据库（Server Component 读取）
│   ├── components/                 ← 可复用 Client Components
│   │   ├── AddToCartButton.js      ← Client Component ('use client')
│   │   ├── ConditionalProductList.js ← SSR/CSR 切换商品列表
│   │   └── ProductDetailClient.js  ← CSR 模式商品详情
│   └── app/
│       ├── layout.js               ← 根布局（Server Component）
│       ├── page.js                 ← 首页 "/"
│       ├── globals.css             ← 全局样式
│       ├── not-found.js            ← 自定义 404 页面
│       ├── products/
│       │   ├── page.js             ← "/products" 商品列表（Server Component）
│       │   └── [id]/
│       │       └── page.js         ← "/products/:id" 动态路由 + 组合 Client Component
│       ├── cart/
│       │   ├── page.js             ← "/cart" Server Component + 初始数据
│       │   └── CartClient.js       ← Client Component（交互逻辑）
│       ├── actions/
│       │   ├── cart.js             ← Server Action ('use server')
│       │   └── products.js        ← Server Action（商品数据获取）
│       └── demo/
│           ├── page.js             ← "/demo" Server Component 主页面
│           ├── CounterButton.js    ← Client Component（计数器）
│           └── TodoList.js         ← Client Component（待办列表）
```

## 核心概念

### 1. Server Component（默认）

文件中的 React 组件**默认是 Server Component**，直接在 Node.js 中执行：

```js
// products/page.js — 这是 Server Component
export default async function ProductsPage() {
  // ✅ 直接 await，支持 async/await
  const products = await getAllProducts();

  return (
    <div>
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

- 代码**不发送到浏览器**（SEO 友好、安全性高）
- 可以直接访问数据库、文件系统、环境变量
- 不能用 `useState`、`useEffect` 等客户端 hooks

### 2. Client Component（`'use client'`）

在文件顶部添加 `'use client'` 指令：

```js
// AddToCartButton.js — Client Component
'use client';

import { useState } from 'react';

export default function AddToCartButton() {
  const [count, setCount] = useState(0);  // ✅ 可以用 hooks
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

- 代码会**打包发送到浏览器**
- 可以用 `useState`、`useEffect`、事件处理器等
- 用于需要用户交互的部分

### 3. Server Action（`'use server'`）

在函数上方添加 `'use server'` 指令：

```js
// actions/cart.js — Server Action
'use server';

export async function addToCart(productId) {
  // ✅ 在服务端执行，可以直接访问数据库
  await db.cart.create({ data: { productId } });
}
```

- Client Component 可以**直接调用**，无需手动写 `fetch('/api/...')`
- 框架自动处理序列化、错误处理

### 4. 组件组合规则

```
Server Component
├── 可以导入 → Server Component ✅
└── 可以导入 → Client Component ✅

Client Component
├── 不能导入 → Server Component ❌
└── 可以导入 → Client Component ✅
```

## 与 exp1/exp2 对比

| 痛点 | exp1/exp2（手动） | exp3（Next.js） |
|------|-------------------|-----------------|
| 数据获取 | 手动 fetch，手动传组件 | `async/await` 直接获取 |
| 组件分类 | 手动决定哪些发到客户端 | `"use client"` 一行标记 |
| API 路由 | 手动写 Express 路由 | Server Action 自动处理 |
| 代码分割 | 手动配置 esbuild externals | 框架自动处理 |
| 路由 | 手动配置 Express 路由 | 文件系统自动路由 |
| Hydration | 手动 `hydrateRoot` | 框架自动处理 |
| 样式 | 手动写 `<style>` | CSS Modules / 全局 CSS / Tailwind |

## 生产构建

```bash
npm run build    # 构建生产版本
npm start        # 启动生产服务器
```

---

## 服务端渲染全流程（以 `/products/1` 为例）

### 第一阶段：请求到达 → 路由匹配

```
浏览器 GET /products/1
        │
        ↓
┌─────────────────────────────────────────────────────────────┐
│  Next.js 内置 HTTP Server（基于 Node.js http 模块）          │
│  自动启动，不用你写 app.listen()                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  文件系统路由匹配                                            │
│                                                              │
│  /products/1  →  扫描 src/app/ 目录：                       │
│    src/app/products/page.js       ← 匹配 /products          │
│    src/app/products/[id]/page.js  ← 匹配 /products/:id  ✅  │
│                                                              │
│  [id] 是动态段，id = "1"                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
```

### 第二阶段：Server Component 执行

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 找到 src/app/products/[id]/page.js                 │
│  检查：没有 "use client" → 这是 Server Component             │
│  检查：export default async function → 支持异步               │
│                                                              │
│  执行：                                                      │
│    1. const { id } = await params    → id = "1"             │
│    2. const product = await getProductById("1")              │
│       → 模拟数据库查询，返回 { id:1, name:"React 实战教程" }  │
│    3. product 存在 → 不走 notFound()                         │
│    4. return (<div>...</div>)  → 生成 React 虚拟 DOM         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
```

### 第三阶段：组件树合并渲染

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 渲染完整组件树：                                     │
│                                                              │
│  layout.js  ← 所有页面共享的外壳（<html> + <nav> + <main>） │
│    └── children = products/[id]/page.js  ← 上面返回的内容   │
│                                                              │
│  page.js 导入了 AddToCartButton（"use client"），            │
│  但 Server Component 可以导入 Client Component ✅             │
│  AddToCartButton 在服务端的 role：渲染初始 HTML 占位          │
│  （<button>🛒 Add to Cart</button>），不绑定事件              │
│                                                              │
│  整个组件树变成一个 React 虚拟 DOM                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
```

### 第四阶段：renderToString → HTML

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 内部调用 React 的 renderToString()                  │
│  把虚拟 DOM 转成 HTML 字符串                                 │
│                                                              │
│  同时：                                                      │
│  - 提取 CSS → 生成 /_next/static/css/xxx.css                │
│  - 收集 metadata → 生成 <title>、<meta> 标签                │
│  - 标记 Client Component 边界 → 需要客户端 JS 的位置          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
```

### 第五阶段：拼接完整 HTML 响应

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 自动拼接（对比 exp2 需要你手写整个 <html> 模板）：    │
│                                                              │
│  <!DOCTYPE html>               ← 框架自动添加               │
│  <html lang="zh-CN">          ← layout.js 中定义           │
│    <head>                                                 │
│      <title>商品详情</title>    ← metadata 自动生成        │
│      <link rel="stylesheet"    ← 框架自动注入 CSS          │
│        href="/_next/static/css/xxx.css">                  │
│      <script src="/_next/static/chunks/webpack.js">       │
│      ...（框架自动注入的 JS chunks）                        │
│    </head>
│    <body>                                                 │
│      <div class="layout">      ← layout.js 渲染的 HTML    │
│        <nav>...导航栏...</nav>                              │
│        <main>                                             │
│          <!-- RSC Payload：React Server Component 的序列化 -->│
│          <div class="card product-detail">                │
│            <h1>React 实战教程</h1>                          │
│            <p class="price">¥79.9</p>                     │
│            <button>🛒 Add to Cart</button>                 │
│          </div>
│        </main>
│      </div>
│    </body>
│  </html>
│
│  res.send(html)  → 返回给浏览器                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 客户端加载全流程（浏览器收到 HTML 后）

### 第六阶段：浏览器解析 HTML → 显示页面

```
浏览器收到完整 HTML
        │
        ↓
┌─────────────────────────────────────────────────────────────┐
│  浏览器解析 HTML DOM 树                                      │
│                                                              │
│  1. 遇到 <link rel="stylesheet"> → 下载 CSS                 │
│  2. 遇到 <script src="/_next/..."> → 预加载 JS chunks       │
│  3. DOM 树构建完成 → 渲染页面                                │
│                                                              │
│  ✅ 用户看到完整内容（"React 实战教程"、¥79.9、按钮）         │
│  ⏳ JS 还没执行 → 按钮点击无反应                              │
│                                                              │
│  （对比 exp2：同样先看到静态 HTML，等 JS 加载）              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
```

### 第七阶段：JavaScript 加载 + Hydration

```
┌─────────────────────────────────────────────────────────────┐
│  浏览器执行 Next.js 注入的 JS bundles                        │
│                                                              │
│  1. React 初始化（next/react、react-dom）                    │
│     → 不像 exp2 要 CDN 手动引入，Next.js 自动处理            │
│                                                              │
│  2. hydrateRoot(container)                                  │
│     → 框架内部自动调用，你不用写这行代码                     │
│     → 和 exp2 的 hydrateRoot(container, <App/>) 相同原理     │
│                                                              │
│  3. React 对比已有 DOM + RSC Payload（React 19 流式协议）    │
│     → 发现 Server Component 部分匹配 → 不修改 DOM            │
│     → 发现 Client Component（AddToCartButton）→ 绑定 onClick │
│                                                              │
│  4. 页面变成可交互的 SPA                                      │
│     → 点击 "🛒 Add to Cart" → 调用 Server Action             │
└─────────────────────────────────────────────────────────────┘
```

---

## 客户端导航流程（点击 `<Link>` 从 /products 跳到 /products/1）

这是 SSR 后的**客户端路由**，区别于首次加载的服务端渲染。

```
用户点击 <Link href="/products/1">
        │
        ↓
┌─────────────────────────────────────────────────────────────┐
│  第 1 步：Next.js Router 拦截（client-side navigation）       │
│                                                              │
│  <Link> 不是普通的 <a>，Next.js 在客户端拦截 click 事件       │
│  阻止浏览器整页刷新（和 exp2 的 <a href> 不同）              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  第 2 步：获取 RSC Payload（服务端 → 客户端）                 │
│                                                              │
│  浏览器发 fetch 请求：                                       │
│    GET /products/1  +  头部 RSC: 1, Next-Router-State-Tree   │
│                                                              │
│  Next.js 服务端收到请求后：                                  │
│    1. 执行 src/app/products/[id]/page.js（Server Component） │
│    2. getProductById("1") → { id:1, name:"React 实战教程" }  │
│    3. 不返回完整 HTML → 返回 RSC Payload（序列化的组件树）   │
│                                                              │
│  RSC Payload ≠ HTML，是一个紧凑的 JSON 描述                  │
│  只包含 Server Component 的输出 + Client Component 的引用    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  第 3 步：React 更新虚拟 DOM                                 │
│                                                              │
│  React 收到 RSC Payload → 重建 Server Component 虚拟 DOM     │
│  和当前页面的虚拟 DOM 做 diff                                │
│  只更新变化的部分（product-detail 区域），导航栏不动          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  第 4 步：浏览器 URL 更新 + DOM 更新                         │
│                                                              │
│  - URL 变为 /products/1（History API，不刷新页面）            │
│  - DOM 更新：商品列表替换为商品详情                          │
│  - 浏览器 history.pushState()                                │
│  - ✅ 整个过程无白屏、无整页刷新                            │
└─────────────────────────────────────────────────────────────┘
```

### 关键区别：exp2 vs exp3 客户端导航

```
exp2（手动 SSR）：
  <a href="/products/1">   →  浏览器整页刷新 → 重新请求完整 HTML
                                → 重新渲染所有内容

exp3（Next.js）：
  <Link href="/products/1"> →  Next.js 拦截 → 只请求 RSC Payload
                                → 增量更新变化的 DOM
```

---

## Server Action 全流程（点击 "🛒 Add to Cart" 按钮）

```
用户点击 AddToCartButton 的 "🛒 Add to Cart"
        │
        ↓
┌─────────────────────────────────────────────────────────────┐
│  第 1 步：Client Component 执行事件处理                      │
│                                                              │
│  // AddToCartButton.js（在浏览器中运行）                     │
│  const handleAdd = () => {                                  │
│    startTransition(async () => {                             │
│      await addToCart(product.id, product.name, product.price);│
│    });                                                      │
│  };                                                         │
│                                                              │
│  addToCart 标记了 "use server"，React 知道要发到服务端       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  第 2 步：自动序列化 + 发送请求                               │
│                                                              │
│  Next.js 自动：                                              │
│  1. 把参数序列化：(1, "React 实战教程", 79.9) → JSON         │
│  2. 发 POST 请求到 Next.js 内置的 Server Action 端点         │
│     POST /products/1  +  头部 Next-Action: <action-id>       │
│                                                              │
│  你不用写 fetch('/api/cart/add')，也不用写 Express 路由     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  第 3 步：服务端执行 Server Action                            │
│                                                              │
│  // actions/cart.js（在 Node.js 中运行）                     │
│  export async function addToCart(id, name, price) {          │
│    await new Promise(r => setTimeout(r, 300)); // 模拟DB写入 │
│    cart.push({ productId: id, ... });                        │
│    return { success: true, message: "Added ..." };          │
│  }                                                          │
│                                                              │
│  这段代码在服务端执行，可以访问数据库、环境变量等            │
│  返回值自动序列化为 JSON                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  第 4 步：响应返回 + UI 更新                                  │
│                                                              │
│  服务端返回：{ success: true, message: "Added ..." }        │
│                                                              │
│  startTransition 结束 → isPending = false → 按钮恢复可点击   │
│                                                              │
│  如果需要刷新 UI（如购物车），在 Client Component 中：        │
│    const updated = await getCart();  // 再调一个 Server Action│
│    setCart(updated);  // 用 React state 更新视图             │
└─────────────────────────────────────────────────────────────┘
```

### 对照：exp2 和 exp3 的数据写入方式

```
exp2（手动 SSR）：
  1. 前端写 fetch('/api/cart/add', { method: 'POST', body: ... })
  2. 服务端写 Express 路由：app.post('/api/cart/add', (req, res) => {...})
  3. 手动处理 JSON 序列化、错误处理、状态刷新

exp3（Server Action）：
  1. 前端直接调 addToCart(id, name, price)    ← 和普通函数一样
  2. "use server" 指令告诉框架：这个函数在服务端执行
  3. 框架自动处理：序列化、传输、执行、响应
```

---

## 完整时序图：用户访问到页面可交互

```
时间轴 ──────────────────────────────────────────────────────────────────→

浏览器                    Next.js Server (Node.js)                数据层
  │                              │                                   │
  │  ─── GET /products/1 ───→   │                                   │
  │                              │  文件路由匹配                      │
  │                              │  [id]/page.js                     │
  │                              │  ─── getProductById(1) ───→       │
  │                              │                                   │
  │                              │  ←── { id:1, name:"React..." } ──│
  │                              │                                   │
  │                              │  renderToString()                 │
  │                              │  + layout.js 外壳                 │
  │                              │  + CSS 提取                       │
  │                              │  + metadata 提取                  │
  │                              │  + RSC Payload 标记               │
  │                              │                                   │
  │  ←── 完整 HTML ──────────   │                                   │
  │                              │                                   │
  │  浏览器解析 HTML             │                                   │
  │  渲染 DOM → 用户看到页面     │                                   │
  │  ⏳ 等待 JS 加载             │                                   │
  │                              │                                   │
  │  加载 React + Next.js runtime│                                   │
  │  hydrateRoot() 自动执行      │                                   │
  │  绑定 Client Component 事件  │                                   │
  │  ✅ 页面可交互               │                                   │
  │                              │                                   │
  │  点击 "🛒 Add to Cart"      │                                   │
  │  ─── POST (Server Action) ─→│                                   │
  │                              │  执行 addToCart()                  │
  │                              │  ─── 写入数据 ──────────────→     │
  │                              │                                   │
  │  ←── { success: true } ───  │                                   │
  │  isPending = false           │                                   │
  │  ✅ 按钮恢复                 │                                   │
  │                              │                                   │
```

---

## 与 exp2 渲染方式的逐层对照

| 层级 | exp2（手动） | exp3（Next.js） |
|------|-------------|----------------|
| **HTTP Server** | `express()` + `app.listen(3001)` | 框架内置，`next start` 自动启动 |
| **路由匹配** | `app.get('/{*path}', handler)` 一个通配路由 | 文件系统：`[id]/page.js` 自动匹配 `/products/:id` |
| **URL 参数** | `req.params.id` 手动取 | `const { id } = await params` 自动传入 |
| **数据获取** | 在路由 handler 里手动 fetch | Server Component 直接 `await` |
| **渲染** | `renderToString(<App/>)` 手动调用 | 框架内部自动调用 |
| **HTML 模板** | 手写 `<html><head><body>` 模板字符串 | `layout.js` 只写内容区，框架补全 |
| **CSS** | `<style>` 内联在模板里 | `import './globals.css'`，框架提取到独立文件 |
| **JS 引入** | `<script src="/client.js">` 手写路径 | 框架自动分包、自动注入 |
| **hydration** | `hydrateRoot(container, <App/>)` 手写 | 框架内部自动调用 |
| **客户端导航** | 无（每次 `<a href>` 整页刷新） | `<Link>` 拦截 → 只请求 RSC Payload → 增量更新 |
| **数据写入** | 手写 `fetch('/api/...')` + Express 路由 | `"use server"` 函数，前端直接调用 |

---

## 如何区分 Next.js SSR 项目 vs 普通 React 项目

### 特征 1：目录结构

```
普通 React 项目（Vite / CRA）：          Next.js SSR 项目：

src/                                    src/
├── App.js                              ├── app/           ← 注意这个目录名
├── main.js                             │   ├── layout.js  ← 根布局
├── components/                         │   ├── page.js    ← 首页
├── pages/  (如果有)                    │   ├── products/
├── index.html                          │   │   ├── page.js
└── package.json                        │   │   └── [id]/
    dependencies:                       │   │       └── page.js  ← 动态路由
      react                             │   └── actions/
      react-dom                         │       └── cart.js     ← Server Action
      vite (或 react-scripts)           ├── components/
                                        │   └── AddToCartButton.js  ← "use client"
                                        ├── lib/
                                        └── package.json
                                            dependencies:
                                              next          ← 关键依赖
                                              react
                                              react-dom
```

### 特征 2：package.json 中的 `next` 依赖

```json
// 普通 React — 没有 next
"dependencies": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}

// Next.js SSR — 有 next
"dependencies": {
  "next": "^15.3.3",      ← 这个就是 Next.js
  "react": "^19.1.0",
  "react-dom": "^19.1.0"
}
```

### 特征 3：启动脚本

```json
// 普通 React
"scripts": {
  "dev": "vite",              ← Vite
  "build": "vite build"
}

// Next.js
"scripts": {
  "dev": "next dev",          ← Next.js
  "build": "next build",
  "start": "next start"       ← 生产服务器（不是 express）
}
```

### 特征 4：`"use client"` 指令

```js
// 普通 React — 没有 "use client"，所有代码都在浏览器运行
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Next.js SSR — 文件顶部的 "use client" 决定了运行位置
'use client';                                    ← 这行标记了客户端边界
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 特征 5：文件名约定

| 文件名 | 含义 | 普通 React |
|--------|------|------------|
| `layout.js` | 根布局，包裹所有页面 | ❌ 无此文件 |
| `page.js` | 路由页面组件 | ❌ 用 `App.js` 手动配置路由 |
| `[id]/page.js` | 动态路由 | ❌ 用 `react-router` 手动配置 |
| `loading.js` | 加载状态 | ❌ 手动用 Suspense |
| `error.js` | 错误边界 | ❌ 手动用 ErrorBoundary |
| `not-found.js` | 404 页面 | ❌ 手动配置 |
| `actions/*.js` | Server Action | ❌ 手写 API 路由 |

---

## 哪些代码在服务端运行，哪些在客户端运行

### 判断规则（一句话）

> **有 `"use client"` 的文件 → 浏览器运行**。其余所有文件 → 服务端运行。

### 本项目中的运行位置

```
src/
├── lib/
│   └── mock-data.js              ← 服务端 ✅ 无 "use client"
├── components/
│   ├── AddToCartButton.js         ← 浏览器 ✅ 有 "use client"
│   ├── ConditionalProductList.js  ← 浏览器 ✅ 有 "use client"
│   └── ProductDetailClient.js     ← 浏览器 ✅ 有 "use client"
└── app/
    ├── layout.js                  ← 服务端 ✅ 无 "use client"
    ├── page.js                    ← 服务端 ✅ 无 "use client"
    ├── not-found.js               ← 服务端 ✅ 无 "use client"
    ├── products/
    │   ├── page.js                ← 服务端 ✅ 无 "use client"
    │   └── [id]/
    │       └── page.js            ← 服务端 ✅ 无 "use client"
    ├── cart/
    │   ├── page.js                ← 服务端 ✅ 无 "use client"
    │   └── CartClient.js          ← 浏览器 ✅ 有 "use client"
    ├── actions/
    │   ├── cart.js                 ← 服务端 ✅ "use server"（只在服务端执行）
    │   └── products.js            ← 服务端 ✅ "use server"（只在服务端执行）
    └── demo/
        ├── page.js                ← 服务端 ✅ 无 "use client"
        ├── CounterButton.js       ← 浏览器 ✅ 有 "use client"
        └── TodoList.js            ← 浏览器 ✅ 有 "use client"
```

### 容易混淆的三种指令

| 指令 | 出现位置 | 运行环境 | 说明 |
|------|---------|---------|------|
| 无指令 | 文件顶部 | **服务端** | 默认就是 Server Component |
| `'use client'` | 文件顶部 | **浏览器** | 整个文件打包发送到客户端 |
| `'use server'` | 函数上方 | **服务端** | 这个函数只在服务端执行，前端调用时自动发 POST 请求 |

```
┌──────────────────────────────────────────────────────┐
│                    Node.js 服务端                      │
│                                                      │
│  layout.js (Server Component)                        │
│    └── page.js (Server Component)                    │
│          ├── 静态 HTML 直接渲染                       │
│          ├── await getProductById() 直接执行          │
│          └── <AddToCartButton />                     │
│                ↓                                     │
│          ┌─────────────────────────────────────┐     │
│          │ 服务端：渲染初始 HTML 占位           │     │
│          │ （<button>Add to Cart</button>）    │     │
│          └─────────────────────────────────────┘     │
│                ↓ 序列化发送到浏览器 ↓                 │
├──────────────────────────────────────────────────────┤
│                    浏览器                             │
│                                                      │
│  AddToCartButton.js (Client Component)               │
│    ├── 捕获 server 渲染的 HTML                        │
│    ├── 绑定 onClick 事件                              │
│    └── 点击 → 调用 addToCart() Server Action          │
│              ↓ POST 到服务端 ↓                        │
│    ←── { success: true } ←──                        │
└──────────────────────────────────────────────────────┘
```

---

## 实战：`disableSSR=1` 参数切换 SSR / CSR

### 原理

通过 URL 参数 `?disableSSR=1` 控制是否跳过服务端数据获取，改为客户端获取：

```
SSR 模式（默认）：                   CSR 模式（disableSSR=1）：

服务端：                              服务端：
  page.js 执行                         page.js 执行
  → getAllProducts()  ← 查数据库       → 读取 searchParams.disableSSR === '1'
  → 返回 HTML（包含商品数据）          → 跳过数据获取，返回空 HTML
                                       
浏览器：                              浏览器：
  看到完整商品列表 ✅                  看到 loading 状态 ⏳
  View Source 有全部数据              View Source 没有商品数据
                                       → useEffect 触发
                                       → 调用 fetchProducts() Server Action
                                       → 服务端查数据库
                                       → 返回数据 → React 更新 DOM
                                       → 看到完整商品列表 ✅
```

### 实现代码

**Server Component 读取 searchParams：**

```js
// src/app/products/page.js
export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const isCSR = params?.disableSSR === '1';

  // 关键：根据模式决定是否在服务端获取数据
  const products = isCSR ? [] : await getAllProducts();

  return (
    <ConditionalProductList
      initialProducts={products}
      mode={isCSR ? 'csr' : 'ssr'}
    />
  );
}
```

**Client Component 根据模式决定是否获取数据：**

```js
// src/components/ConditionalProductList.js
'use client';

export default function ConditionalProductList({ initialProducts, mode }) {
  const [products, setProducts] = useState(initialProducts);

  // CSR 模式：挂载后在客户端通过 Server Action 获取数据
  useEffect(() => {
    if (mode === 'csr' && initialProducts.length === 0) {
      fetchProducts().then(setProducts);  // 调用 Server Action
    }
  }, [mode, initialProducts.length]);

  return (/* 渲染商品列表 */);
}
```

**Server Action 提供数据获取能力：**

```js
// src/app/actions/products.js
'use server';

export async function fetchProducts() {
  return await getAllProducts();  // 在服务端执行，浏览器无法直接调用
}
```

### 验证方法

```bash
# SSR 模式：HTML 中有商品数据
curl http://localhost:3002/products | grep "React 实战教程"
# 输出：React 实战教程 ✅

# CSR 模式：HTML 中没有商品数据
curl http://localhost:3002/products?disableSSR=1 | grep "React 实战教程"
# 输出：（空）— 数据在客户端加载

# 对比 View Source：
# SSR: <h2>React 实战教程</h2> 出现在 HTML 中
# CSR: 只有 <p>⏳ 正在从客户端加载数据...</p>
```

### 数据流向图

```
                    SSR 模式                              CSR 模式
                    ──────                                ──────

                    请求到达                               请求到达
                        │                                     │
                        ↓                                     ↓
               page.js 执行                           page.js 执行
                        │                                     │
                  isCSR = false                         isCSR = true
                        │                                     │
                        ↓                                     ↓
              getAllProducts()                          products = []
              (查数据库)                               (跳过数据库)
                        │                                     │
                        ↓                                     ↓
              products = [5个商品]                      products = []
                        │                                     │
                        ↓                                     ↓
              传给 Client Component                    传给 Client Component
              initialProducts = [5个]                  initialProducts = []
                        │                                     │
                        ↓                                     ↓
              Client Component 渲染                    Client Component 渲染
              从 state 读取 → 直接显示                  初始为空 → loading
                        │                                     │
                        ↓                                     ↓
              ✅ 用户看到商品列表                       useEffect 触发
                                                       → fetchProducts()
                                                       → Server Action → 查数据库
                                                       → setProducts(data)
                                                       → React 重新渲染
                                                       ✅ 用户看到商品列表
```
