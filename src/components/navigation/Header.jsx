import { useLocation } from 'react-router-dom'
import { MagnifyingGlassIcon, BellIcon, Cog6ToothIcon } from './Icons'

const pageTitles = {
  '/': { title: 'Dashboard', subtitle: 'Enterprise agent overview' },
  '/inventory': { title: 'Agent Inventory', subtitle: 'All agents across platforms' },
  '/performance/technical': { title: 'Technical Performance', subtitle: 'System health and metrics' },
  '/performance/business': { title: 'Business Performance', subtitle: 'Business outcomes and KPIs' },
  '/behavior/trends': { title: 'Behavior Trends', subtitle: 'Enterprise-wide patterns' },
  '/testing': { title: 'Testing', subtitle: 'Quality assurance and validation' },
  '/governance': { title: 'Governance', subtitle: 'Risk and compliance management' },
}

export default function Header() {
  const location = useLocation()
  const pathKey = location.pathname
  const pageInfo = pageTitles[pathKey] || { title: 'Agent Details', subtitle: 'Agent information' }

  // Handle dynamic routes
  if (pathKey.includes('/agents/') && pathKey.includes('/behavior')) {
    pageInfo.title = 'Agent Behavior'
    pageInfo.subtitle = 'Conversation analysis and topic drift'
  } else if (pathKey.includes('/agents/')) {
    pageInfo.title = 'Agent Details'
    pageInfo.subtitle = 'Performance and configuration'
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h1 className="page-title">{pageInfo.title}</h1>
        <p className="page-subtitle">{pageInfo.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents..."
            className="input pl-10 w-64"
          />
        </div>

        {/* Notifications */}
        <button className="btn-ghost relative p-2">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="btn-ghost p-2">
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
