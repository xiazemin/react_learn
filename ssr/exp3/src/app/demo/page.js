// src/app/demo/page.js — 交互演示页（Server Component + Client Component 混合）
// 展示 Server Component 和 Client Component 如何协作

import CounterButton from './CounterButton';
import TodoList from './TodoList';

async function getServerTime() {
  await new Promise((r) => setTimeout(r, 10));
  return new Date().toISOString();
}

export default async function DemoPage() {
  const serverTime = await getServerTime();

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-server">Server</span> +
          <span className="tag tag-client">Client</span>
          混合渲染演示
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          页面中同时包含 Server Component 和 Client Component，各自负责不同的职责。
          Server Component 负责数据获取和静态内容，Client Component 负责交互逻辑。
        </p>
      </div>

      {/* Server Component 渲染的静态信息 */}
      <div className="card">
        <h2>
          <span className="tag tag-server">Server Component</span>
          📊 服务端数据
        </h2>
        <p style={{ marginTop: '0.5rem', color: '#555' }}>
          这段内容在服务端渲染，包含从后端获取的数据：
        </p>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#555', fontSize: '0.9rem' }}>
          <li>服务端时间：<code className="server-time">{serverTime}</code></li>
          <li>Node.js 版本：{process.version}</li>
          <li>运行环境：{process.env.NODE_ENV || 'development'}</li>
        </ul>
        <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#999' }}>
          ⚠️ 这些信息<strong>不会</strong>出现在浏览器的 JS bundle 中。
          View Source 可以看到完整 HTML。
        </p>
      </div>

      {/* Client Component：可交互的计数器 */}
      <CounterButton initialValue={0} serverRenderedAt={serverTime} />

      {/* Client Component：可交互的 TodoList */}
      <TodoList
        initialTodos={[
          { id: 1, text: '理解 Server Components', done: true },
          { id: 2, text: '理解 Client Components', done: true },
          { id: 3, text: '理解 Server Actions', done: false },
          { id: 4, text: '构建生产级 Next.js 应用', done: false },
        ]}
        serverRenderedAt={serverTime}
      />

      {/* 对比总结 */}
      <div className="card">
        <h2>📌 与 exp1/exp2 手动 SSR 的对比</h2>
        <table style={{ width: '100%', marginTop: '0.8rem', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e8e8e8', textAlign: 'left' }}>
              <th style={{ padding: '0.4rem 0.8rem' }}>痛点</th>
              <th style={{ padding: '0.4rem 0.8rem' }}>exp1/exp2（手动）</th>
              <th style={{ padding: '0.4rem 0.8rem' }}>exp3（Next.js）</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['数据获取', '手动在服务端 fetch，手动传给组件', 'Server Component 直接 async/await'],
              ['组件分类', '需要自己决定哪些组件发到客户端', '"use client" 一行标记'],
              ['API 路由', '手动写 Express 路由', 'Server Action 自动处理'],
              ['代码分割', '手动配置 esbuild externals', '框架自动处理'],
              ['路由', '手动配置 Express 路由', '文件系统自动路由'],
              ['Hydration', '手动 hydrateRoot + 保持一致性', '框架自动处理'],
              ['样式', '手动写 CSS / <style>', 'CSS Modules / 全局 CSS / Tailwind'],
            ].map(([pain, manual, next]) => (
              <tr key={pain} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '0.4rem 0.8rem', fontWeight: 500 }}>{pain}</td>
                <td style={{ padding: '0.4rem 0.8rem', color: '#999' }}>{manual}</td>
                <td style={{ padding: '0.4rem 0.8rem', color: '#2d7a2d' }}>{next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
