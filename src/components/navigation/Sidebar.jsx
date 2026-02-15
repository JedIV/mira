import { useState, useRef, useEffect } from 'react'
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
import avatarImg from '../../assets/avatar.jpg'

const navigation = [
  { name: 'Overview', href: '/', icon: HomeIcon, end: true },
  { name: 'Inventory', href: '/inventory', icon: ListBulletIcon },
  { name: 'Business Impact', href: '/performance/business', icon: CurrencyDollarIcon },
  { name: 'Health', href: '/performance/technical', icon: HeartPulseIcon },
  { name: 'Risk', href: '/governance', icon: AlertTriangleIcon },
]

function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full overflow-hidden cursor-pointer ring-2 ring-primary-500/20"
      >
        <img src={avatarImg} alt="Jed" className="w-full h-full object-cover" />
      </button>

      {open && (
        <div className="absolute bottom-0 left-full ml-2 z-50 animate-fade-in">
          <div className="bg-slate-900 rounded-lg shadow-lg border border-white/10 py-2 px-1 min-w-[140px]">
            <div className="px-3 py-1.5 border-b border-white/10 mb-1">
              <p className="text-xs font-semibold text-white">Jed</p>
              <p className="text-[10px] text-slate-400">ABC Bank</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="w-16 bg-sidebar flex flex-col items-center py-4 flex-shrink-0 border-r border-white/[0.06]">
      {/* Logo + Tenant */}
      <Link to="/" className="flex flex-col items-center gap-1.5 mb-5" title="Mira — ABC Bank">
        <img src={dataikuLogo} alt="Dataiku" className="w-8 h-8" />
        <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">ABC</span>
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
        <UserMenu />
      </div>
    </aside>
  )
}
