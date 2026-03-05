import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import AgentInventory from './pages/AgentInventory'
import TechnicalPerformance from './pages/TechnicalPerformance'
import BusinessPerformance from './pages/BusinessPerformance'
import AgentDetail from './pages/AgentDetail'
import AgentBehavior from './pages/AgentBehavior'
import AgentLogs from './pages/AgentLogs'
import BehaviorTrends from './pages/BehaviorTrends'
import Testing from './pages/Testing'
import Governance from './pages/Governance'
import AgentAccess from './pages/AgentAccess'
import Settings from './pages/Settings'
import AddPlatform from './pages/AddPlatform'
import Login from './pages/Login'
import Script from './pages/Script'

function App() {
  return (
    <Routes>
      <Route path="/script" element={<Script />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<AgentInventory />} />
        <Route path="performance/operational" element={<TechnicalPerformance />} />
        <Route path="performance/business" element={<BusinessPerformance />} />
        <Route path="agents/:agentId" element={<AgentDetail />} />
        <Route path="agents/:agentId/behavior" element={<AgentBehavior />} />
        <Route path="agents/:agentId/logs" element={<AgentLogs />} />
        <Route path="agents/:agentId/access" element={<AgentAccess />} />
        <Route path="usage-trends" element={<BehaviorTrends />} />
        <Route path="testing" element={<Testing />} />
        <Route path="governance" element={<Governance />} />
        <Route path="settings" element={<Settings />} />
        <Route path="platforms/add" element={<AddPlatform />} />
      </Route>
    </Routes>
  )
}

export default App
