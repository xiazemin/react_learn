// src/lib/mock-data.js — 模拟数据库（真实项目中替换为 Prisma/Drizzle 等）

const products = [
  { id: 1, name: 'React 实战教程',  price: 79.9,  description: '从零到一掌握 React 19 全部新特性，含 Hooks、Server Components、Suspense。' },
  { id: 2, name: 'Next.js 权威指南', price: 99.9,  description: '深入 App Router、ISR、流式渲染、Server Actions，构建生产级应用。' },
  { id: 3, name: 'TypeScript 入门',   price: 59.9,  description: '类型体操从入门到放弃（划掉）到精通。' },
  { id: 4, name: 'Node.js 微服务',   price: 89.9,  description: 'Express + gRPC + 消息队列，打造高可用后端架构。' },
  { id: 5, name: 'CSS 现代指南',     price: 49.9,  description: 'Grid、Flexbox、Container Queries、Cascade Layers 一次讲透。' },
];

// 模拟异步数据库查询
export async function getAllProducts() {
  // 模拟网络延迟
  await new Promise((r) => setTimeout(r, 50));
  return products;
}

export async function getProductById(id) {
  await new Promise((r) => setTimeout(r, 30));
  return products.find((p) => p.id === Number(id)) || null;
}
