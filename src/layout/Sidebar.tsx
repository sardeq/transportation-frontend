import {
  Archive,
  ChartColumn,
  FileUp,
  Landmark,
  LayoutDashboard,
  ListOrdered,
  ScanText,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { CURRENT_USER, useDocuments } from '../features/documents/store-context'
import { useI18n } from '../i18n/i18n-context'
import type { StringKey } from '../i18n/strings'

interface NavItem {
  to: string
  label: StringKey
  icon: LucideIcon
  badge?: 'review' | 'active'
}

const NAV: { section: StringKey; items: NavItem[] }[] = [
  { section: 'nav.overview', items: [{ to: '/', label: 'nav.dashboard', icon: LayoutDashboard }] },
  {
    section: 'nav.documents',
    items: [
      { to: '/upload', label: 'nav.upload', icon: FileUp },
      { to: '/queue', label: 'nav.queue', icon: ListOrdered, badge: 'active' },
      { to: '/review', label: 'nav.review', icon: ScanText, badge: 'review' },
    ],
  },
  {
    section: 'nav.records',
    items: [
      { to: '/archive', label: 'nav.archive', icon: Archive },
      { to: '/search', label: 'nav.search', icon: Search },
      { to: '/reports', label: 'nav.reports', icon: ChartColumn },
    ],
  },
  {
    section: 'nav.admin',
    items: [
      { to: '/transport-bank', label: 'nav.bank', icon: Landmark },
      { to: '/users', label: 'nav.users', icon: Users },
      { to: '/settings', label: 'nav.settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const { t, pick } = useI18n()
  const { docs } = useDocuments()
  const counts = {
    review: docs.filter((d) => d.status === 'review').length,
    active: docs.filter((d) => d.status === 'processing' || d.status === 'queued').length,
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src="/favicon.svg" alt="" width={30} height={30} />
        <div>
          <div className="sidebar__name serif">{t('app.name')}</div>
          <div className="sidebar__sub">{t('app.tagline')}</div>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label={t('nav.label')}>
        {NAV.map((group) => (
          <div className="sidebar__group" key={group.section}>
            <div className="eyebrow sidebar__section">{t(group.section)}</div>
            {group.items.map(({ to, label, icon: Icon, badge }) => {
              const count = badge ? counts[badge] : 0
              return (
                <NavLink key={to} to={to} end={to === '/'} className="sidebar__link">
                  <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
                  <span>{t(label)}</span>
                  {count > 0 && (
                    <span className={`sidebar__badge mono${badge === 'active' ? ' sidebar__badge--live' : ''}`}>{count}</span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar__user">
        <span className="avatar">{CURRENT_USER.initials}</span>
        <div>
          <div className="sidebar__user-name">{pick(CURRENT_USER.name)}</div>
          <div className="sidebar__sub">{pick(CURRENT_USER.role)}</div>
        </div>
      </div>
    </aside>
  )
}
