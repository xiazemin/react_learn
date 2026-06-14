import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Clock from './Clock.tsx';
import ParentComponent from './Parent';
import PropTypesDemo from './PropTypes';
import AppRouter from './AppRouter';
import NestedRouter from './NestedRouter';
import CssComponent from './CssComponent';
import './my-sass.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Clock />
    <ParentComponent />
    <PropTypesDemo />
    <AppRouter />
    <NestedRouter />
    <CssComponent />
  </StrictMode>,
)
