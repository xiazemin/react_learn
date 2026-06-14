import { useState, useEffect } from 'react'

function SearchDemo() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])

  // 每当 keyword 变化时，重新执行过滤
  useEffect(() => {
    console.log('keyword 变为：', keyword)
    // 这里可以执行搜索逻辑
    setResults(/* 过滤结果 */)
  }, [keyword])  // 依赖 keyword

  return (
    <div>
      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="搜索..."
      />
      <p>当前搜索：{keyword}</p>
    </div>
  )
}