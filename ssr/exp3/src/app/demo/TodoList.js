// src/app/demo/TodoList.js — Client Component
'use client';

import { useState } from 'react';

export default function TodoList({ initialTodos, serverRenderedAt }) {
  const [todos, setTodos] = useState(initialTodos);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="card">
      <h2>
        <span className="tag tag-client">Client Component</span>
        📝 交互式 TodoList
      </h2>
      <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: '#999' }}>
        初始数据从 Server Component 传入（props），后续状态更新在客户端完成。
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', margin: '0.8rem 0' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          style={{ flex: 1, padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' }}
        />
        <button className="btn btn-primary" onClick={addTodo}>Add</button>
      </div>

      <ul style={{ listStyle: 'none' }}>
        {todos.map((t) => (
          <li key={t.id} className="cart-item">
            <span
              style={{ cursor: 'pointer', textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#999' : 'inherit' }}
              onClick={() => toggleTodo(t.id)}
            >
              {t.done ? '✅ ' : '⬜ '}{t.text}
            </span>
            <button className="btn btn-danger" style={{ padding: '0.2rem 0.5rem' }} onClick={() => removeTodo(t.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: '0.5rem', color: '#999', fontSize: '0.85rem' }}>
        {todos.filter((t) => t.done).length} / {todos.length} completed
      </p>
    </div>
  );
}
