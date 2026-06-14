function ArticleCard() {
  const coverUrl = '/images/react-cover.png'
  const linkUrl = '/post/1'

  return (
    <div>
      {/* 动态属性：花括号绑定 JS 变量 */}
      <img src={coverUrl} alt="文章封面" />
      <a href={linkUrl}>阅读全文</a>

      {/* 注意：class 要写成 className */}
      <div className="card active">卡片内容</div>

      {/* style 接受一个对象，属性名用驼峰式 */}
      <div style={{ color: '#42b883', fontSize: '16px' }}>
        绿色文字
      </div>
    </div>
  )
}