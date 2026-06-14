// src/components/ProductDetailClient.js — Client Component
// CSR 模式下的商品详情：挂载后通过 Server Action 获取数据
'use client';

import { useState, useEffect } from 'react';
import AddToCartButton from '@/components/AddToCartButton';
import { fetchProductById } from '@/app/actions/products';

export default function ProductDetailClient({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProductById(productId).then((data) => {
      if (data) {
        setProduct(data);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
        <span className="tag tag-client">Client Component</span>
        <p style={{ marginTop: '0.5rem' }}>⏳ 正在客户端加载商品数据...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
        <p>❌ 商品不存在（CSR 模式下 404 由客户端处理）</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card product-detail">
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="tag tag-client">Client Component</span>
          客户端渲染（CSR）
        </div>
        <h1>{product.name}</h1>
        <p className="price">¥{product.price}</p>
        <p className="desc">{product.description}</p>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ marginTop: '0.5rem' }}>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>🔄 CSR 模式说明</h2>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#555', fontSize: '0.9rem' }}>
          <li>服务端返回的 HTML 中<strong>没有</strong>商品数据（只有 loading 状态）</li>
          <li>JS 加载后 <code>useEffect</code> 触发 <code>fetchProductById()</code> Server Action</li>
          <li>数据返回后 React 更新 DOM 显示商品详情</li>
          <li>View Source 对比：SSR 模式有完整 HTML，CSR 模式只有空壳</li>
        </ul>
        <p style={{ marginTop: '0.8rem' }}>
          切换模式：<a href={`/products/${productId}`} className="btn btn-primary" style={{ marginRight: '0.5rem' }}>⚡ SSR</a>
          <a href={`/products/${productId}?disableSSR=1`} className="btn btn-secondary">🔄 CSR</a>
        </p>
      </div>
    </div>
  );
}
