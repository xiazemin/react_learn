import { useReducer } from 'react'

// reducer 函数：(当前状态, action) ⇒ 新状态
function favoriteReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      // 如果已收藏则取消，未收藏则添加
      if (state.includes(action.id)) {
        return state.filter(id => id !== action.id)
      } else {
        return [...state, action.id]
      }
    case 'CLEAR':
      return []
    default:
      return state
  }
}

function FavoriteDemo() {
  // useReducer(reducer, 初始值)
  const [favoriteIds, dispatch] = useReducer(favoriteReducer, [])

  return (
    <div>
      <p>收藏数量：{favoriteIds.length}</p>
      <button onClick={() => dispatch({ type: 'TOGGLE', id: 1 })}>
        {favoriteIds.includes(1) ? '取消收藏 1' : '收藏 1'}
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR' })}>清空收藏</button>
    </div>
  )
}