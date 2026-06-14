// src/app/not-found.js — 自定义 404 页面
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>页面不存在</p>
      <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
        返回首页
      </Link>
    </div>
  );
}
