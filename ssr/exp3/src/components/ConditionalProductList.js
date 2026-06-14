// src/components/ConditionalProductList.js — Client Component
// 根据 mode 属性决定 SSR 或 CSR 模式渲染商品列表
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/app/actions/products';

export default function ConditionalProductList({ initialProducts, mode }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  // CSR 模式：挂载后在客户端获取数据
  useEffect(() => {
    if (mode === 'csr' && initialProducts.length === 0) {
      setLoading(true);
      fetchProducts().then((data) => {
        setProducts(data);
        setLoading(false);
      });
    }
  }, [mode, initialProducts.length]);

  return (
    <div>
      {/* 模式指示器 */}
      <div className="card" style={{ background: mode === 'csr' ? '#fff3cd' : '#e8f8e8' }}>
        <h2 style={{ fontSize: '1rem' }}>
          {mode === 'csr' ? '🔄 CSR 模式（disableSSR=1）' : '⚡ SSR 模式（默认）'}
        </h2>
        <p style={{ marginTop: '0.3rem', fontSize: '0.9rem', color: '#666' }}>
          {mode === 'csr'
            ? '数据在客户端通过 Server Action 获取。服务端 HTML 中没有商品数据。'
            : '数据在服务端获取，HTML 中包含完整商品内容。View Source 可以看到。'}
        </p>
      </div>

      {/* 加载状态（仅 CSR 模式初始时显示） */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          ⏳ 正在从客户端加载数据...
        </div>
      )}

      {/* 商品列表 */}
      {!loading && (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h2>{product.name}</h2>
              <p className="price">¥{product.price}</p>
              <p className="desc">{product.description}</p>
              <Link href={`/products/${product.id}?disableSSR=${mode === 'csr' ? '1' : ''}`} className="link">
                查看详情 →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!loading && products.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          暂无商品数据
        </div>
      )}
    </div>
  );
}
