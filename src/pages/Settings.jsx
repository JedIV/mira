import { useState } from 'react'
import { useDemoMode } from '../contexts/DemoModeContext'
import Platforms from './Platforms'
import RolesManagement from './RolesManagement'

const tabs = [
  { id: 'platforms', label: 'Platforms & Connections' },
  { id: 'access', label: 'Access Control' },
  { id: 'demo', label: 'Demo Mode' },
]

const demoModes = [
  {
    value: 'behavior',
    title: 'Agent Behavior',
    description: 'Drift detection, conversation analysis, topic trends, decision flow diagrams',
  },
  {
    value: 'kpi',
    title: 'Business KPIs',
    description: 'Customer-defined metrics, performance targets, KPI trends over time',
  },
]

function DemoModePanel() {
  const { demoMode, setDemoMode } = useDemoMode()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Demo Narrative</h3>
        <p className="text-sm text-slate-500">Choose the primary lens for the demo. This changes labels, metrics, and page content across the entire app.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {demoModes.map((mode) => {
          const selected = demoMode === mode.value
          return (
            <button
              key={mode.value}
              onClick={() => setDemoMode(mode.value)}
              className={`relative text-left p-5 rounded-lg border-2 transition-all cursor-pointer ${
                selected
                  ? 'border-primary-500 bg-primary-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
              <p className="font-semibold text-slate-900 text-base mb-1">{mode.title}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{mode.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('platforms')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <p className="text-xs uppercase tracking-wider text-primary-300 font-semibold mb-1">Settings</p>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-slate-300 mt-2">
          Manage platform connections, scanning configuration, and role-based access control.
        </p>
      </div>

      {/* Tab Strip */}
      <div className="flex gap-1 border-b border-slate-400/90">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-400/90'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'platforms' && <Platforms />}
      {activeTab === 'access' && <RolesManagement />}
      {activeTab === 'demo' && <DemoModePanel />}
    </div>
  )
}
