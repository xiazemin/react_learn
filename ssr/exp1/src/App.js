// src/App.js — 共享组件（Server + Client 通用）
const React = require('react');

function App() {
  return React.createElement('div', { className: 'app' },
    React.createElement('h1', null, '🚀 React SSR Demo'),
    React.createElement('p', null, 'This page is rendered by the server.'),
    React.createElement('p', { className: 'hint' }, 'Open DevTools → Elements to see the HTML, then interact to verify hydration.')
  );
}

module.exports = App;
