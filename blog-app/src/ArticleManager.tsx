import { useState } from 'react'

function ArticleManager() {
  const [title, setTitle] = useState('默认标题')

  // 错误写法：直接修改
  // title = '新标题'  // React 不知道你改了，不会重新渲染

  // 正确写法：通过 setter 更新
  function updateTitle() {
    setTitle('新标题')  // React 知道状态变了，会重新渲染
  }

  return (
    <div>
      <p>{title}</p>
      <button onClick={updateTitle}>修改标题</button>
    </div>
  )
}