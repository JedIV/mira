import { createContext, useContext, useState, useEffect } from 'react'

const DemoModeContext = createContext()

const STORAGE_KEY = 'mira-demo-mode'

export function DemoModeProvider({ children }) {
  const [demoMode, setDemoMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'behavior'
    } catch {
      return 'behavior'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, demoMode)
    } catch {}
  }, [demoMode])

  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (!context) throw new Error('useDemoMode must be used within DemoModeProvider')
  return context
}
