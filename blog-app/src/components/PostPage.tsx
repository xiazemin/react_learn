import { useParams,useNavigate } from 'react-router-dom'

function PostPage() {
  // useParams 返回一个对象，包含 URL 中的参数
  const { id } = useParams()
  // 注意：id 是字符串，需要数字时可以 Number(id) 转换
 const navigate = useNavigate()

  const article = null  // 假设没找到文章

  if (!article) {
    // 文章不存在时，跳转回首页
    return (
      <div>
        <p>文章不存在</p>
        <button onClick={() => navigate('/')}>返回首页</button>
      </div>
    )
  }
  
  return (
    <div>
      <p>当前文章 ID：{id}</p>
    </div>
  )
}

export default PostPage