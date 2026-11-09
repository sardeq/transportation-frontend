import { FileUp, LayoutDashboard, ScanText } from 'lucide-react'
import { Link } from 'react-router'
import { useDocuments } from '../features/documents/store-context'
import { useI18n } from '../i18n/i18n-context'
import { PlaceholderPage } from './PlaceholderPage'

export function DashboardPage() {
  const { t } = useI18n()
  const { docs } = useDocuments()
  const waiting = docs.filter((d) => d.status === 'review').length

  return (
    <PlaceholderPage
      title="page.dashboard"
      plan="plan.dashboard"
      icon={LayoutDashboard}
      upcoming={['up.kpis', 'up.volume', 'up.categories', 'up.accuracy']}
    >
      <div className="placeholder__actions">
        <Link to="/upload" className="btn btn--primary btn--sm">
          <FileUp size={15} />
          {t('dash.upload')}
        </Link>
        {waiting > 0 && (
          <Link to="/review" className="btn btn--sm">
            <ScanText size={15} />
            {t('dash.review', { n: waiting })}
          </Link>
        )}
      </div>
    </PlaceholderPage>
  )
}
