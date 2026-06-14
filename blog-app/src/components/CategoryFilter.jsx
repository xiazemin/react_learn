// 文件路径：src/components/CategoryFilter.jsx
function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="filter-bar">
      {categories.map(cat => (
        <button
          key={cat}
          className={activeCategory === cat ? 'active' : ''}
          // 点击时调用父组件传来的回调函数
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter