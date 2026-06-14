// src/app/products/[id]/page.js — 商品详情页
// 支持 ?disableSSR=1 切换 SSR/CSR 模式
// 动态路由参数 [id] 由 Next.js 自动解析并传入 params

import Link from 'next/link';
import { getProductById } from '@/lib/mock-data';
import AddToCartButton from '@/components/AddToCartButton';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';

export const metadata = {
  title: '商品详情 — Next.js SSR',
};

export default async function ProductDetailPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const isCSR = sp?.disableSSR === '1';

  // SSR 模式：服务端获取数据
  // CSR 模式：跳过服务端获取，由 Client Component 通过 Server Action 获取
  const product = isCSR ? null : await getProductById(id);

  // CSR 模式下不检查 notFound（数据还没获取）
  if (!isCSR && !product) {
    notFound();
  }

  // CSR 模式：让 Client Component 自己处理
  if (isCSR) {
    return (
      <div>
        <Link href="/products?disableSSR=1" style={{ color: '#4a90d9', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          ← 返回商品列表
        </Link>
        <ProductDetailClient productId={id} />
      </div>
    );
  }

  // SSR 模式：服务端已获取数据，直接渲染
  return (
    <div>
      <Link href="/products" style={{ color: '#4a90d9', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        ← 返回商品列表
      </Link>

      <div className="card product-detail">
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="tag tag-server">Server Component</span> 服务端渲染
        </div>
        <h1>{product.name}</h1>
        <p className="price">¥{product.price}</p>
        <p className="desc">{product.description}</p>

        <div style={{ marginTop: '1.5rem' }}>
          <span className="tag tag-client">Client Component</span> 以下按钮在客户端交互：
          <div style={{ marginTop: '0.5rem' }}>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>💡 这个页面展示了什么</h2>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#555', fontSize: '0.9rem' }}>
          <li><strong>动态路由</strong>：<code>/products/[id]</code> 自动解析 URL 参数</li>
          <li><strong>Server Component</strong>：商品数据在服务端获取，页面渲染成完整 HTML</li>
          <li><strong>Client Component</strong>：<code>AddToCartButton</code> 用 <code>&apos;use client&apos;</code> 标记，在浏览器中运行</li>
          <li><strong>组合模式</strong>：Server Component 可以导入 Client Component，反之不行</li>
          <li><strong>Props 传递</strong>：Server Component 从 DB 获取数据，通过 props 传给 Client Component</li>
        </ul>
        <p style={{ marginTop: '0.8rem' }}>
          切换模式：<a href={`/products/${id}`} className="btn btn-primary" style={{ marginRight: '0.5rem' }}>⚡ SSR</a>
          <a href={`/products/${id}?disableSSR=1`} className="btn btn-secondary">🔄 CSR</a>
        </p>
      </div>
    </div>
  );
}
