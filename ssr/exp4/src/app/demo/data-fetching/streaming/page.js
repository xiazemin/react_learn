// src/app/demo/data-fetching/streaming/page.js — Streaming 演示
// 使用 Suspense 实现流式渲染：快的组件先显示，慢的后显示
import Link from 'next/link';
import { Suspense } from 'react';

// 快的数据源（200ms）
async function FastData() {
  await new Promise(r => setTimeout(r, 200));
  return (
    <div className="card" style={{ borderLeft: '4px solid #2d7a2d' }}>
      <h3 style={{ color: '#2d7a2d' }}>⚡ 快速数据（200ms）</h3>
      <p style={{ marginTop: '0.3rem', color: '#555' }}>
        服务器时间：<code className="timestamp">{new Date().toISOString()}</code>
      </p>
      <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: '#999' }}>
        这个组件最先加载完成，用户立刻看到内容。
      </p>
    </div>
  );
}

// 中等数据源（1s）
async function MediumData() {
  await new Promise(r => setTimeout(r, 1000));
  return (
    <div className="card" style={{ borderLeft: '4px solid #c05621' }}>
      <h3 style={{ color: '#c05621' }}>🔄 中速数据（1s）</h3>
      <p style={{ marginTop: '0.3rem', color: '#555' }}>
        商品数量：5 件 | 总价：¥379.5
      </p>
      <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: '#999' }}>
        这个组件在快速数据之后加载。用户不会被慢的数据阻塞。
      </p>
    </div>
  );
}

// 慢的数据源（3s）
async function SlowData() {
  await new Promise(r => setTimeout(r, 3000));
  return (
    <div className="card" style={{ borderLeft: '4px solid #e74c3c' }}>
      <h3 style={{ color: '#e74c3c' }}>🐌 慢速数据（3s）</h3>
      <p style={{ marginTop: '0.3rem', color: '#555' }}>
        推荐算法结果：React 实战教程, Next.js 权威指南
      </p>
      <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: '#999' }}>
        这个组件最后加载。用户已经看到了前面的内容，不会觉得页面卡住了。
      </p>
    </div>
  );
}

function LoadingFallback({ name }) {
  return (
    <div className="card loading" style={{ borderLeft: '4px solid #ddd' }}>
      ⏳ {name} 加载中...
    </div>
  );
}

export default function StreamingPage() {
  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-orange">Streaming</span>
          流式渲染 — Suspense 分块加载
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          页面被拆成多个独立的 <code>Suspense</code> 块，每块独立加载。快的先显示，慢的后显示。
          <strong>刷新页面</strong>观察加载顺序。
        </p>
      </div>

      <div className="card">
        <h2>⏱️ 观察加载顺序</h2>
        <p style={{ marginTop: '0.3rem', color: '#999', fontSize: '0.9rem' }}>
          刷新页面后，你会看到：快速数据先出现 → 中速数据随后 → 慢速数据最后出现。
        </p>
      </div>

      {/* 流式渲染的核心：每个 Suspense 块独立加载 */}
      <Suspense fallback={<LoadingFallback name="快速数据" />}>
        <FastData />
      </Suspense>

      <Suspense fallback={<LoadingFallback name="中速数据" />}>
        <MediumData />
      </Suspense>

      <Suspense fallback={<LoadingFallback name="慢速数据" />}>
        <SlowData />
      </Suspense>

      <div className="card">
        <h2>🔧 实现方式</h2>
        <pre style={{ marginTop: '0.8rem' }}>
{`// app/demo/data-fetching/streaming/page.js
import { Suspense } from 'react';

// 每个异步组件独立加载
async function FastData() {
  await new Promise(r => setTimeout(r, 200));   // 200ms
  return <div>快速内容...</div>;
}

async function SlowData() {
  await new Promise(r => setTimeout(r, 3000));  // 3s
  return <div>慢速内容...</div>;
}

// 关键：Suspense 包裹每个独立块
export default function StreamingPage() {
  return (
    <div>
      <Suspense fallback={<Loading />}>    {/* 这块先到先显示 */}
        <FastData />
      </Suspense>
      <Suspense fallback={<Loading />}>    {/* 这块后到后显示 */}
        <SlowData />
      </Suspense>
    </div>
  );
}

// 工作流程（浏览器视角）：
// t=0s   服务器开始发送 HTML
// t=0.2s 收到 FastData 的 HTML → 用户看到快速内容
// t=1s   收到 MediumData 的 HTML → 页面更新
// t=3s   收到 SlowData 的 HTML → 页面再次更新
// 用户始终看到内容，从不面对空白页面`}
        </pre>
      </div>

      <div className="card" style={{ background: '#fef3e2' }}>
        <h2>💡 Streaming vs 传统 SSR</h2>
        <table style={{ marginTop: '0.5rem' }}>
          <thead>
            <tr><th></th><th>传统 SSR</th><th>Streaming SSR</th></tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 500 }}>响应方式</td>
              <td>等所有数据就绪 → 一次性发送</td>
              <td>分块发送，先就绪的先发</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>用户感知</td>
              <td>白屏 → 全部内容出现</td>
              <td>骨架 → 逐步填充内容</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>TTFB</td>
              <td>取决于最慢的数据源</td>
              <td>取决于最快的数据源</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500 }}>React API</td>
              <td>renderToString</td>
              <td>renderToPipeableStream（React 18+）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link href="/demo/data-fetching" style={{ display: 'inline-block', color: '#4a90d9', textDecoration: 'none' }}>
        ← 返回数据获取 Demo
      </Link>
    </div>
  );
}
