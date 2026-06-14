// server.js
const express = require('express');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = require('./src/App');

const app = express();

// 托管客户端 bundle
app.use(express.static(path.join(__dirname, 'dist')));

// 所有路由走 SSR
app.get('/{*path}', (req, res) => {
  // 服务端渲染组件 → HTML 字符串
  const appHtml = ReactDOMServer.renderToString(React.createElement(App));

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>SSR Exp1</title>
      <script src="https://unpkg.com/react@19/umd/react.production.min.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js" crossorigin></script>
      <style>
        body { font-family: system-ui, sans-serif; margin: 40px; background: #f8f9fa; }
        .app { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .hint { color: #666; font-size: 0.9em; }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Exp1 SSR running → http://localhost:${PORT}`));
