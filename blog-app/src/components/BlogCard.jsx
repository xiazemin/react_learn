import {Link} from 'react-router-dom'
// 文件路径：src/components/BlogCard.jsx
// Props 即函数的第一个参数，通常解构使用
function BlogCard({ id, title, summary, date, category }) {
  return (
     <Link to={`/post/${id}`} className="card-link">
      <div className="card">
        <span className="tag">{category}</span>
        <h3>{title}</h3>
        <p>{summary}</p>
        <span className="date">{date}</span>
      </div>
    </Link>
  )
}

export default BlogCard