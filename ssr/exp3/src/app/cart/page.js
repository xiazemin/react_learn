// src/app/cart/page.js — 购物车页（Server Component + Client Component 混合）
// Server Component 负责初始数据获取，Client Component 负责交互

import { getCart } from '@/app/actions/cart';
import CartClient from './CartClient';

export const metadata = {
  title: '购物车 — Next.js SSR',
};

export default async function CartPage() {
  // 服务端直接调用 Server Action 获取数据
  const initialCart = await getCart();

  return (
    <div>
      <div className="card">
        <h1>
          <span className="tag tag-action">Server Action</span>
          🛒 购物车
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          初始数据在服务端获取，交互操作通过 Server Action 完成。
          无需 <code>useEffect</code>、<code>fetch</code>、<code>loading</code> 状态。
        </p>
      </div>

      <CartClient initialCart={initialCart} />
    </div>
  );
}
