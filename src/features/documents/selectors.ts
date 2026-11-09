import { LOW_CONFIDENCE } from './catalog'
import type { DocRecord, ExtractedField } from './types'

/** A field still needs a human look: low confidence and nobody has confirmed or corrected it. */
export const needsAttention = (f: ExtractedField) =>
  f.confidence < LOW_CONFIDENCE && !f.confirmed && f.originalValue === undefined

export const isLowConfidence = (f: ExtractedField) => f.confidence < LOW_CONFIDENCE

export const pendingCount = (d: DocRecord) => d.result?.fields.filter(needsAttention).length ?? 0
