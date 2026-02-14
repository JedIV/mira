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
import Platforms from './pages/Platforms'
import AddPlatform from './pages/AddPlatform'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<AgentInventory />} />
        <Route path="performance/technical" element={<TechnicalPerformance />} />
        <Route path="performance/business" element={<BusinessPerformance />} />
        <Route path="agents/:agentId" element={<AgentDetail />} />
        <Route path="agents/:agentId/behavior" element={<AgentBehavior />} />
        <Route path="agents/:agentId/logs" element={<AgentLogs />} />
        <Route path="behavior/trends" element={<BehaviorTrends />} />
        <Route path="testing" element={<Testing />} />
        <Route path="governance" element={<Governance />} />
        <Route path="platforms" element={<Platforms />} />
        <Route path="platforms/add" element={<AddPlatform />} />
      </Route>
    </Routes>
  )
}

export default App
