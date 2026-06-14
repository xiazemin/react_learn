// src/app/api/hello/route.js — 简单 API Route
// GET /api/hello → 返回 JSON 响应

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from Next.js API Route!',
    timestamp: new Date().toISOString(),
    note: '这个响应来自 app/api/hello/route.js',
  });
}
