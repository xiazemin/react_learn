// src/client.js — 客户端 hydration 入口
const React = require('react');
const { hydrateRoot } = require('react-dom/client');
const App = require('./App');

const container = document.getElementById('root');
hydrateRoot(container, React.createElement(App));
