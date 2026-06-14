import { useState, useMemo } from 'react'

function ArticleFilter() {
  const [articles] = useState([
    { id: 1, title: 'React 入门', category: 'React' },
    { id: 2, title: 'Promise 详解', category: 'JavaScript' },
    { id: 3, title: 'Grid 布局', category: 'CSS' },
    { id: 4, title: 'React Hooks', category: 'React' }
  ])
  const [activeCategory, setActiveCategory] = useState('全部')

  // useMemo 缓存过滤结果，只有依赖变化时才重新计算
  const filteredArticles = useMemo(() => {
    console.log('重新计算过滤结果')  // 验证缓存效果
    if (activeCategory === '全部') return articles
    return articles.filter(a => a.category === activeCategory)
  }, [articles, activeCategory])  // 依赖数组

  // 用 useMemo 计算统计数据
  const totalCount = useMemo(() => articles.length, [articles])
  const filteredCount = useMemo(() => filteredArticles.length, [filteredArticles])

  return (
    <div>
      <p>共 {totalCount} 篇，当前 {filteredCount} 篇</p>
      <button onClick={() => setActiveCategory('全部')}>全部</button>
      <button onClick={() => setActiveCategory('React')}>React</button>
      <button onClick={() => setActiveCategory('JavaScript')}>JavaScript</button>
      <button onClick={() => setActiveCategory('CSS')}>CSS</button>

      {filteredArticles.map(a => (
        <div key={a.id}><h3>{a.title}</h3><span>{a.category}</span></div>
      ))}
    </div>
  )
}