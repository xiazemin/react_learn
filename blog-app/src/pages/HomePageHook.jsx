// 文件路径：src/pages/HomePageHook.jsx
import { usePosts } from '../hooks/usePosts'
import BlogCard from '../components/BlogCard'
import CategoryFilter from '../components/CategoryFilter'

function HomePageHook() {
  // 一行代码获取所有文章相关数据和操作
  const {
    isLoading, error,
    activeCategory, setActiveCategory,
    keyword, setKeyword,
    categories,
    filteredArticles,
    refetch
  } = usePosts()

  if (isLoading) return <p className="status-msg">加载中...</p>
  if (error) return (
    <div className="status-msg error">
      <p>加载失败：{error}</p>
      <button onClick={refetch}>重试</button>
    </div>
  )

  return (
    <div>
      <h2 className="section-title">最新文章</h2>

      <div className="search-bar">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="搜索文章标题或摘要..."
          className="search-input"
        />
        {keyword && <span className="clear-btn" onClick={() => setKeyword('')}>✕</span>}
      </div>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <p className="result-info">共 {filteredArticles.length} 篇</p>

      {filteredArticles.length === 0 ? (
        <p className="empty-tip">没有匹配的文章</p>
      ) : (
        <div className="article-grid">
          {filteredArticles.map(article => (
            <BlogCard key={article.id} {...article} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePageHook