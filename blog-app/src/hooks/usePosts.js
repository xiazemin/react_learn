// 文件路径：src/hooks/usePosts.js
import { useState, useEffect, useMemo } from 'react'

export function usePosts() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [keyword, setKeyword] = useState('')

  // 加载数据
  useEffect(() => {
    let cancelled = false
    async function fetchPosts() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch('/posts.json')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
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

  // 提取所有分类
  const categories = useMemo(() => {
    return ['全部', ...new Set(articles.map(a => a.category))]
  }, [articles])

  // 按分类 + 关键词过滤
  const filteredArticles = useMemo(() => {
    let result = articles
    if (activeCategory !== '全部') {
      result = result.filter(a => a.category === activeCategory)
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(kw) ||
        a.summary.toLowerCase().includes(kw)
      )
    }
    return result
  }, [articles, activeCategory, keyword])

  // 根据 ID 查找文章
  function getArticleById(id) {
    return articles.find(a => a.id === Number(id))
  }

  // 重新加载
  function refetch() {
    // 触发 useEffect 的另一种方式：用 key 或增强 state
    window.location.reload()
  }

  return {
    articles, isLoading, error,
    activeCategory, setActiveCategory,
    keyword, setKeyword,
    categories,
    filteredArticles,
    getArticleById,
    refetch
  }
}