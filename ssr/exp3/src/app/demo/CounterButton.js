// src/app/demo/CounterButton.js — Client Component
'use client';

import { useState } from 'react';

export default function CounterButton({ initialValue = 0, serverRenderedAt }) {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="card">
      <div className="counter">
        <h2>
          <span className="tag tag-client">Client Component</span>
          🔢 交互式计数器
        </h2>
        <p className="count">{count}</p>
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={() => setCount((c) => c - 1)}>➖ Minus</button>
          <button className="btn btn-primary" onClick={() => setCount((c) => c + 1)}>➕ Plus</button>
          <button className="btn btn-secondary" onClick={() => setCount(0)}>🔄 Reset</button>
        </div>
        <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#999' }}>
          服务端渲染时间：<code className="server-time">{serverRenderedAt}</code>
          <br />
          当前值 <strong>仅在客户端</strong> 更新，服务端 HTML 始终是 {initialValue}
        </p>
      </div>
    </div>
  );
}
