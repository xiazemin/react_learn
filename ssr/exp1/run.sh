#!/bin/bash
cd "$(dirname "$0")"
npm install
npx esbuild src/client.js --bundle --outfile=dist/client.js --format=iife --platform=browser --target=es2020 --external:react --external:react-dom --external:react-dom/client --sourcemap
node server.js
