// src/app/actions/products.js — Server Action
// 供 Client Component 在 CSR 模式下调用（代替 useEffect + fetch('/api/...')）
'use server';

import { getAllProducts, getProductById } from '@/lib/mock-data';

export async function fetchProducts() {
  return await getAllProducts();
}

export async function fetchProductById(id) {
  return await getProductById(id);
}
