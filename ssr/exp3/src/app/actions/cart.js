// src/app/actions/cart.js — Server Actions
// "use server" 指令：这个函数只在服务端执行，即使从 Client Component 调用
// 原本需要：前端 fetch('/api/cart') → 后端路由 → 处理逻辑
// 现在直接：Client Component 调用 addToCart() → Next.js 自动发送到服务端执行
'use server';

// 模拟购物车存储（真实项目中应存数据库/Redis）
const cart = [];

export async function addToCart(productId, productName, price) {
  // 模拟网络延迟
  await new Promise((r) => setTimeout(r, 300));

  // 检查是否已存在
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, productName, price, quantity: 1 });
  }

  console.log(`[Server Action] Added "${productName}" to cart. Cart now has ${cart.length} items.`);
  return { success: true, message: `Added "${productName}" to cart` };
}

export async function removeFromCart(productId) {
  await new Promise((r) => setTimeout(r, 200));
  const index = cart.findIndex((item) => item.productId === productId);
  if (index !== -1) {
    const removed = cart.splice(index, 1);
    return { success: true, message: `Removed "${removed[0].productName}" from cart` };
  }
  return { success: false, message: 'Item not found' };
}

export async function getCart() {
  await new Promise((r) => setTimeout(r, 10));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items: [...cart], total: Math.round(total * 100) / 100 };
}
