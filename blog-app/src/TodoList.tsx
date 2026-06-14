import { useState } from 'react'

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', done: false },
    { id: 2, text: '写博客', done: true }
  ])

  // 添加一项：展开旧数组 + 新元素
  function addTodo(text) {
    const newTodo = { id: Date.now(), text, done: false }
    setTodos([...todos, newTodo])        // 用展开运算符创建新数组
  }

  // 修改一项：map 遍历，找到要改的，返回新对象
  function toggleTodo(id) {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  // 删除一项：filter 过滤掉不想要的
  function removeTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
          {todo.done ? <s>{todo.text}</s> : todo.text}
        </li>
      ))}
    </ul>
  )
}