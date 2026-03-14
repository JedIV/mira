import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DemoModeProvider } from './contexts/DemoModeContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DemoModeProvider>
        <App />
      </DemoModeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
