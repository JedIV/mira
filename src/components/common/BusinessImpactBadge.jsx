import { Badge } from './Badge'

const impactConfig = {
  green: {
    label: 'Stable',
    variant: 'success',
    dotClass: 'bg-emerald-500',
  },
  yellow: {
    label: 'Shift Detected',
    variant: 'warning',
    dotClass: 'bg-amber-500',
  },
  red: {
    label: 'Significant Shift',
    variant: 'danger',
    dotClass: 'bg-red-500',
  },
}

export default function BusinessImpactBadge({ impact, showLabel = true, className = '' }) {
  const config = impactConfig[impact] || impactConfig.yellow

  if (!showLabel) {
    return <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass} ${className}`} />
  }

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  )
}
