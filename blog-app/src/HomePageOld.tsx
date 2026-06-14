export default function HomePageOld() {
  const blogTitle = 'RUNOOB 前端笔记'
  const author = '小明'

  return (
    <div>
      <h1>{blogTitle}</h1>
      <p>作者：{author}</p>
      <p>当前时间：{new Date().toLocaleDateString()}</p>
      <p>欢迎语：{author ? `你好，${author}` : '欢迎访客'}</p>
    </div>
  )
}