import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../components/common'
import { connectedPlatforms } from '../data/platforms'
import PlatformLogo from '../components/PlatformLogo'
import { ChevronRightIcon } from '../components/navigation/Icons'

const statusConfig = {
  connected: { label: 'Connected', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  syncing: { label: 'Syncing', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500 animate-pulse' },
  error: { label: 'Error', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.connected
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function ToggleSwitch({ enabled }) {
  return (
    <div className={`relative w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-slate-200'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </div>
  )
}

function PlatformCard({ platform }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformLogo sourceId={platform.id} color={platform.color} size={36} className="rounded-lg" />
          <div>
            <h3 className="font-semibold text-slate-900">{platform.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{platform.endpoint}</p>
          </div>
        </div>
        <StatusBadge status={platform.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-400">Agents</p>
          <p className="text-lg font-bold text-slate-900">{platform.agentCount}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Last Scan</p>
          <p className="text-sm font-medium text-slate-700">{platform.lastScan}</p>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <ToggleSwitch enabled={platform.proactiveScan} />
          <span className="text-xs text-slate-500">Proactive Scan</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-100">
        <button className="flex-1 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
          Rescan Now
        </button>
        <Link
          to={`/inventory?platform=${platform.id}`}
          className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          View Agents
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  )
}

export default function Platforms() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-300 font-semibold mb-1">Settings</p>
            <h1 className="text-2xl font-bold">Platforms & Connections</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Manage connected agent platforms, configure scanning, and add new integrations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectedPlatforms.map((platform) => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}

        {/* Add Platform CTA */}
        <Link
          to="/platforms/add"
          className="card flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50/30 transition-all group min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-slate-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700 group-hover:text-primary-700 transition-colors">Add Platform</p>
            <p className="text-sm text-slate-400 mt-1">Connect a new agent framework</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
