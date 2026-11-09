import type { DocLanguage } from '../features/documents/types'
import { useI18n } from '../i18n/i18n-context'
import './components.css'

export function LanguageTag({ lang }: { lang?: DocLanguage }) {
  const { t } = useI18n()
  if (!lang) return <span className="muted">—</span>
  return <span className="lang-tag">{t(`lang.${lang}`)}</span>
}
