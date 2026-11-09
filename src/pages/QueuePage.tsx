import { FileUp, Inbox, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Confidence } from '../components/Confidence'
import { LanguageTag } from '../components/LanguageTag'
import { PageHeader } from '../components/PageHeader'
import { StatusChip } from '../components/StatusChip'
import { TransitLine } from '../components/TransitLine'
import { CATEGORIES } from '../features/documents/catalog'
import { pendingCount } from '../features/documents/selectors'
import { useDocuments } from '../features/documents/store-context'
import type { DocRecord } from '../features/documents/types'
import { useI18n } from '../i18n/i18n-context'
import type { StringKey } from '../i18n/strings'
import './queue.css'

type Filter = 'all' | 'active' | 'review' | 'approved' | 'rejected'

const FILTERS: { id: Filter; label: StringKey; match: (d: DocRecord) => boolean }[] = [
  { id: 'all', label: 'filter.all', match: () => true },
  { id: 'active', label: 'filter.active', match: (d) => d.status === 'queued' || d.status === 'processing' },
  { id: 'review', label: 'filter.review', match: (d) => d.status === 'review' },
  { id: 'approved', label: 'filter.approved', match: (d) => d.status === 'approved' },
  { id: 'rejected', label: 'filter.rejected', match: (d) => d.status === 'rejected' || d.status === 'failed' },
]

export function QueuePage({ mode = 'queue' }: { mode?: 'queue' | 'review' }) {
  const { t, pick, formatDate } = useI18n()
  const { docs } = useDocuments()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>(mode === 'review' ? 'review' : 'all')
  const [query, setQuery] = useState('')

  // Keep the preset in sync when switching between /queue and /review.
  const [lastMode, setLastMode] = useState(mode)
  if (mode !== lastMode) {
    setLastMode(mode)
    setFilter(mode === 'review' ? 'review' : 'all')
  }

  const q = query.trim().toLowerCase()
  const visible = docs
    .filter(FILTERS.find((f) => f.id === filter)!.match)
    .filter((d) => !q || d.fileName.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || (d.result && pick(d.result.title).toLowerCase().includes(q)))

  return (
    <>
      <PageHeader
        eyebrow={t('nav.documents')}
        title={t(mode === 'review' ? 'page.review' : 'page.queue')}
        subtitle={t(mode === 'review' ? 'review.subtitle' : 'queue.subtitle')}
        actions={
          <Link to="/upload" className="btn btn--primary">
            <FileUp size={16} />
            {t('dash.upload')}
          </Link>
        }
      />

      <div className="toolbar">
        <div className="segmented" role="tablist" aria-label={t('queue.filterLabel')}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {t(f.label)}
              <span className="count">{docs.filter(f.match).length}</span>
            </button>
          ))}
        </div>
        <label className="toolbar__search">
          <Search size={15} aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('queue.searchPlaceholder')}
            aria-label={t('queue.searchPlaceholder')}
          />
        </label>
      </div>

      <div className="panel table-wrap">
        {visible.length === 0 ? (
          <div className="empty">
            <Inbox size={22} strokeWidth={1.5} />
            <p>{t('queue.empty')}</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('col.document')}</th>
                <th>{t('col.type')}</th>
                <th>{t('col.language')}</th>
                <th>{t('col.pipeline')}</th>
                <th>{t('col.confidence')}</th>
                <th>{t('col.uploaded')}</th>
                <th>{t('col.status')}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((d) => {
                const flagged = pendingCount(d)
                return (
                  <tr key={d.id} onClick={() => navigate(`/documents/${d.id}`)}>
                    <td>
                      <Link to={`/documents/${d.id}`} className="doc-cell" onClick={(e) => e.stopPropagation()}>
                        <span className="doc-cell__name" dir="auto">
                          {d.result ? pick(d.result.title) : d.fileName}
                        </span>
                        <span className="doc-cell__id mono">{d.id}</span>
                      </Link>
                    </td>
                    <td>{d.result ? pick(CATEGORIES[d.result.category]) : <span className="muted">{t('queue.detecting')}</span>}</td>
                    <td>
                      <LanguageTag lang={d.result?.language} />
                    </td>
                    <td>
                      <TransitLine stages={d.stages} variant="compact" />
                    </td>
                    <td>
                      {d.result ? (
                        <span className="conf-cell">
                          <Confidence value={d.result.overallConfidence} />
                          {d.status === 'review' && flagged > 0 && (
                            <span className="flag-count" title={t('queue.flaggedTitle', { n: flagged })}>
                              {flagged}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td className="mono muted nowrap">{formatDate(d.uploadedAt, true)}</td>
                    <td>
                      <StatusChip status={d.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
