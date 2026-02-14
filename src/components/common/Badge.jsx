const variants = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  neutral: 'badge-neutral',
  primary: 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/10',
  secondary: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/10',
}

const sizes = {
  sm: 'text-[11px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-emerald-500' :
          variant === 'warning' ? 'bg-amber-500' :
          variant === 'danger' ? 'bg-red-500' :
          variant === 'primary' ? 'bg-primary-500' :
          'bg-slate-400'
        }`} />
      )}
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const config = {
    active: { variant: 'success', label: 'Active', dot: true },
    degraded: { variant: 'warning', label: 'Degraded', dot: true },
    offline: { variant: 'danger', label: 'Offline', dot: true },
    maintenance: { variant: 'neutral', label: 'Maintenance', dot: true },
    healthy: { variant: 'success', label: 'Healthy', dot: true },
    passed: { variant: 'success', label: 'Passed' },
    failed: { variant: 'danger', label: 'Failed' },
    pending: { variant: 'warning', label: 'Pending' },
    approved: { variant: 'success', label: 'Approved' },
    deployed: { variant: 'success', label: 'Deployed' },
    testing: { variant: 'primary', label: 'Testing' },
    'pending-approval': { variant: 'warning', label: 'Pending Approval' },
    'pending-ai': { variant: 'warning', label: 'Pending AI Review' },
    'pending-compliance': { variant: 'warning', label: 'Pending Compliance' },
  }

  const { variant, label, dot } = config[status] || { variant: 'neutral', label: status }

  return <Badge variant={variant} dot={dot}>{label}</Badge>
}
