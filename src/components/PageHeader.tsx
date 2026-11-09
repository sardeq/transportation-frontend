import type { ReactNode } from 'react'
import './components.css'

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="eyebrow page-head__eyebrow">{eyebrow}</div>}
        <h1 className="page-head__title">{title}</h1>
        {subtitle && <p className="page-head__sub">{subtitle}</p>}
      </div>
      {actions && <div className="page-head__actions">{actions}</div>}
    </div>
  )
}
