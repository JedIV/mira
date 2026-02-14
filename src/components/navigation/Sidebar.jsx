import { NavLink, Link } from 'react-router-dom'
import {
  ListBulletIcon,
  CurrencyDollarIcon,
  HeartPulseIcon,
  AlertTriangleIcon,
  Cog6ToothIcon,
  HomeIcon,
} from './Icons'
import dataikuLogo from '../../assets/dataiku-bird-white.svg'

const navigation = [
  { name: 'Overview', href: '/', icon: HomeIcon, end: true },
  { name: 'Inventory', href: '/inventory', icon: ListBulletIcon },
  { name: 'Business Impact', href: '/performance/business', icon: CurrencyDollarIcon },
  { name: 'Health', href: '/performance/technical', icon: HeartPulseIcon },
  { name: 'Risk', href: '/governance', icon: AlertTriangleIcon },
]

export default function Sidebar() {
  return (
    <aside className="w-16 bg-sidebar flex flex-col items-center py-4 flex-shrink-0 border-r border-white/[0.06]">
      {/* Logo */}
      <Link to="/" className="w-10 h-10 rounded-lg flex items-center justify-center mb-6" title="Mira">
        <img src={dataikuLogo} alt="Dataiku" className="w-8 h-8" />
      </Link>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 mb-4" />

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.end}
            title={item.name}
            className={({ isActive }) =>
              `w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 ${
                isActive
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Settings + User */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        <NavLink
          to="/platforms"
          title="Settings"
          className={({ isActive }) =>
            `w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 ${
              isActive
                ? 'bg-primary-500/20 text-primary-300'
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.06]'
            }`
          }
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </NavLink>
        <div
          title="ABC Bank"
          className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center cursor-pointer ring-2 ring-primary-500/20"
        >
          <span className="text-white font-bold text-xs">AB</span>
        </div>
      </div>
    </aside>
  )
}
