// src/app/products/[id]/AddToCartButton.js — Client Component
// "use client" 指令：这个文件会被打包发送到浏览器，在浏览器中运行
'use client';

import { useTransition } from 'react';
import { addToCart } from '@/app/actions/cart';

export default function AddToCartButton({ product }) {
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(async () => {
      // 调用 Server Action：客户端 → 服务端，无需手动写 API
      await addToCart(product.id, product.name, product.price);
    });
  };

  return (
    <button className="btn btn-primary" onClick={handleAdd} disabled={isPending}>
      {isPending ? '⏳ Adding...' : '🛒 Add to Cart'}
    </button>
  );
}
