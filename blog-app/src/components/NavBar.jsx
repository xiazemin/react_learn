// 文件路径：src/components/NavBar.jsx
import '../App.css'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">RUNOOB Blog</Link>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/search">搜索</Link>
        <Link to="/old">旧版</Link>
      </nav>
    </header>
  )
}

export default NavBar