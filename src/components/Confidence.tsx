import { LOW_CONFIDENCE } from '../features/documents/catalog'
import { useI18n } from '../i18n/i18n-context'
import './components.css'

function confidenceTone(value: number): 'high' | 'mid' | 'low' {
  if (value < LOW_CONFIDENCE) return 'low'
  if (value < 0.9) return 'mid'
  return 'high'
}

/** Compact "96% ▬▬▬▬▭" readout used in tables and field rows. */
export function Confidence({ value, bar = true }: { value: number; bar?: boolean }) {
  const { t, formatPct } = useI18n()
  const tone = confidenceTone(value)
  return (
    <span className={`conf conf--${tone}`} title={t('conf.title', { pct: formatPct(value) })}>
      {bar && (
        <span className="conf__bar" aria-hidden="true">
          <span style={{ width: `${Math.round(value * 100)}%` }} />
        </span>
      )}
      <span className="conf__num mono">{formatPct(value)}</span>
    </span>
  )
}
