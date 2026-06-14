// server.js — Exp2 SSR Server
const express = require('express');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('./src/App');

const app = express();

// 打包后的客户端 bundle
app.use(express.static(path.join(__dirname, 'dist')));

// 所有路由走 SSR
app.get('/{*path}', (req, res) => {
  // 1. 服务端渲染组件 → HTML 字符串
  const appHtml = ReactDOMServer.renderToString(React.createElement(App));

  // 2. 完整 HTML 响应
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>SSR Exp2 — Full Example</title>
      <!-- React CDN：服务端和客户端共用同一版本 -->
      <script src="https://unpkg.com/react@19/umd/react.production.min.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js" crossorigin></script>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f0f2f5; color: #1a1a2e; padding: 2rem; }
        .app { max-width: 640px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        h1 { font-size: 1.6rem; margin-bottom: 0.5rem; }
        .desc { color: #666; margin-bottom: 1.5rem; font-size: 0.95rem; }
        h2 { font-size: 1.2rem; margin: 1.5rem 0 0.8rem; }
        .count { font-size: 1.5rem; font-weight: bold; color: #e74c3c; margin-bottom: 0.5rem; }
        .btn-group { display: flex; gap: 0.5rem; }
        button { padding: 0.4rem 1rem; border: 1px solid #ddd; border-radius: 6px; background: #fff; cursor: pointer; font-size: 0.9rem; transition: background 0.15s; }
        button:hover { background: #e8f4fd; }
        .todo-input { display: flex; gap: 0.5rem; margin-bottom: 0.8rem; }
        .todo-input input { flex: 1; padding: 0.4rem 0.8rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; outline: none; }
        .todo-input input:focus { border-color: #4a90d9; }
        ul { list-style: none; }
        li { display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #f0f0f0; }
        .todo-text { cursor: pointer; }
        li.done .todo-text { text-decoration: line-through; color: #999; }
        .delete { border: none; background: none; font-size: 1rem; cursor: pointer; opacity: 0.4; }
        .delete:hover { opacity: 1; }
        .stats { color: #999; font-size: 0.85rem; margin-top: 0.5rem; }
        .footer { margin-top: 1.5rem; color: #aaa; font-size: 0.85rem; }
        .footer code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div id="root">${appHtml}</div>
      <script src="/client.js"></script>
    </body>
    </html>
  `;
  res.send(html);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Exp2 SSR running → http://localhost:${PORT}`));
