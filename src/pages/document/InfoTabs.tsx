import { Copy } from 'lucide-react'
import { Confidence } from '../../components/Confidence'
import { DEPARTMENTS, ENTITY_TYPES, STAGE_BY_ID } from '../../features/documents/catalog'
import type { DocRecord, EntityType } from '../../features/documents/types'
import { useI18n } from '../../i18n/i18n-context'
import type { StringKey } from '../../i18n/strings'
import { formatBytes } from '../../lib/format'

export function TranscriptTab({ doc }: { doc: DocRecord }) {
  const { t } = useI18n()
  const blocks = doc.result?.transcription ?? []
  return (
    <div className="tabpane">
      {blocks.map((b) => (
        <section key={b.lang} className="transcript">
          <header>
            <h3 className="eyebrow">{t(b.lang === 'ar' ? 'text.arabic' : 'text.english')}</h3>
            <Confidence value={b.confidence} bar={false} />
            <button
              type="button"
              className="btn btn--ghost btn--icon"
              aria-label={t('text.copy')}
              title={t('text.copy')}
              onClick={() => navigator.clipboard?.writeText(b.text).catch(() => {})}
            >
              <Copy size={14} />
            </button>
          </header>
          <p dir={b.lang === 'ar' ? 'rtl' : 'ltr'} lang={b.lang} className={b.lang === 'ar' ? 'ar' : ''}>
            {b.text}
          </p>
        </section>
      ))}
    </div>
  )
}

export function EntitiesTab({ doc }: { doc: DocRecord }) {
  const { pick, t } = useI18n()
  const groups = new Map<EntityType, string[]>()
  for (const e of doc.result?.entities ?? []) groups.set(e.type, [...(groups.get(e.type) ?? []), e.value])

  return (
    <div className="tabpane">
      {[...groups].map(([type, values]) => (
        <section key={type} className="entities">
          <h3 className="eyebrow">{pick(ENTITY_TYPES[type])}</h3>
          <ul>
            {values.map((v) => (
              <li key={v} dir="auto">
                {v}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {doc.result && doc.result.keywords.length > 0 && (
        <section className="entities">
          <h3 className="eyebrow">{t('ent.keywords')}</h3>
          <ul className="entities--keywords">
            {doc.result.keywords.map((k) => (
              <li key={k} dir="auto">
                {k}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

const HISTORY_LABEL: Record<DocRecord['history'][number]['kind'], StringKey> = {
  uploaded: 'hist.uploaded',
  processing_started: 'hist.processing_started',
  processing_done: 'hist.processing_done',
  edited: 'hist.edited',
  approved: 'hist.approved',
  rejected: 'hist.rejected',
  draft_saved: 'hist.draft_saved',
}

export function DetailsTab({ doc }: { doc: DocRecord }) {
  const { t, pick, formatDate } = useI18n()
  const r = doc.result
  if (!r) return null
  const dep = doc.meta.department ? DEPARTMENTS[doc.meta.department] : undefined

  return (
    <div className="tabpane">
      <section className="details">
        <h3 className="eyebrow">{t('det.file')}</h3>
        <dl>
          <dt>{t('det.name')}</dt>
          <dd dir="auto">{doc.fileName}</dd>
          <dt>{t('det.size')}</dt>
          <dd className="mono">{formatBytes(doc.fileSize)}</dd>
          <dt>{t('det.pages')}</dt>
          <dd className="mono">{r.pageCount}</dd>
          <dt>{t('det.department')}</dt>
          <dd>{dep ? pick(dep) : '—'}</dd>
        </dl>
      </section>

      <section className="details">
        <h3 className="eyebrow">{t('det.preprocessing')}</h3>
        <dl>
          <dt>{t('det.deskew')}</dt>
          <dd className="mono">{r.preprocessing.deskewDeg}°</dd>
          <dt>{t('det.noise')}</dt>
          <dd className="mono">−{r.preprocessing.noiseReductionPct}%</dd>
          <dt>{t('det.contrast')}</dt>
          <dd className="mono">+{r.preprocessing.contrastGainPct}%</dd>
          <dt>{t('det.dpi')}</dt>
          <dd className="mono">{r.preprocessing.dpi} dpi</dd>
        </dl>
      </section>

      <section className="details">
        <h3 className="eyebrow">{t('det.layout')}</h3>
        <dl>
          <dt>{t('det.regions')}</dt>
          <dd className="mono">{r.layout.textRegions}</dd>
          <dt>{t('det.tables')}</dt>
          <dd className="mono">{r.layout.tables}</dd>
          <dt>{t('det.stamps')}</dt>
          <dd className="mono">{r.layout.stamps}</dd>
          <dt>{t('det.signatures')}</dt>
          <dd className="mono">{r.layout.signatures}</dd>
        </dl>
      </section>

      <section className="details">
        <h3 className="eyebrow">{t('det.timings')}</h3>
        <dl>
          {doc.stages.map((s) => (
            <div key={s.id} className="details__pair">
              <dt>{pick(STAGE_BY_ID[s.id].label)}</dt>
              <dd className="mono">{s.durationMs ? `${(s.durationMs / 1000).toFixed(1)}s` : '—'}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="details">
        <h3 className="eyebrow">{t('det.history')}</h3>
        <ol className="history">
          {[...doc.history].reverse().map((h, i) => (
            <li key={i} className={`history__item history__item--${h.kind}`}>
              <span>
                {t(HISTORY_LABEL[h.kind])}
                {h.actor && <em> · {h.actor}</em>}
              </span>
              {h.detail && <span className="history__detail">{h.detail}</span>}
              <time className="mono">{formatDate(h.at, true)}</time>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
