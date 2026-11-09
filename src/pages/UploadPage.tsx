import { ArrowRight, FileImage, FileText, ScanText, Sparkles, Upload, X } from 'lucide-react'
import { useId, useRef, useState, type DragEvent } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../components/PageHeader'
import { CATEGORIES, DEPARTMENTS, STAGES } from '../features/documents/catalog'
import { useDocuments, type SubmitInput } from '../features/documents/store-context'
import type { CategoryId } from '../features/documents/types'
import { useI18n } from '../i18n/i18n-context'
import { formatBytes } from '../lib/format'
import './upload.css'

const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']
const ACCEPT_EXT = /\.(pdf|jpe?g|png|tiff?)$/i
const MAX_BYTES = 100 * 1024 * 1024

interface Pending extends SubmitInput {
  key: string
  name: string
  size: number
  kind: 'pdf' | 'image'
}

export function UploadPage() {
  const { t, pick } = useI18n()
  const { submit } = useDocuments()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const ids = useId()

  const [items, setItems] = useState<Pending[]>([])
  const [rejected, setRejected] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [category, setCategory] = useState<CategoryId | ''>('')
  const [department, setDepartment] = useState('')

  const addFiles = (list: FileList | File[]) => {
    const ok: Pending[] = []
    const bad: string[] = []
    for (const file of Array.from(list)) {
      const typeOk = ACCEPT.includes(file.type) || ACCEPT_EXT.test(file.name)
      if (!typeOk || file.size > MAX_BYTES) {
        bad.push(file.name)
        continue
      }
      ok.push({
        key: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        name: file.name,
        size: file.size,
        kind: file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
      })
    }
    setItems((prev) => [...prev, ...ok.filter((p) => !prev.some((q) => q.key === p.key))])
    setRejected(bad)
  }

  const addSample = () => {
    setItems((prev) =>
      prev.some((p) => p.sample)
        ? prev
        : [...prev, { key: 'sample', sample: true, name: 'ترخيص-نقل-البضائع-2023.pdf', size: 4.2 * 1024 * 1024, kind: 'pdf' }],
    )
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const start = () => {
    const created = submit(items, { category: category || undefined, department: department || undefined })
    navigate(created.length === 1 ? `/documents/${created[0]}` : '/queue')
  }

  const totalSize = items.reduce((s, i) => s + i.size, 0)

  return (
    <>
      <PageHeader eyebrow={t('nav.documents')} title={t('page.upload')} subtitle={t('upload.subtitle')} />

      <div className="upload">
        <div className="upload__main">
          <div
            className={`drop${dragging ? ' is-dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <span className="drop__icon">
              <Upload size={20} />
            </span>
            <p className="drop__title">{t('upload.dropTitle')}</p>
            <p className="drop__hint">{t('upload.dropHint')}</p>
            <div className="drop__actions">
              <button type="button" className="btn btn--ink" onClick={() => inputRef.current?.click()}>
                {t('upload.browse')}
              </button>
              <button type="button" className="btn btn--ghost" onClick={addSample}>
                <Sparkles size={15} />
                {t('upload.sample')}
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              hidden
              accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files)
                e.target.value = ''
              }}
            />
          </div>

          {rejected.length > 0 && (
            <p className="upload__error" role="alert">
              {t('upload.rejected', { files: rejected.join('، ') })}
            </p>
          )}

          {items.length > 0 && (
            <section className="panel files" aria-labelledby={`${ids}-files`}>
              <header className="files__head">
                <h2 id={`${ids}-files`}>{t('upload.selected', { n: items.length })}</h2>
                <span className="mono files__total">{formatBytes(totalSize)}</span>
              </header>
              <ul>
                {items.map((it) => (
                  <li key={it.key} className="files__row">
                    <span className="files__icon">{it.kind === 'pdf' ? <FileText size={17} /> : <FileImage size={17} />}</span>
                    <div className="files__meta">
                      <span className="files__name" dir="auto">
                        {it.name}
                      </span>
                      <span className="files__sub mono">
                        {formatBytes(it.size)} · {it.kind.toUpperCase()}
                        {it.sample && <em> · {t('upload.sampleTag')}</em>}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--ghost btn--icon"
                      aria-label={t('upload.remove', { name: it.name })}
                      onClick={() => setItems((prev) => prev.filter((p) => p.key !== it.key))}
                    >
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="panel meta">
            <h2 className="meta__title">{t('upload.metaTitle')}</h2>
            <p className="meta__hint">{t('upload.metaHint')}</p>
            <div className="meta__grid">
              <div>
                <label className="field-label" htmlFor={`${ids}-cat`}>
                  {t('upload.category')}
                </label>
                <select
                  id={`${ids}-cat`}
                  className="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId | '')}
                >
                  <option value="">{t('upload.autoDetect')}</option>
                  {Object.entries(CATEGORIES).map(([id, label]) => (
                    <option key={id} value={id}>
                      {pick(label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor={`${ids}-dep`}>
                  {t('upload.department')}
                </label>
                <select id={`${ids}-dep`} className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">{t('upload.noDepartment')}</option>
                  {Object.entries(DEPARTMENTS).map(([id, label]) => (
                    <option key={id} value={id}>
                      {pick(label)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="upload__footer">
            <span className="upload__count">
              {items.length === 0 ? t('upload.nothing') : t('upload.ready', { n: items.length })}
            </span>
            <button type="button" className="btn btn--primary" disabled={items.length === 0} onClick={start}>
              {t('upload.start')}
              <ArrowRight size={16} className="flip-rtl" />
            </button>
          </div>
        </div>

        <aside className="route" aria-labelledby={`${ids}-route`}>
          <h2 id={`${ids}-route`} className="eyebrow">
            {t('upload.routeTitle')}
          </h2>
          <ol className="route__list">
            {STAGES.map((s, i) => (
              <li key={s.id} className="route__stop">
                <span className="route__dot mono">{i + 1}</span>
                <div>
                  <strong>{pick(s.label)}</strong>
                  <p>{pick(s.description)}</p>
                </div>
              </li>
            ))}
            <li className="route__stop route__stop--you">
              <span className="route__dot">
                <ScanText size={13} />
              </span>
              <div>
                <strong>{t('upload.routeYou')}</strong>
                <p>{t('upload.routeYouDesc')}</p>
              </div>
            </li>
          </ol>
        </aside>
      </div>
    </>
  )
}
