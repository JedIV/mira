import { Badge } from './Badge'
import { useDemoMode } from '../../contexts/DemoModeContext'

const behaviorConfig = {
  green: { label: 'Stable', variant: 'success', dotClass: 'bg-emerald-500' },
  yellow: { label: 'Shift Detected', variant: 'warning', dotClass: 'bg-amber-500' },
  red: { label: 'Significant Shift', variant: 'danger', dotClass: 'bg-red-500' },
}

const kpiConfig = {
  green: { label: 'On Target', variant: 'success', dotClass: 'bg-emerald-500' },
  yellow: { label: 'Approaching', variant: 'warning', dotClass: 'bg-amber-500' },
  red: { label: 'Missing Target', variant: 'danger', dotClass: 'bg-red-500' },
}

export default function BusinessImpactBadge({ impact, showLabel = true, className = '' }) {
  const { demoMode } = useDemoMode()
  const configs = demoMode === 'kpi' ? kpiConfig : behaviorConfig
  const config = configs[impact] || configs.yellow

  if (!showLabel) {
    return <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass} ${className}`} />
  }

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  )
}
