import type { DocStatus } from '../features/documents/types'
import { useI18n } from '../i18n/i18n-context'
import './components.css'

export function StatusChip({ status }: { status: DocStatus }) {
  const { t } = useI18n()
  return (
    <span className={`chip chip--${status}`}>
      <span className="chip__dot" aria-hidden="true" />
      {t(`status.${status}`)}
    </span>
  )
}
