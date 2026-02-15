import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../components/common'
import { availablePlatforms, connectionFormFields, mockScanResults } from '../data/platforms'
import PlatformLogo from '../components/PlatformLogo'
import { CheckCircleIcon, ChevronRightIcon } from '../components/navigation/Icons'

const steps = ['Select Platform', 'Connection Details', 'Configure Scan', 'Scan & Import']

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            i < currentStep ? 'bg-emerald-100 text-emerald-700' :
            i === currentStep ? 'bg-primary-100 text-primary-700' :
            'bg-slate-100 text-slate-400'
          }`}>
            {i < currentStep ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <span className="w-4 text-center">{i + 1}</span>
            )}
            <span className="hidden sm:inline">{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-px ${i < currentStep ? 'bg-emerald-300' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function StepSelectPlatform({ onSelect, selectedId }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Select a Platform</h2>
      <p className="text-sm text-slate-500 mb-6">Choose the agent framework you want to connect.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availablePlatforms.map((p) => (
          <button
            key={p.id}
            disabled={p.comingSoon}
            onClick={() => onSelect(p.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              p.comingSoon
                ? 'opacity-50 cursor-not-allowed border-slate-100 bg-slate-50'
                : selectedId === p.id
                  ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <PlatformLogo sourceId={p.id} color={p.color} size={32} className="rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                {p.comingSoon && (
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Coming Soon</span>
                )}
              </div>
              {selectedId === p.id && (
                <CheckCircleIcon className="w-5 h-5 text-primary-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepConnectionDetails({ platformId }) {
  const fields = connectionFormFields[platformId] || connectionFormFields.bedrock
  const platform = availablePlatforms.find(p => p.id === platformId)
  const [tested, setTested] = useState(false)

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Connection Details</h2>
      <p className="text-sm text-slate-500 mb-6">Configure the connection to {platform?.name || 'the platform'}.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
          <input
            type="text"
            defaultValue={`${platform?.name || 'Platform'} — Production`}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{fields.endpoint}</label>
          <input
            type="text"
            defaultValue={fields.endpointDefault}
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

        <div className="pt-2">
          <button
            onClick={() => setTested(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tested
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {tested ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Connection Successful
              </>
            ) : (
              'Test Connection'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function StepConfigureScan() {
  const [proactive, setProactive] = useState(true)
  const [frequency, setFrequency] = useState('daily')

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Configure Scanning</h2>
      <p className="text-sm text-slate-500 mb-6">Set up how Mira discovers and monitors agents on this platform.</p>

      <div className="space-y-6">
        <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 bg-white">
          <div className="pr-4">
            <p className="font-semibold text-slate-900 text-sm">Proactive Scan</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Automatically discover new agents and monitor changes. Mira will periodically scan the connected platform for new or updated agents.
            </p>
          </div>
          <button
            onClick={() => setProactive(!proactive)}
            className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${proactive ? 'bg-primary-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${proactive ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {proactive && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Scan Frequency</label>
            <div className="flex gap-2">
              {['hourly', 'daily', 'weekly'].map((f) => (
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
      </div>
    </div>
  )
}

function StepScanResults({ platformId }) {
  const [scanning, setScanning] = useState(true)
  const [progress, setProgress] = useState(0)
  const [selected, setSelected] = useState(new Set())
  const [imported, setImported] = useState(false)

  const results = mockScanResults[platformId] || mockScanResults.bedrock

  useEffect(() => {
    if (!scanning) return
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setScanning(false)
          setSelected(new Set(results.map((_, i) => i)))
          return 100
        }
        return prev + Math.floor(Math.random() * 15) + 8
      })
    }, 300)
    return () => clearInterval(interval)
  }, [scanning, results])

  const toggleAgent = (idx) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === results.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(results.map((_, i) => i)))
    }
  }

  if (imported) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Import Complete</h2>
        <p className="text-sm text-slate-500 mb-8">
          {selected.size} agent{selected.size !== 1 ? 's' : ''} imported successfully. They will appear in your inventory shortly.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/inventory"
            className="px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Go to Inventory
          </Link>
          <Link
            to="/platforms"
            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Back to Platforms
          </Link>
        </div>
      </div>
    )
  }

  if (scanning) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Scanning for Agents</h2>
        <p className="text-sm text-slate-500 mb-6">Discovering agents on the connected platform...</p>
        <div className="max-w-xs mx-auto">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{Math.min(progress, 100)}% complete</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">Discovered Agents</h2>
      <p className="text-sm text-slate-500 mb-6">
        Found {results.length} agent{results.length !== 1 ? 's' : ''}. Select which ones to import into Mira.
      </p>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <input
            type="checkbox"
            checked={selected.size === results.length}
            onChange={toggleAll}
            className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {selected.size} of {results.length} selected
          </span>
        </div>

        {/* Rows */}
        {results.map((agent, idx) => (
          <div
            key={idx}
            onClick={() => toggleAgent(idx)}
            className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors ${
              selected.has(idx) ? 'bg-primary-50/30' : 'hover:bg-slate-50'
            }`}
          >
          <input
            type="checkbox"
            checked={selected.has(idx)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleAgent(idx)}
            className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
          />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{agent.name}</p>
              <p className="text-xs text-slate-500 truncate">{agent.description}</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full">
              {agent.type}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => setImported(true)}
          disabled={selected.size === 0}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selected.size === results.length
            ? `Import All (${results.length} agents)`
            : `Import Selected (${selected.size})`
          }
        </button>
        {selected.size > 0 && selected.size < results.length && (
          <button
            onClick={() => { setSelected(new Set(results.map((_, i) => i))); setImported(true) }}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Import All ({results.length})
          </button>
        )}
      </div>
    </div>
  )
}

export default function AddPlatform() {
  const [step, setStep] = useState(0)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const navigate = useNavigate()

  const canContinue = () => {
    if (step === 0) return selectedPlatform !== null
    return true
  }

  const handleContinue = () => {
    if (step === 2) {
      // "Connect & Scan" — go to step 3
      setStep(3)
    } else if (step < 3) {
      setStep(step + 1)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
          <Link to="/platforms" className="hover:text-slate-200 transition-colors">Platforms</Link>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <span className="text-slate-200">Add Platform</span>
        </div>
        <h1 className="text-2xl font-bold">Add Platform Connection</h1>
        <p className="text-sm text-slate-300 mt-2">
          Connect a new agent platform to discover and import agents into Mira.
        </p>
      </div>

      <Card>
        <StepIndicator currentStep={step} />

        {step === 0 && (
          <StepSelectPlatform
            onSelect={setSelectedPlatform}
            selectedId={selectedPlatform}
          />
        )}
        {step === 1 && <StepConnectionDetails platformId={selectedPlatform} />}
        {step === 2 && <StepConfigureScan />}
        {step === 3 && <StepScanResults platformId={selectedPlatform} />}

        {/* Footer with navigation */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => step === 0 ? navigate('/platforms') : setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleContinue}
              disabled={!canContinue()}
              className="px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 2 ? 'Connect & Scan' : 'Continue'}
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
