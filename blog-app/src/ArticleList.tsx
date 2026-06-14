function ArticleList() {
  // 用 JS 对象数组模拟文章数据
  const articles = [
    {
      id: 1,
      title: 'React 入门完全指南',
      summary: '从零开始学习 React Hooks，涵盖 useState、useEffect 等核心概念。',
      date: '2024-05-10',
      category: 'React',
      cover: '/images/react.png'
    },
    {
      id: 2,
      title: 'JavaScript 异步编程详解',
      summary: '一文搞懂 Promise、async/await、事件循环与微任务队列。',
      date: '2024-05-08',
      category: 'JavaScript',
      cover: '/images/js.png'
    },
    {
      id: 3,
      title: 'CSS Grid 布局实战',
      summary: '用 CSS Grid 轻松实现复杂的响应式布局。',
      date: '2024-05-05',
      category: 'CSS',
      cover: '/images/css.png'
    }
  ]

  return (
    <div className="article-list">
      {/* map 遍历数组，每条数据返回一段 JSX */}
      {articles.map(article => (
        <div key={article.id} className="card">
          <img src={article.cover} alt={article.title} />
          <div className="card-body">
            <span className="category">{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <span className="date">{article.date}</span>
          </div>
        </div>
      ))}
    </div>
  )
}