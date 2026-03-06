import { useNavigate } from 'react-router-dom'
import agentManagementLogo from '../assets/agent-management-logo.png'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F8F4E4' }}
    >
      <div className="w-full max-w-sm rounded-xl shadow-lg px-10 py-12 flex flex-col items-center bg-white">
        <img src={agentManagementLogo} alt="Dataiku Agent Management" className="h-20 mb-10" />
        <button
          onClick={() => navigate('/')}
          className="w-full py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#3EDAB2', color: '#06312E' }}
        >
          Login with SSO
        </button>
      </div>
    </div>
  )
}
