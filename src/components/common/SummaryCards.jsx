import { Link } from 'react-router-dom'
import { Card } from './Card'

/**
 * Reusable top-of-page summary cards for Operational Health and Business Impact.
 *
 * @param {Array} items - Array of { key, label, subtitle, count, cardClass, textClass, dotClass, linkTo }
 */
export default function SummaryCards({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link key={item.key} to={item.linkTo}>
          <div className={`bg-white rounded-lg border shadow-card ${item.cardClass} hover:shadow-md transition-shadow cursor-pointer p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.dotClass}`} />
                <p className={`font-semibold ${item.textClass}`}>{item.label}</p>
              </div>
              <p className={`text-2xl font-bold ${item.textClass}`}>{item.count.toLocaleString()}</p>
            </div>
            <p className="text-sm text-slate-600">{item.subtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
