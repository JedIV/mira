import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/navigation/Sidebar'
import AgentNavPane from '../components/navigation/AgentNavPane'

const showNavPaneRoutes = ['/inventory', '/agents/']

export default function MainLayout() {
  const location = useLocation()
  const showNavPane = showNavPaneRoutes.some(route => location.pathname.startsWith(route))

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      {showNavPane && <AgentNavPane />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
