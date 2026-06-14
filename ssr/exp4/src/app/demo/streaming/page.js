// src/app/demo/streaming/page.js — Demo 4: Streaming 入口
// 重定向到数据获取章节中的 Streaming 演示
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function StreamingRedirect() {
  redirect('/demo/data-fetching/streaming');
}
