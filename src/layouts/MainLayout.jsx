import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/navigation/Sidebar'
import AgentNavPane from '../components/navigation/AgentNavPane'

export default function MainLayout() {
  const location = useLocation()
  const mainRef = useRef(null)
  const showNavPane = location.pathname === '/inventory'

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <Sidebar />
      {showNavPane && <AgentNavPane />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main ref={mainRef} className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
