import { LOW_CONFIDENCE } from '../features/documents/catalog'
import type { AnalysisResult } from '../features/documents/types'
import './paper.css'

interface Props {
  result: AnalysisResult
  activeFieldId?: string | null
  onFieldEnter?: (id: string | null) => void
  onFieldSelect?: (id: string) => void
}

/**
 * A reconstruction of the scanned page from the extraction output.
 * Every extracted value is a hotspot linked to its row in the review panel,
 * so reviewers can see exactly where each value came from.
 */
export function DocumentPaper({ result, activeFieldId, onFieldEnter, onFieldSelect }: Props) {
  const paperLang = result.language === 'en' ? 'en' : 'ar'
  const body = result.transcription.find((b) => b.lang === paperLang) ?? result.transcription[0]
  const paragraph = body?.text
    .split('\n\n')
    .filter((p) => !p.includes('\n'))
    .sort((a, b) => b.length - a.length)[0]

  return (
    <article className={`paper paper--${paperLang}`} dir={paperLang === 'ar' ? 'rtl' : 'ltr'} lang={paperLang}>
      <header className="paper__head">
        <div className="paper__emblem" aria-hidden="true">
          <span />
        </div>
        <div className="paper__state">
          <strong className="ar">المملكة الأردنية الهاشمية · وزارة النقل</strong>
          <span>Hashemite Kingdom of Jordan — Ministry of Transport</span>
        </div>
      </header>

      <div className="paper__title">
        <h2>{paperLang === 'ar' ? result.title.ar : result.title.en}</h2>
        <span>{paperLang === 'ar' ? result.title.en : result.title.ar}</span>
      </div>

      <dl className="paper__fields">
        {result.fields.map((f) => {
          const active = activeFieldId === f.id
          const low = f.confidence < LOW_CONFIDENCE && !f.confirmed && f.originalValue === undefined
          return (
            <div className="paper__row" key={f.id}>
              <dt>{paperLang === 'ar' ? f.label.ar : f.label.en}</dt>
              <dd>
                <button
                  type="button"
                  className={`paper__hl${active ? ' is-active' : ''}${low ? ' is-low' : ''}`}
                  dir={f.dir}
                  onMouseEnter={() => onFieldEnter?.(f.id)}
                  onMouseLeave={() => onFieldEnter?.(null)}
                  onFocus={() => onFieldEnter?.(f.id)}
                  onBlur={() => onFieldEnter?.(null)}
                  onClick={() => onFieldSelect?.(f.id)}
                >
                  {f.originalValue ?? f.value}
                </button>
              </dd>
            </div>
          )
        })}
      </dl>

      {paragraph && <p className="paper__body">{paragraph}</p>}

      <footer className="paper__foot">
        <div className="paper__sign">
          <span className="paper__scribble" aria-hidden="true" />
          <span>{paperLang === 'ar' ? 'التوقيع' : 'Signature'}</span>
        </div>
        <div className="paper__stamp ar" aria-hidden="true">
          <span>وزارة النقل</span>
          <small>MINISTRY OF TRANSPORT</small>
        </div>
      </footer>
    </article>
  )
}

/** Grey placeholder page shown while text hasn't been read yet. */
export function PaperSkeleton({ scanning }: { scanning?: boolean }) {
  return (
    <div className={`paper paper--skeleton${scanning ? ' is-scanning' : ''}`} aria-hidden="true">
      <div className="sk sk--c" style={{ width: '45%' }} />
      <div className="sk sk--c" style={{ width: '30%' }} />
      <div className="sk sk--gap" />
      <div className="sk sk--c sk--title" style={{ width: '38%' }} />
      <div className="sk sk--gap" />
      {[70, 55, 62, 48, 66, 52].map((w, i) => (
        <div className="sk-row" key={i}>
          <div className="sk" style={{ width: '22%' }} />
          <div className="sk" style={{ width: `${w * 0.6}%` }} />
        </div>
      ))}
      <div className="sk sk--gap" />
      {[96, 92, 98, 60].map((w, i) => (
        <div className="sk" key={i} style={{ width: `${w}%` }} />
      ))}
      {scanning && <div className="paper__scanbar" />}
    </div>
  )
}
