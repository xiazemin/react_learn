// src/lib/mock-data.js — 模拟数据源
// 在真实项目中，这里会是数据库查询、API 调用等

export const products = [
  { id: 1, name: 'React 实战教程',  price: 79.9,  category: 'frontend',  updatedAt: '2026-06-14T08:00:00Z' },
  { id: 2, name: 'Next.js 权威指南', price: 99.9,  category: 'frontend',  updatedAt: '2026-06-14T09:00:00Z' },
  { id: 3, name: 'TypeScript 入门',   price: 59.9,  category: 'language',  updatedAt: '2026-06-14T07:00:00Z' },
  { id: 4, name: 'Node.js 微服务',   price: 89.9,  category: 'backend',   updatedAt: '2026-06-14T06:00:00Z' },
  { id: 5, name: 'CSS 现代指南',     price: 49.9,  category: 'frontend',  updatedAt: '2026-06-14T10:00:00Z' },
];

export async function getAllProducts() {
  await new Promise(r => setTimeout(r, 50));
  return products;
}

export async function getProductById(id) {
  await new Promise(r => setTimeout(r, 30));
  return products.find(p => p.id === Number(id)) || null;
}
