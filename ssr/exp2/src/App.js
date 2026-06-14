// src/App.js — 完整 SSR 示例：带状态的交互组件
const React = require('react');

function Counter() {
  const [count, setCount] = React.useState(0);
  return React.createElement('div', { className: 'counter' },
    React.createElement('h2', null, '🔢 Counter'),
    React.createElement('p', { className: 'count' }, `Count: ${count}`),
    React.createElement('div', { className: 'btn-group' },
      React.createElement('button', { onClick: () => setCount(c => c - 1) }, '➖ Minus'),
      React.createElement('button', { onClick: () => setCount(c => c + 1) }, '➕ Plus'),
      React.createElement('button', { onClick: () => setCount(0) }, '🔄 Reset')
    )
  );
}

function TodoList() {
  const [todos, setTodos] = React.useState([
    { id: 1, text: 'Learn React SSR', done: true },
    { id: 2, text: 'Implement hydration', done: false },
    { id: 3, text: 'Build something awesome', done: false },
  ]);
  const [input, setInput] = React.useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return React.createElement('div', { className: 'todo' },
    React.createElement('h2', null, '📝 Todo List'),
    React.createElement('div', { className: 'todo-input' },
      React.createElement('input', {
        type: 'text',
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: (e) => e.key === 'Enter' && addTodo(),
        placeholder: 'Add a new todo...',
      }),
      React.createElement('button', { onClick: addTodo }, 'Add')
    ),
    React.createElement('ul', null,
      todos.map(t =>
        React.createElement('li', { key: t.id, className: t.done ? 'done' : '' },
          React.createElement('span', {
            className: 'todo-text',
            onClick: () => toggleTodo(t.id),
          }, t.done ? '✅ ' : '⬜ ', t.text),
          React.createElement('button', {
            className: 'delete',
            onClick: () => removeTodo(t.id),
          }, '❌')
        )
      )
    ),
    React.createElement('p', { className: 'stats' },
      `${todos.filter(t => t.done).length} / ${todos.length} completed`
    )
  );
}

function App() {
  return React.createElement('div', { className: 'app' },
    React.createElement('h1', null, '🚀 React SSR — Full Example'),
    React.createElement('p', { className: 'desc' },
      'Server-rendered HTML with client-side hydration. ',
      'Click buttons to verify React state works after hydration.'
    ),
    React.createElement(Counter, null),
    React.createElement(TodoList, null),
    React.createElement('div', { className: 'footer' },
      React.createElement('hr', null),
      React.createElement('p', null,
        'Rendered at: ',
        React.createElement('code', null, new Date().toISOString())
      )
    )
  );
}

module.exports = App;
