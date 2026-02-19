import { useNavigate } from 'react-router-dom'
import dataikuLogo from '../assets/dataiku-logo-full.png'

export default function Login() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:wght@300&family=Roboto:wght@400;500&display=swap');
      `}</style>
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F8F4E4' }}
      >
        <div
          className="w-full max-w-sm rounded-2xl shadow-lg px-10 py-12 flex flex-col items-center"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <img src={dataikuLogo} alt="Dataiku" className="h-10 mb-6" />
          <h1
            className="text-3xl font-light mb-1"
            style={{ fontFamily: "'Spectral', serif", color: '#06312E' }}
          >
            Agent Management
          </h1>
          <p
            className="text-sm mb-8"
            style={{ fontFamily: "'Roboto', sans-serif", color: '#6B7280' }}
          >
            Sign in to continue
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#3EDAB2',
              color: '#06312E',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Login with SSO
          </button>
        </div>
      </div>
    </>
  )
}
