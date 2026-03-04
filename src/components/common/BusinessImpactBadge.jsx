import { Badge } from './Badge'

const impactConfig = {
  green: {
    label: 'On Track',
    variant: 'success',
    dotClass: 'bg-emerald-500',
  },
  yellow: {
    label: 'Needs Attention',
    variant: 'warning',
    dotClass: 'bg-amber-500',
  },
  red: {
    label: 'Critical',
    variant: 'danger',
    dotClass: 'bg-red-500',
  },
  gray: {
    label: 'No KPIs',
    variant: 'secondary',
    dotClass: 'bg-slate-400',
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
