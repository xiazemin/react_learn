# React SSR 完整学习笔记

> 基于 exp2 实验项目的 SSR（Server-Side Rendering）原理与实践总结。

---

## 一、项目结构

```
ssr/
├── exp1/                    ← 基础骨架（骨架代码，理解 SSR 结构）
│   ├── server.js            ← Express SSR 服务端
│   ├── package.json
│   ├── run.sh
│   └── dist/                ← 客户端 bundle（构建产物）
│       └── client.js
│
└── exp2/                    ← 完整 SSR 示例（带交互状态）
    ├── server.js            ← Express SSR 服务端
    ├── build.js             ← esbuild 客户端打包脚本
    ├── run.sh               ← 一键启动脚本
    ├── package.json
    ├── src/
    │   ├── App.js           ← React 组件（Server + Client 共享）
    │   └── client.js        ← 客户端 hydration 入口
    └── dist/
        └── client.js        ← 打包后的客户端 bundle
```

---

## 二、核心文件逐个解析

### 2.1 `server.js` — 服务端渲染入口

```js
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('./src/App');

// 关键：renderToString 把 React 组件树 → HTML 字符串
const appHtml = ReactDOMServer.renderToString(React.createElement(App));
```

**做了什么：**
1. 在 Node.js 环境中执行 React 组件
2. 生成完整的 HTML 字符串（包含所有子组件的静态 HTML）
3. 把 HTML 嵌入模板，返回给浏览器

**注意：** `renderToString` 中：
- `useState` 返回初始值（`0`），但不支持后续更新
- `onClick` 等事件处理器**不会**执行，也不会被序列化
- 只是一个**静态快照**

### 2.2 `src/App.js` — React 组件（Server + Client 共享）

```js
function Counter() {
  const [count, setCount] = React.useState(0);
  return React.createElement('div', { className: 'counter' },
    React.createElement('p', { className: 'count' }, `Count: ${count}`),
    React.createElement('button', { onClick: () => setCount(c => c + 1) }, '➕ Plus')
  );
}

function App() {
  return React.createElement('div', { className: 'app' },
    React.createElement(Counter, null),
    React.createElement(TodoList, null)
  );
}
```

**同一份代码在两个环境运行：**

| 环境 | 运行方式 | 执行内容 |
|------|---------|---------|
| **服务端** (Node.js) | `require('./src/App')` | `renderToString` 生成静态 HTML |
| **客户端** (浏览器) | esbuild 打包 | `hydrateRoot` 接管 DOM，绑定事件 |

### 2.3 `src/client.js` — 客户端 hydration 入口

```js
const { hydrateRoot } = require('react-dom/client');
const App = require('./App');

const container = document.getElementById('root');
hydrateRoot(container, React.createElement(App));
```

这是整个 SSR 的"第二阶段"——客户端接管。

### 2.4 `build.js` — esbuild 打包客户端代码

```js
esbuild.build({
  entryPoints: ['src/client.js'],       // 入口
  bundle: true,
  outfile: 'dist/client.js',            // 输出
  format: 'iife',                       // 立即执行函数，浏览器直接运行
  external: ['react', 'react-dom'],     // React 走 CDN，不打进 bundle
});
```

**为什么要 external React？**
- 服务端通过 CDN `<script>` 加载 React
- 客户端的 bundle 不包含 React 代码，通过 CDN 共享同一份
- 确保服务端和客户端使用**同一个 React 实例**，避免 hydration mismatch

---

## 三、SSR 完整流程

```
┌──────────────────────────────────────────────────────┐
│                    浏览器请求页面                       │
└──────────────────────┬───────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────┐
│                  server.js (Node.js)                  │
│                                                      │
│  1. ReactDOMServer.renderToString(<App/>)             │
│     → 执行 React 组件，生成静态 HTML 字符串            │
│     → useState 返回初始值（如 count: 0）              │
│     → onClick 事件不会绑定，只是 DOM 属性              │
│                                                      │
│  2. 把 HTML 字符串嵌入完整页面模板                      │
│     → 包含 <head>、CSS、CDN 引用等                    │
│                                                      │
│  3. res.send(完整 HTML) → 返回给浏览器                 │
└──────────────────────┬───────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────┐
│              浏览器（第一次接收）                       │
│                                                      │
│  收到完整 HTML，立即渲染页面                           │
│  → 用户看到完整内容（首屏白屏时间极短）                  │
│  → 但按钮点击无反应（事件还没绑定）                     │
│  → View Source 可以看到全部 HTML                       │
└──────────────────────┬───────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────┐
│              浏览器加载 /dist/client.js                │
│                                                      │
│  hydrateRoot(container, <App/>)                      │
│  → React 重新"虚拟"渲染一遍组件树                     │
│  → 对比已有的 DOM，发现匹配                            │
│  → 不修改 DOM，只绑定事件处理器                        │
│  → 页面变成可交互的 SPA                                │
└──────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────┐
│              用户交互（点击 Plus 按钮）                 │
│                                                      │
│  React 更新 DOM → Count: 0 → Count: 1                │
│  后续所有交互都在客户端完成，不再请求服务端               │
└──────────────────────────────────────────────────────┘
```

---

## 四、关键概念详解

### 4.1 `renderToString` 做了什么

```js
const appHtml = ReactDOMServer.renderToString(React.createElement(App));
```

输出的是一个**静态 HTML 字符串**：

```html
<div class="app">
  <h1>🚀 React SSR — Full Example</h1>
  <div class="counter">
    <h2>🔢 Counter</h2>
    <p class="count">Count: 0</p>          <!-- 初始值写死 -->
    <button>➖ Minus</button>              <!-- 没有事件绑定 -->
    <button>➕ Plus</button>
    <button>🔄 Reset</button>
  </div>
  <div class="todo">
    <ul>
      <li class="done">✅ Learn React SSR</li>
      <li>⬜ Implement hydration</li>
      <li>⬜ Build something awesome</li>
    </ul>
    <p class="stats">1 / 3 completed</p>
  </div>
</div>
```

**注意：**
- `useState(0)` → `Count: 0` 是固定的
- 按钮没有 `onclick` 属性（React 的合成事件不会出现在 SSR HTML 中）
- `new Date().toISOString()` 在每次请求时在服务端执行，所以每次刷新时间会变

### 4.2 `hydrateRoot` 做了什么

```js
hydrateRoot(container, React.createElement(App));
```

**与 `createRoot` 的区别：**

| | `createRoot` | `hydrateRoot` |
|---|---|---|
| **用途** | 纯客户端渲染（CSR） | 服务端已渲染后的客户端接管 |
| **DOM 已存在 HTML** | 删除并重建 | **保留已有 HTML，不修改** |
| **首屏性能** | 慢（等 JS 加载渲染） | **快（HTML 直接显示）** |
| **SEO** | 差（爬虫看不到内容） | **好（HTML 完整可见）** |

**hydrateRoot 的工作原理：**
1. React 在客户端重新"虚拟"执行一遍 `<App/>` 组件
2. 生成虚拟 DOM 树
3. 和已有的服务端 HTML 对比
4. **匹配成功** → 不修改 DOM，只在对应节点上绑定事件
5. **匹配失败** → 控制台报 warning（hydration mismatch），通常是因为服务端和客户端数据不一致

### 4.3 为什么要用同一份 App 组件

```js
// 服务端
const App = require('./src/App');
const html = ReactDOMServer.renderToString(<App/>);

// 客户端
const App = require('./src/App');
hydrateRoot(container, <App/>);
```

**如果两边用不同的组件树，hydrate 会失败。**

React 要求服务端渲染的 HTML 和客户端 hydrate 时生成的虚拟 DOM 完全一致。不一致会导致：
- 控制台 warning：`Hydration failed because the initial UI does not match`
- 闪烁/界面异常

---

## 五、遇到的问题与解决

### 5.1 Express 5.x 的 `path-to-regexp` 兼容问题

**错误信息：**
```
PathError [TypeError]: Missing parameter name at index 1: *
```

**原因：** Express 5.x 升级了 `path-to-regexp` 到 v8+，不再支持 `*` 通配符语法。

**解决：** 将 `'*'` 改为 `'/{*path}'`（命名通配符）

```js
// ❌ Express 5.x 不支持
app.get('*', (req, res) => { ... });

// ✅ Express 5.x 命名通配符
app.get('/{*path}', (req, res) => { ... });
```

### 5.2 Git submodule 问题

**问题：** 将子项目提交到 GitHub 后，目录显示为空。

**原因：** 子项目之前有独立的 `.git` 目录，被 git 当作 submodule（模式 `160000`）提交。

**解决：**
```bash
git rm --cached my-app          # 移除 submodule 引用
git add my-app/                 # 重新作为普通目录添加
git commit -m "fix: convert submodule to directory"
```

---

## 六、启动方式

```bash
# 方法一：一键启动
cd ssr/exp2
bash run.sh

# 方法二：分步执行
npm install              # 安装依赖
node build.js            # 打包客户端 bundle
node server.js           # 启动 SSR 服务
```

**访问：** http://localhost:3001

**验证 SSR 是否生效：**
1. 打开浏览器访问 `http://localhost:3001`
2. 右键 → "查看页面源代码" → 能看到完整的 HTML 内容
3. 等客户端 JS 加载后，点击按钮 → 状态更新正常

---

## 七、SSR vs CSR 对比

| | CSR（客户端渲染） | SSR（服务端渲染） |
|---|---|---|
| **首屏渲染** | 白屏 → 等 JS 加载 → 渲染 | 直接显示完整内容 |
| **SEO** | 爬虫看不到内容 | 爬虫可索引完整 HTML |
| **首屏性能（FCP）** | 慢 | 快 |
| **交互能力** | 完整 | 需等 hydration 完成 |
| **服务端压力** | 低（只返回空壳） | 高（需执行 React 渲染） |
| **复杂度** | 低 | 高（需维护双端一致性） |
| **适用场景** | 后台管理系统、SPA | 内容型网站、电商首页、落地页 |

---

## 八、进一步学习方向

- **数据获取：** 服务端请求 API 数据，注入到 HTML 中（`getServerSideProps` 模式）
- **路由：** `react-router` 服务端渲染（`StaticRouter`）
- **流式渲染：** React 18+ 的 `renderToPipeableStream`，支持渐进式 HTML 输出
- **框架层面：** Next.js / Remix 等框架已经封装了完整的 SSR 方案
