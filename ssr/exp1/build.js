// build.js — 用 esbuild 打包客户端 bundle
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// 确保 dist 目录存在
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

esbuild.build({
  entryPoints: [path.join(__dirname, 'src', 'client.js')],
  bundle: true,
  outfile: path.join(distDir, 'client.js'),
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  // React 通过 CDN 在 HTML 中加载，这里不打包
  external: ['react', 'react-dom', 'react-dom/client'],
  minify: false,       // 开发模式不压缩，方便调试
  sourcemap: true,     // 生成 source map
}).then(() => {
  console.log('✅ Client bundle built → dist/client.js');
}).catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
