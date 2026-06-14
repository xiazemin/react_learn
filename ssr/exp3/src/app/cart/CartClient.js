// src/app/cart/CartClient.js — Client Component
// 购物车交互逻辑：调用 Server Action 完成增删，无需手动写 API
'use client';

import { useState, useTransition } from 'react';
import { getCart, removeFromCart } from '@/app/actions/cart';

export default function CartClient({ initialCart }) {
  const [cart, setCart] = useState(initialCart);
  const [isPending, startTransition] = useTransition();

  const refreshCart = () => {
    startTransition(async () => {
      const updated = await getCart();
      setCart(updated);
    });
  };

  const handleRemove = (productId) => {
    startTransition(async () => {
      await removeFromCart(productId);
      // 删除后刷新购物车
      const updated = await getCart();
      setCart(updated);
    });
  };

  if (cart.items.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ fontSize: '1.2rem', color: '#999' }}>🛒 购物车是空的</p>
        <p style={{ marginTop: '0.5rem', color: '#aaa' }}>
          去 <a href="/products" style={{ color: '#4a90d9' }}>商品列表</a> 逛逛吧
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2>🛒 购物车（{cart.items.length} 件商品）</h2>
          <button className="btn btn-secondary" onClick={refreshCart} disabled={isPending}>
            {isPending ? '刷新中...' : '🔄 刷新'}
          </button>
        </div>

        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div>
              <strong>{item.productName}</strong>
              <span style={{ color: '#999', marginLeft: '0.5rem' }}>
                ¥{item.price} × {item.quantity}
              </span>
            </div>
            <button className="btn btn-danger" onClick={() => handleRemove(item.productId)} disabled={isPending}>
              删除
            </button>
          </div>
        ))}

        <div className="cart-total">
          合计：<span style={{ color: '#e74c3c' }}>¥{cart.total}</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>💡 购物车工作原理</h2>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#555', fontSize: '0.9rem' }}>
          <li><strong>初始数据</strong>：服务端获取（<code>getCart()</code>），通过 props 传给 Client Component</li>
          <li><strong>增删操作</strong>：调用 Server Action（<code>removeFromCart()</code>），自动发到服务端执行</li>
          <li><strong>状态更新</strong>：操作完成后重新调用 <code>getCart()</code> 刷新本地 state</li>
          <li><strong>无需 API 路由</strong>：Server Action 替代了传统的 <code>/api/cart</code> 路由</li>
        </ul>
      </div>
    </div>
  );
}
