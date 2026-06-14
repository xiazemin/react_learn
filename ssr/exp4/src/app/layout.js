// src/app/layout.js — 根布局（Server Component）
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Next.js 定位与用法指南 — exp4',
  description: '通过多个 Demo 理解 Next.js 的定位、核心能力、以及如何与 React 结合',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="layout">
          <nav className="nav">
            <span className="logo">📘 exp4</span>
            <Link href="/">首页</Link>
            <Link href="/demo/routing">路由</Link>
            <Link href="/demo/data-fetching">数据获取</Link>
            <Link href="/demo/api">API Routes</Link>
            <Link href="/demo/streaming">Streaming</Link>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
