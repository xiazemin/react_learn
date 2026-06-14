import { createContext, useContext, useState } from 'react'

// 第一步：创建 Context
const ThemeContext = createContext(null)

// 第二步：创建 Provider 组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 第三步：在任意组件中使用
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return (
    <button onClick={toggleTheme}>
      当前主题：{theme}
    </button>
  )
}

// 第四步：在 App 中包裹 Provider
function ContextApp() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  )
}