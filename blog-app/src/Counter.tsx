// 从 react 中解构导入 useState
import { useState } from 'react'

function Counter() {
  // useState(初始值) 返回一个数组：[当前值, 更新函数]
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)    // 更新状态，React 会自动重新渲染组件
  }

  return (
    <div>
      <p>点击次数：{count}</p>
      <button onClick={handleClick}>+1</button>
    </div>
  )
}