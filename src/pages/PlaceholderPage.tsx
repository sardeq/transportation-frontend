import { FileUp, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '../components/PageHeader'
import { useI18n } from '../i18n/i18n-context'
import type { StringKey } from '../i18n/strings'

interface Props {
  title: StringKey
  /** Sentence describing what this page will hold. */
  plan: StringKey
  icon: LucideIcon
  /** Planned features, shown as small tags. */
  upcoming?: StringKey[]
  children?: ReactNode
}

/** Stand-in for sections not built yet. */
export function PlaceholderPage({ title, plan, icon: Icon, upcoming = [], children }: Props) {
  const { t } = useI18n()
  return (
    <>
      <PageHeader title={t(title)} subtitle={t(plan)} />
      <section className="placeholder">
        <div className="placeholder__inner">
          <span className="placeholder__icon">
            <Icon size={20} strokeWidth={1.75} />
          </span>
          <p className="placeholder__title">{t('placeholder.thisIs', { page: t(title) })}</p>
          <p>{t('placeholder.comingSoon')}</p>
          {upcoming.length > 0 && (
            <ul className="placeholder__list">
              {upcoming.map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          )}
          {children ?? (
            <div className="placeholder__actions">
              <Link to="/upload" className="btn btn--sm">
                <FileUp size={15} />
                {t('placeholder.goUpload')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
