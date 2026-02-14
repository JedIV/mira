import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/common'
import { connectedPlatforms, connectionFormFields } from '../data/platforms'
import PlatformLogo from '../components/PlatformLogo'
import { ChevronRightIcon } from '../components/navigation/Icons'

const statusConfig = {
  connected: { label: 'Connected', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  syncing: { label: 'Syncing', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500 animate-pulse' },
  scanning: { label: 'Scanning', bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500 animate-pulse' },
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

function ToggleSwitch({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}

function EditModal({ platform, onClose }) {
  const fields = connectionFormFields[platform.id] || connectionFormFields.bedrock
  const [tab, setTab] = useState('connection')
  const [proactive, setProactive] = useState(platform.proactiveScan)
  const [frequency, setFrequency] = useState('daily')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => onClose(), 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <PlatformLogo sourceId={platform.id} color={platform.color} size={28} className="rounded-lg" />
            <h2 className="font-bold text-slate-900">{platform.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4">
          {['connection', 'scanning'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t === 'connection' ? 'Connection Details' : 'Scan Configuration'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {tab === 'connection' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  defaultValue={`${platform.name} — Production`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{fields.endpoint}</label>
                <input
                  type="text"
                  defaultValue={platform.endpoint}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{fields.authLabel}</label>
                <input
                  type="password"
                  defaultValue={fields.authDefault}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                />
              </div>
            </>
          )}

          {tab === 'scanning' && (
            <>
              <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="pr-4">
                  <p className="font-semibold text-slate-900 text-sm">Proactive Scan</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Automatically discover new agents and monitor changes on this platform.
                  </p>
                </div>
                <ToggleSwitch enabled={proactive} onToggle={() => setProactive(!proactive)} />
              </div>

              {proactive && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Scan Frequency</label>
                  <div className="flex gap-2">
                    {['hourly', 'daily', 'weekly'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFrequency(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                          frequency === f
                            ? 'bg-primary-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {saved ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Saved
              </span>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PlatformCard({ platform }) {
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState(platform.lastScan)
  const [agentCount, setAgentCount] = useState(platform.agentCount)
  const [proactive, setProactive] = useState(platform.proactiveScan)
  const [editing, setEditing] = useState(false)

  const handleRescan = () => {
    if (scanning) return
    setScanning(true)
    const duration = 2000 + Math.random() * 1500
    setTimeout(() => {
      setScanning(false)
      setLastScan('Just now')
      setAgentCount(prev => prev + Math.floor(Math.random() * 3))
    }, duration)
  }

  const displayStatus = scanning ? 'scanning' : platform.status

  return (
    <>
      <Card className="flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <PlatformLogo sourceId={platform.id} color={platform.color} size={36} className="rounded-lg" />
            <div>
              <h3 className="font-semibold text-slate-900">{platform.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{platform.endpoint}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              title="Edit connection"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </button>
            <StatusBadge status={displayStatus} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate-400">Agents</p>
            <p className="text-lg font-bold text-slate-900">{agentCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Last Scan</p>
            <p className="text-sm font-medium text-slate-700">{lastScan}</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <ToggleSwitch enabled={proactive} onToggle={() => setProactive(!proactive)} />
            <span className="text-xs text-slate-500">Proactive Scan</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-100">
          <button
            onClick={handleRescan}
            disabled={scanning}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              scanning
                ? 'bg-primary-100 text-primary-400 cursor-not-allowed'
                : 'text-primary-600 bg-primary-50 hover:bg-primary-100'
            }`}
          >
            {scanning && (
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {scanning ? 'Scanning...' : 'Rescan Now'}
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

      {editing && <EditModal platform={platform} onClose={() => setEditing(false)} />}
    </>
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
