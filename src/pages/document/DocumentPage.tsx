import { ArrowLeft, FileQuestion } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { StatusChip } from '../../components/StatusChip'
import { useDocuments } from '../../features/documents/store-context'
import { useI18n } from '../../i18n/i18n-context'
import { ProcessingView } from './ProcessingView'
import { ReviewWorkspace } from './ReviewWorkspace'
import './document.css'

export function DocumentPage() {
  const { id = '' } = useParams()
  const { getDoc } = useDocuments()
  const { t, pick } = useI18n()
  const doc = getDoc(id)

  if (!doc) {
    return (
      <div className="placeholder">
        <div className="placeholder__inner">
          <span className="placeholder__icon">
            <FileQuestion size={20} />
          </span>
          <p className="placeholder__title">{t('doc.notFound')}</p>
          <p className="mono">{id}</p>
          <Link to="/queue" className="btn btn--sm">
            {t('doc.backToQueue')}
          </Link>
        </div>
      </div>
    )
  }

  const inFlight = doc.status === 'queued' || doc.status === 'processing'

  return (
    <div className="docpage">
      <header className="docpage__head">
        <Link to={doc.status === 'review' ? '/review' : '/queue'} className="docpage__back">
          <ArrowLeft size={15} className="flip-rtl" />
          {t(doc.status === 'review' ? 'page.review' : 'page.queue')}
        </Link>
        <div className="docpage__titlebar">
          <div className="docpage__titles">
            <h1 className="page-head__title" dir="auto">
              {doc.result ? pick(doc.result.title) : doc.fileName}
            </h1>
            <p className="docpage__meta mono">
              <span>{doc.id}</span>
              <span aria-hidden="true">·</span>
              <span dir="auto" className="docpage__file">{doc.fileName}</span>
            </p>
          </div>
          <StatusChip status={doc.status} />
        </div>
      </header>

      {inFlight ? (
        <ProcessingView doc={doc} />
      ) : doc.status === 'failed' ? (
        <div className="panel docpage__failed">
          <p className="placeholder__title">{t('doc.failedTitle')}</p>
          <p>{t('doc.failedBody')}</p>
        </div>
      ) : (
        <ReviewWorkspace key={doc.id} doc={doc} />
      )}
    </div>
  )
}
