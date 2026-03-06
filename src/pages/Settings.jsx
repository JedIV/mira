import { useState } from 'react'
import Platforms from './Platforms'
import RolesManagement from './RolesManagement'

const tabs = [
  { id: 'platforms', label: 'Platforms & Connections' },
  { id: 'access', label: 'Access Control' },
]

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
    </div>
  )
}
