import { Archive, Check, CircleCheck, FileImage, Minus, Plus, RotateCcw, ScanText, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Confidence } from '../../components/Confidence'
import { DocumentPaper } from '../../components/DocumentPaper'
import { LanguageTag } from '../../components/LanguageTag'
import { CATEGORIES } from '../../features/documents/catalog'
import { needsAttention, isLowConfidence } from '../../features/documents/selectors'
import { useDocuments } from '../../features/documents/store-context'
import type { CategoryId, DocRecord } from '../../features/documents/types'
import { useI18n } from '../../i18n/i18n-context'
import type { StringKey } from '../../i18n/strings'
import { FieldRow } from './FieldRow'
import { DetailsTab, EntitiesTab, TranscriptTab } from './InfoTabs'

type Tab = 'fields' | 'text' | 'entities' | 'details'
const TABS: { id: Tab; label: StringKey }[] = [
  { id: 'fields', label: 'tab.fields' },
  { id: 'text', label: 'tab.text' },
  { id: 'entities', label: 'tab.entities' },
  { id: 'details', label: 'tab.details' },
]

const REJECT_REASONS: StringKey[] = ['reject.illegible', 'reject.wrongType', 'reject.missingPages', 'reject.duplicate']
const ZOOMS = [0.5, 0.6, 0.75, 0.9, 1, 1.15, 1.3]
/** Start small enough that the page fits on phones. */
const initialZoom = () => (window.innerWidth < 720 ? 0 : 3)

export function ReviewWorkspace({ doc }: { doc: DocRecord }) {
  const { t, pick } = useI18n()
  const api = useDocuments()
  const navigate = useNavigate()
  const result = doc.result!
  const readOnly = doc.status !== 'review'

  const [tab, setTab] = useState<Tab>('fields')
  const [hovered, setHovered] = useState<string | null>(null)
  const [onlyFlagged, setOnlyFlagged] = useState(false)
  const [view, setView] = useState<'layout' | 'original'>(doc.previewUrl ? 'original' : 'layout')
  const [zoomIdx, setZoomIdx] = useState(initialZoom)
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState<StringKey>(REJECT_REASONS[0])
  const [savedAt, setSavedAt] = useState<number | null>(null)

  useEffect(() => {
    if (savedAt === null) return
    const timer = setTimeout(() => setSavedAt(null), 2200)
    return () => clearTimeout(timer)
  }, [savedAt])

  const remaining = result.fields.filter(needsAttention).length
  const lowTotal = result.fields.filter(isLowConfidence).length
  const editedCount = result.fields.filter((f) => f.originalValue !== undefined).length
  const fields = onlyFlagged ? result.fields.filter(isLowConfidence) : result.fields

  /** Clicking a value on the page jumps to its field. */
  const selectField = (id: string) => {
    setTab('fields')
    setOnlyFlagged(false)
    requestAnimationFrame(() => {
      document.getElementById(`row-${id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      document.getElementById(`field-${id}`)?.focus({ preventScroll: true })
    })
  }

  const approve = () => {
    api.approve(doc.id)
  }

  return (
    <div className="workspace">
      {/* ---------------- Viewer ---------------- */}
      <section className="viewer" aria-label={t('viewer.label')}>
        <div className="viewer__bar">
          {doc.previewUrl ? (
            <div className="segmented">
              <button type="button" aria-pressed={view === 'original'} onClick={() => setView('original')}>
                <FileImage size={14} />
                {t('viewer.original')}
              </button>
              <button type="button" aria-pressed={view === 'layout'} onClick={() => setView('layout')}>
                <ScanText size={14} />
                {t('viewer.layout')}
              </button>
            </div>
          ) : (
            <span className="viewer__legend">
              <i className="viewer__swatch" />
              {t('viewer.detected')}
              <i className="viewer__swatch viewer__swatch--low" />
              {t('viewer.lowConf')}
            </span>
          )}
          {view === 'layout' && (
            <div className="viewer__zoom">
              <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={() => setZoomIdx((z) => Math.max(0, z - 1))}
                disabled={zoomIdx === 0}
                aria-label={t('viewer.zoomOut')}
              >
                <Minus size={15} />
              </button>
              <span className="mono">{Math.round(ZOOMS[zoomIdx] * 100)}%</span>
              <button
                type="button"
                className="btn btn--ghost btn--icon"
                onClick={() => setZoomIdx((z) => Math.min(ZOOMS.length - 1, z + 1))}
                disabled={zoomIdx === ZOOMS.length - 1}
                aria-label={t('viewer.zoomIn')}
              >
                <Plus size={15} />
              </button>
            </div>
          )}
        </div>

        <div className="viewer__canvas">
          {view === 'original' && doc.previewUrl ? (
            doc.mimeType.startsWith('image/') && doc.mimeType !== 'image/tiff' ? (
              <img className="viewer__img" src={doc.previewUrl} alt={doc.fileName} />
            ) : doc.mimeType === 'application/pdf' ? (
              <iframe className="viewer__pdf" src={doc.previewUrl} title={doc.fileName} />
            ) : (
              <p className="viewer__nopreview">{t('viewer.noPreview')}</p>
            )
          ) : (
            <div style={{ zoom: ZOOMS[zoomIdx] }}>
              <DocumentPaper result={result} activeFieldId={hovered} onFieldEnter={setHovered} onFieldSelect={selectField} />
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Analysis panel ---------------- */}
      <section className="panel analysis" aria-label={t('analysis.label')}>
        <div className="summary">
          <div className="summary__row">
            <label className="field-label" htmlFor="doc-category">
              {t('analysis.type')}
            </label>
            <div className="summary__cat">
              <select
                id="doc-category"
                className="select"
                value={result.category}
                disabled={readOnly}
                onChange={(e) => api.setCategory(doc.id, e.target.value as CategoryId)}
              >
                {Object.entries(CATEGORIES).map(([id, label]) => (
                  <option key={id} value={id}>
                    {pick(label)}
                  </option>
                ))}
              </select>
              <Confidence value={result.categoryConfidence} bar={false} />
            </div>
          </div>
          <dl className="summary__stats">
            <div>
              <dt>{t('analysis.language')}</dt>
              <dd>
                <LanguageTag lang={result.language} />
              </dd>
            </div>
            <div>
              <dt>{t('analysis.pages')}</dt>
              <dd className="mono">{result.pageCount}</dd>
            </div>
            <div>
              <dt>{t('analysis.overall')}</dt>
              <dd>
                <Confidence value={result.overallConfidence} />
              </dd>
            </div>
          </dl>
        </div>

        <div className="tabs" role="tablist" aria-label={t('analysis.label')}>
          {TABS.map((tb) => (
            <button
              key={tb.id}
              type="button"
              role="tab"
              aria-selected={tab === tb.id}
              className="tabs__tab"
              onClick={() => setTab(tb.id)}
            >
              {t(tb.label)}
              {tb.id === 'fields' && remaining > 0 && !readOnly && <span className="flag-count">{remaining}</span>}
            </button>
          ))}
        </div>

        <div className="analysis__scroll">
          {tab === 'fields' && (
            <div className="tabpane">
              <div className="fields-head">
                <p className={`fields-head__status${remaining === 0 ? ' is-done' : ''}`}>
                  {remaining === 0 ? (
                    <>
                      <CircleCheck size={15} />
                      {t('fields.allChecked')}
                    </>
                  ) : (
                    t('fields.remaining', { n: remaining, total: lowTotal })
                  )}
                </p>
                {lowTotal > 0 && (
                  <label className="toggle">
                    <input type="checkbox" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} />
                    {t('fields.onlyFlagged')}
                  </label>
                )}
              </div>
              {fields.map((f) => (
                <FieldRow
                  key={f.id}
                  field={f}
                  readOnly={readOnly}
                  active={hovered === f.id}
                  onActivate={setHovered}
                  onChange={(v) => api.updateField(doc.id, f.id, v)}
                  onConfirm={(c) => api.confirmField(doc.id, f.id, c)}
                />
              ))}
            </div>
          )}
          {tab === 'text' && <TranscriptTab doc={doc} />}
          {tab === 'entities' && <EntitiesTab doc={doc} />}
          {tab === 'details' && <DetailsTab doc={doc} />}
        </div>

        {/* ---------------- Decision bar ---------------- */}
        <footer className="decision">
          {doc.status === 'approved' && (
            <div className="decision__banner decision__banner--ok">
              <Archive size={16} />
              <div>
                <strong>{t('decision.approvedTitle')}</strong>
                <span>{t('decision.approvedBody')}</span>
              </div>
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => api.reopen(doc.id)}>
                <RotateCcw size={14} />
                {t('decision.reopen')}
              </button>
            </div>
          )}

          {doc.status === 'rejected' && (
            <div className="decision__banner decision__banner--bad">
              <X size={16} />
              <div>
                <strong>{t('decision.rejectedTitle')}</strong>
                <span>{doc.rejectionReason}</span>
              </div>
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => api.reopen(doc.id)}>
                <RotateCcw size={14} />
                {t('decision.reopen')}
              </button>
            </div>
          )}

          {doc.status === 'review' && rejecting && (
            <div className="decision__reject">
              <label className="field-label" htmlFor="reject-reason">
                {t('reject.label')}
              </label>
              <select
                id="reject-reason"
                className="select"
                value={reason}
                onChange={(e) => setReason(e.target.value as StringKey)}
              >
                {REJECT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {t(r)}
                  </option>
                ))}
              </select>
              <div className="decision__row">
                <button type="button" className="btn btn--ghost" onClick={() => setRejecting(false)}>
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => {
                    api.reject(doc.id, t(reason))
                    setRejecting(false)
                  }}
                >
                  {t('reject.confirm')}
                </button>
              </div>
            </div>
          )}

          {doc.status === 'review' && !rejecting && (
            <>
              <p className={`decision__hint${remaining > 0 ? ' is-blocked' : ''}`}>
                {remaining > 0
                  ? t('decision.blocked', { n: remaining })
                  : editedCount > 0
                    ? t('decision.readyEdited', { n: editedCount })
                    : t('decision.ready')}
                {savedAt && <span className="decision__saved"> · {t('decision.saved')}</span>}
              </p>
              <div className="decision__row">
                <button type="button" className="btn btn--danger" onClick={() => setRejecting(true)}>
                  {t('decision.reject')}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    api.saveDraft(doc.id)
                    setSavedAt(Date.now())
                  }}
                >
                  {t('decision.save')}
                </button>
                <button type="button" className="btn btn--primary decision__approve" disabled={remaining > 0} onClick={approve}>
                  <Check size={16} />
                  {t('decision.approve')}
                </button>
              </div>
            </>
          )}

          {doc.status !== 'review' && (
            <button type="button" className="btn btn--sm btn--ghost decision__next" onClick={() => navigate('/review')}>
              {t('decision.next')}
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}
