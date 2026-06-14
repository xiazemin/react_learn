// src/app/products/page.js — 商品列表页
// 支持 ?disableSSR=1 切换 SSR/CSR 模式
// Server Component：读取 searchParams，决定数据获取策略

import { getAllProducts } from '@/lib/mock-data';
import ConditionalProductList from '@/components/ConditionalProductList';

export const metadata = {
  title: '商品列表 — Next.js SSR',
};

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const isCSR = params?.disableSSR === '1';

  // SSR 模式：服务端获取数据（代码不发送到浏览器）
  // CSR 模式：跳过服务端获取，由 Client Component 在浏览器中调用 Server Action
  const products = isCSR ? [] : await getAllProducts();

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-server">Server Component</span>
          📦 商品列表
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          通过 URL 参数切换渲染模式：
        </p>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <a href="/products" className="btn btn-primary">⚡ SSR 模式</a>
          <a href="/products?disableSSR=1" className="btn btn-secondary">🔄 CSR 模式</a>
        </div>
      </div>

      <ConditionalProductList
        initialProducts={products}
        mode={isCSR ? 'csr' : 'ssr'}
      />
    </div>
  );
}
