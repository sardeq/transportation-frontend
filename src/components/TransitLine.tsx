import { Check } from 'lucide-react'
import { STAGE_BY_ID } from '../features/documents/catalog'
import type { StageState } from '../features/documents/types'
import { useI18n } from '../i18n/i18n-context'
import './components.css'

/** How far along the line we are, 0..1, measured between first and last station. */
function lineProgress(stages: StageState[]) {
  const n = stages.length
  if (n < 2) return 0
  const lastDone = stages.findLastIndex((s) => s.status === 'done')
  const active = stages.findIndex((s) => s.status === 'active')
  // Stage i "arrives" at station i, so an active stage travels from station i-1 to i.
  if (active >= 0) return Math.max(0, Math.min(1, (active - 1 + stages[active].progress) / (n - 1)))
  return Math.max(0, lastDone) / (n - 1)
}

/**
 * The analysis pipeline drawn as a transit line: each stage is a station,
 * the train moves as the backend reports progress.
 */
export function TransitLine({ stages, variant = 'full' }: { stages: StageState[]; variant?: 'full' | 'compact' }) {
  const { pick, t } = useI18n()
  const n = stages.length
  const progress = lineProgress(stages)
  const failed = stages.some((s) => s.status === 'error')

  if (variant === 'compact') {
    const done = stages.filter((s) => s.status === 'done').length
    return (
      <div
        className="line line--compact"
        role="img"
        aria-label={t('pipeline.compactLabel', { done, total: n })}
        style={{ ['--n' as string]: n }}
      >
        <span className="line__track" />
        <span className="line__fill" style={{ width: `calc((100% - 100% / var(--n)) * ${progress})` }} />
        {stages.map((s) => (
          <span key={s.id} className={`line__stop line__stop--${s.status}`} />
        ))}
      </div>
    )
  }

  return (
    <ol className={`line line--full${failed ? ' line--failed' : ''}`} style={{ ['--n' as string]: n }}>
      <span className="line__track" aria-hidden="true" />
      <span
        className="line__fill"
        aria-hidden="true"
        style={{ width: `calc((100% - 100% / var(--n)) * ${progress})` }}
      />
      {stages.map((s, i) => {
        const def = STAGE_BY_ID[s.id]
        return (
          <li key={s.id} className={`line__station line__station--${s.status}`} aria-current={s.status === 'active' ? 'step' : undefined}>
            <span className="line__stop" aria-hidden="true">
              {s.status === 'done' ? <Check size={12} strokeWidth={3} /> : <span className="mono">{i + 1}</span>}
            </span>
            <span className="line__label">{pick(def.label)}</span>
            <span className="line__note mono">
              {s.status === 'done' && s.note
                ? pick(s.note)
                : s.status === 'active'
                  ? `${Math.round(s.progress * 100)}%`
                  : ' '}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
