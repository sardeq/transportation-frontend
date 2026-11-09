import { Check, RotateCcw, TriangleAlert } from 'lucide-react'
import { Confidence } from '../../components/Confidence'
import { isLowConfidence, needsAttention } from '../../features/documents/selectors'
import type { ExtractedField } from '../../features/documents/types'
import { useI18n } from '../../i18n/i18n-context'

interface Props {
  field: ExtractedField
  readOnly: boolean
  active: boolean
  onActivate: (id: string | null) => void
  onChange: (value: string) => void
  onConfirm: (confirmed: boolean) => void
}

export function FieldRow({ field, readOnly, active, onActivate, onChange, onConfirm }: Props) {
  const { t, pick } = useI18n()
  const attention = needsAttention(field)
  const edited = field.originalValue !== undefined
  const inputId = `field-${field.id}`

  return (
    <div
      id={`row-${field.id}`}
      className={`frow${attention ? ' frow--attention' : ''}${active ? ' is-active' : ''}${edited ? ' frow--edited' : ''}`}
      onMouseEnter={() => onActivate(field.id)}
      onMouseLeave={() => onActivate(null)}
    >
      <div className="frow__top">
        <label htmlFor={inputId} className="frow__label">
          {pick(field.label)}
        </label>
        {edited ? (
          <span className="frow__tag frow__tag--edited">{t('field.edited')}</span>
        ) : field.confirmed && isLowConfidence(field) ? (
          <span className="frow__tag frow__tag--ok">
            <Check size={11} strokeWidth={3} />
            {t('field.confirmed')}
          </span>
        ) : null}
        <Confidence value={field.confidence} />
      </div>

      <div className="frow__control">
        <input
          id={inputId}
          className="input frow__input"
          dir={field.dir}
          value={field.value}
          readOnly={readOnly}
          onFocus={() => onActivate(field.id)}
          onBlur={() => onActivate(null)}
          onChange={(e) => onChange(e.target.value)}
        />
        {!readOnly && attention && (
          <button
            type="button"
            className="btn btn--sm frow__confirm"
            onClick={() => onConfirm(true)}
            title={t('field.confirmHint')}
          >
            <Check size={14} />
            {t('field.confirm')}
          </button>
        )}
      </div>

      {attention && !readOnly && (
        <p className="frow__note frow__note--warn">
          <TriangleAlert size={13} />
          {t('field.lowNote')}
        </p>
      )}

      {edited && (
        <p className="frow__note">
          <span>{t('field.aiRead')}</span>
          <s dir={field.dir}>{field.originalValue}</s>
          {!readOnly && (
            <button type="button" className="frow__revert" onClick={() => onChange(field.originalValue!)}>
              <RotateCcw size={12} />
              {t('field.revert')}
            </button>
          )}
        </p>
      )}

      {!readOnly && field.confirmed && !edited && isLowConfidence(field) && (
        <p className="frow__note">
          <button type="button" className="frow__revert" onClick={() => onConfirm(false)}>
            <RotateCcw size={12} />
            {t('field.unconfirm')}
          </button>
        </p>
      )}
    </div>
  )
}
