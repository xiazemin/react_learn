// 文件路径：src/pages/HomePageSearch.jsx
import { useState, useEffect, useMemo } from 'react'
import BlogCard from '../components/BlogCard'
import CategoryFilter from '../components/CategoryFilter'

function HomePageSearch() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [keyword, setKeyword] = useState('')   // 搜索关键词

  // 加载数据
  useEffect(() => {
    let cancelled = false
    async function fetchPosts() {
      setIsLoading(true)
      try {
        const res = await fetch('/posts.json')
        const data = await res.json()
        if (!cancelled) setArticles(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchPosts()
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => {
    return ['全部', ...new Set(articles.map(a => a.category))]
  }, [articles])

  // 筛选 + 搜索：同时按分类和关键词过滤
  const filteredArticles = useMemo(() => {
    let result = articles

    // 先按分类过滤
    if (activeCategory !== '全部') {
      result = result.filter(a => a.category === activeCategory)
    }

    // 再按关键词过滤
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(kw) ||
        a.summary.toLowerCase().includes(kw)
      )
    }

    return result
  }, [articles, activeCategory, keyword])

  return (
    <div>
      <h2 className="section-title">最新文章</h2>

      {/* 搜索框 */}
      <div className="search-bar">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="搜索文章标题或摘要..."
          className="search-input"
        />
        {keyword && (
          <span className="clear-btn" onClick={() => setKeyword('')}>✕</span>
        )}
      </div>

      {isLoading && <p className="status-msg">加载中...</p>}

      {error && (
        <div className="status-msg error">
          <p>加载失败：{error}</p>
          <button onClick={() => window.location.reload()}>重试</button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <p className="result-info">
            共 {filteredArticles.length} 篇
            {keyword && `，搜索「${keyword}」`}
          </p>
          {filteredArticles.length === 0 ? (
            <p className="empty-tip">没有找到匹配的文章</p>
          ) : (
            <div className="article-grid">
              {filteredArticles.map(article => (
                <BlogCard key={article.id} {...article} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HomePageSearch