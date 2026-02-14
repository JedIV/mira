// Simplified but recognizable platform logos as inline SVGs
// Each logo uses the platform's brand color

const logos = {
  dataiku: ({ size, className }) => (
    <svg viewBox="0 0 99 99" width={size} height={size} className={className} fill="none">
      <path d="M49.971 0.529419C62.834 0.529419 75.1704 5.69168 84.266 14.881C93.3615 24.0702 98.471 36.5338 98.471 49.5294C98.471 59.2206 95.6266 68.6942 90.2972 76.7521C84.9681 84.81 77.3936 91.0912 68.5316 94.7999C59.6694 98.5083 49.9172 99.4786 40.5091 97.588C31.1011 95.697 22.4589 91.0305 15.6761 84.1779C8.8933 77.3252 4.27407 68.5941 2.40268 59.089C0.531294 49.5839 1.49161 39.7312 5.16244 30.7775C8.83332 21.824 15.05 14.1714 23.0257 8.78723C31.0015 3.40305 40.3786 0.529419 49.971 0.529419ZM69.3294 21.5792C67.7976 21.0251 66.1251 21.012 64.5853 21.5431C63.0455 22.0743 61.7302 23.1181 60.8538 24.5031C59.9775 25.888 59.5921 27.5322 59.7611 29.1671L20.763 77.7501C20.7672 77.7678 20.9327 78.4531 21.5179 78.1486C22.4703 77.6219 25.6149 74.1733 38.7982 60.8361C43.2365 56.3519 50.6165 56.7132 50.6712 56.7159H58.2699C68.5085 56.7159 74.2923 46.8074 72.64 35.6827C71.7491 29.797 73.3856 27.5704 73.4124 27.5343L76.6097 23.5773L73.0169 24.5939C72.1612 23.1961 70.8612 22.1334 69.3294 21.5792ZM52.0189 59.4376V63.2491H76.3939V59.4376H52.0189ZM66.9466 25.0079C67.453 25.0128 67.937 25.2196 68.2933 25.5831C68.6499 25.9467 68.8499 26.4376 68.8499 26.9493C68.8499 27.3342 68.7369 27.7107 68.5247 28.0304C68.313 28.35 68.0117 28.5988 67.6595 28.7452C67.3072 28.8917 66.9194 28.929 66.5462 28.8527C66.1728 28.7762 65.8308 28.5888 65.5628 28.3156C65.295 28.0423 65.1134 27.6951 65.0413 27.3175C64.969 26.9396 65.0095 26.548 65.1576 26.1935C65.3059 25.8391 65.5552 25.5374 65.8734 25.3263C66.1918 25.1151 66.5655 25.0043 66.9466 25.0079Z" fill="#2AB1AC"/>
    </svg>
  ),
  bedrock: ({ size, className }) => (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none">
      <rect width="32" height="32" rx="6" fill="#FF9900" />
      <path d="M16 6l10 5.5v9L16 26 6 20.5v-9L16 6z" fill="#fff" opacity="0.9" />
      <path d="M16 6v20M6 11.5L26 20.5M26 11.5L6 20.5" stroke="#FF9900" strokeWidth="1.2" />
    </svg>
  ),
  copilot: ({ size, className }) => (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none">
      <rect width="32" height="32" rx="6" fill="#00A4EF" />
      <path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="12.5" cy="18" r="2.5" fill="#fff" />
      <circle cx="19.5" cy="18" r="2.5" fill="#fff" />
      <path d="M12.5 20.5v2M19.5 20.5v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  servicenow: ({ size, className }) => (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none">
      <rect width="32" height="32" rx="6" fill="#81B5A1" />
      <circle cx="16" cy="16" r="8" fill="#fff" />
      <circle cx="16" cy="16" r="3.5" fill="#81B5A1" />
    </svg>
  ),
  langchain: ({ size, className }) => (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none">
      <rect width="32" height="32" rx="6" fill="#1C3C3C" />
      <path d="M10 22V10l6 4-6 4" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M16 14l6 4-6 4" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  n8n: ({ size, className }) => (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none">
      <rect width="32" height="32" rx="6" fill="#EA4B71" />
      <circle cx="10" cy="16" r="3" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="22" cy="16" r="3" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M13 16h6" stroke="#fff" strokeWidth="2" />
    </svg>
  ),
  snowflake: ({ size, className }) => (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none">
      <rect width="32" height="32" rx="6" fill="#29B5E8" />
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <line x1="16" y1="7" x2="16" y2="25" />
        <line x1="8.2" y1="11.5" x2="23.8" y2="20.5" />
        <line x1="8.2" y1="20.5" x2="23.8" y2="11.5" />
        <line x1="16" y1="7" x2="14" y2="9" />
        <line x1="16" y1="7" x2="18" y2="9" />
        <line x1="16" y1="25" x2="14" y2="23" />
        <line x1="16" y1="25" x2="18" y2="23" />
        <line x1="8.2" y1="11.5" x2="10.5" y2="12.8" />
        <line x1="8.2" y1="11.5" x2="9" y2="14" />
        <line x1="23.8" y1="20.5" x2="21.5" y2="19.2" />
        <line x1="23.8" y1="20.5" x2="23" y2="18" />
        <line x1="8.2" y1="20.5" x2="9" y2="18" />
        <line x1="8.2" y1="20.5" x2="10.5" y2="19.2" />
        <line x1="23.8" y1="11.5" x2="23" y2="14" />
        <line x1="23.8" y1="11.5" x2="21.5" y2="12.8" />
      </g>
    </svg>
  ),
  databricks: ({ size, className }) => (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="none">
      <rect width="32" height="32" rx="6" fill="#FF3621" />
      <path d="M16 7l9 5v3l-9 5-9-5v-3l9-5z" fill="#fff" opacity="0.9" />
      <path d="M16 15l9 5v3l-9 5-9-5v-3l9-5z" fill="#fff" opacity="0.6" />
    </svg>
  ),
}

// Fallback: colored rounded rect with 2-letter abbreviation
function FallbackLogo({ sourceId, color, size, className }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
      <rect width="32" height="32" rx="6" fill={color || '#94A3B8'} />
      <text x="16" y="20" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600" fontFamily="sans-serif">
        {sourceId.slice(0, 2).toUpperCase()}
      </text>
    </svg>
  )
}

export default function PlatformLogo({ sourceId, color, size = 32, className = '' }) {
  const LogoComponent = logos[sourceId]
  if (LogoComponent) {
    return <LogoComponent size={size} className={className} />
  }
  return <FallbackLogo sourceId={sourceId} color={color} size={size} className={className} />
}
