// src/app/api/products/route.js — RESTful API Route
// GET /api/products → 获取商品列表
// POST /api/products → 创建商品

import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/mock-data';

// 内存存储（真实项目中应使用数据库）
const extraProducts = [];

export async function GET() {
  const base = await getAllProducts();
  const all = [...base, ...extraProducts];
  return NextResponse.json(all);
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || body.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price' },
        { status: 400 }
      );
    }

    const newProduct = {
      id: Date.now(),
      name: body.name,
      price: Number(body.price),
      category: body.category || 'uncategorized',
      updatedAt: new Date().toISOString(),
    };

    extraProducts.push(newProduct);

    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}
