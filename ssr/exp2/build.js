// build.js — esbuild 打包客户端 bundle
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

esbuild.build({
  entryPoints: [path.join(__dirname, 'src', 'client.js')],
  bundle: true,
  outfile: path.join(distDir, 'client.js'),
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  external: ['react', 'react-dom', 'react-dom/client'],
  minify: false,
  sourcemap: true,
}).then(() => {
  console.log('✅ Client bundle built → dist/client.js');
}).catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
