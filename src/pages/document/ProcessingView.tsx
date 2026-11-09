import { Check, LoaderCircle } from 'lucide-react'
import { PaperSkeleton } from '../../components/DocumentPaper'
import { TransitLine } from '../../components/TransitLine'
import { STAGE_BY_ID } from '../../features/documents/catalog'
import type { DocRecord } from '../../features/documents/types'
import { useI18n } from '../../i18n/i18n-context'

export function ProcessingView({ doc }: { doc: DocRecord }) {
  const { t, pick } = useI18n()
  const activeIdx = doc.stages.findIndex((s) => s.status === 'active')
  const active = activeIdx >= 0 ? doc.stages[activeIdx] : undefined
  const isImage = doc.previewUrl && doc.mimeType.startsWith('image/')

  return (
    <div className="processing">
      <section className="panel processing__line">
        <div className="processing__status">
          <LoaderCircle size={16} className="spin" aria-hidden="true" />
          <span>
            {active
              ? t('proc.step', { n: activeIdx + 1, total: doc.stages.length, stage: pick(STAGE_BY_ID[active.id].label) })
              : t('proc.queued')}
          </span>
          {active && <span className="processing__desc">{pick(STAGE_BY_ID[active.id].description)}</span>}
        </div>
        <TransitLine stages={doc.stages} />
      </section>

      <div className="processing__body">
        <div className="viewer viewer--processing">
          <div className="viewer__canvas">
            {isImage ? (
              <div className="scan-frame">
                <img src={doc.previewUrl} alt={doc.fileName} />
                <div className="paper__scanbar" />
              </div>
            ) : (
              <PaperSkeleton scanning />
            )}
          </div>
        </div>

        <section className="panel log" aria-live="polite">
          <h2 className="eyebrow">{t('proc.log')}</h2>
          <ol>
            {doc.stages
              .filter((s) => s.status !== 'pending')
              .map((s) => {
                const def = STAGE_BY_ID[s.id]
                return (
                  <li key={s.id} className={`log__item log__item--${s.status}`}>
                    <span className="log__icon">
                      {s.status === 'done' ? <Check size={13} strokeWidth={2.5} /> : <LoaderCircle size={13} className="spin" />}
                    </span>
                    <div className="log__text">
                      <strong>{pick(def.label)}</strong>
                      <span>{s.status === 'done' && s.note ? pick(s.note) : pick(def.description)}</span>
                    </div>
                    <span className="log__time mono">
                      {s.durationMs ? `${(s.durationMs / 1000).toFixed(1)}s` : `${Math.round(s.progress * 100)}%`}
                    </span>
                  </li>
                )
              })}
          </ol>
          <p className="log__foot">{t('proc.hint')}</p>
        </section>
      </div>
    </div>
  )
}
