import { NavLink, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  CubeIcon,
  ServerStackIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  ShieldCheckIcon,
} from './Icons'

const navigation = [
  { name: 'Overview', items: [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
  ]},
  { name: 'Agents', items: [
    { name: 'Inventory', href: '/inventory', icon: CubeIcon },
  ]},
  { name: 'Performance', items: [
    { name: 'Technical', href: '/performance/technical', icon: ServerStackIcon },
    { name: 'Business', href: '/performance/business', icon: CurrencyDollarIcon },
  ]},
  { name: 'Intelligence', items: [
    { name: 'Behavior', href: '/agents/cs-agent-001/behavior', icon: ChatBubbleLeftRightIcon },
    { name: 'Trends', href: '/behavior/trends', icon: ArrowTrendingUpIcon },
  ]},
  { name: 'Quality', items: [
    { name: 'Testing', href: '/testing', icon: BeakerIcon },
    { name: 'Governance', href: '/governance', icon: ShieldCheckIcon },
  ]},
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-none">Mira</h1>
            <p className="text-slate-400 text-xs">Agent Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.name}>
            <h2 className="section-title text-slate-500">{section.name}</h2>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                    end={item.href === '/'}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User/Company */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AB</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">ABC Bank</p>
            <p className="text-slate-400 text-xs">Enterprise Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
