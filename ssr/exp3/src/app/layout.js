// src/app/layout.js — 根布局（Server Component）
// 这是所有页面的外壳，Next.js App Router 的约定文件
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Next.js App Router — SSR 学习',
  description: 'React Server Components + App Router 完整示例',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="layout">
          <nav className="nav">
            <span className="logo">🚀 Next.js SSR</span>
            <Link href="/">首页</Link>
            <Link href="/products">商品列表</Link>
            <Link href="/cart">购物车</Link>
            <Link href="/demo">交互演示</Link>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
