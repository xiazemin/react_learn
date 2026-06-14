// 文件路径：src/App.jsx
import NavBar from './components/NavBar'
import './App.css'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <NavBar />

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2024 RUNOOB Blog. Powered by React.</p>
      </footer>
    </div>
  )
}

export default App
