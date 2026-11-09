import type { Bilingual } from '../../i18n/i18n-context'

/** Lifecycle of a document inside the platform. */
export type DocStatus = 'queued' | 'processing' | 'review' | 'approved' | 'rejected' | 'failed'

/** The modular IDP pipeline, in order (see proposal §1.5.1). */
export type StageId = 'ingest' | 'preprocess' | 'layout' | 'ocr' | 'classify' | 'extract'

export type StageStatus = 'pending' | 'active' | 'done' | 'error'

export type DocLanguage = 'ar' | 'en' | 'mixed'

export type CategoryId =
  | 'transport_license'
  | 'vehicle_record'
  | 'bill_of_lading'
  | 'inspection_report'
  | 'correspondence'
  | 'regulation'

export type EntityType = 'organization' | 'person' | 'date' | 'law' | 'location' | 'vehicle' | 'reference'

export interface StageState {
  id: StageId
  status: StageStatus
  /** 0..1 */
  progress: number
  /** Short machine note shown once the stage finishes, e.g. "Deskewed 1.8°". */
  note?: Bilingual
  durationMs?: number
}

export interface ExtractedField {
  id: string
  label: Bilingual
  value: string
  /** 0..1 model confidence */
  confidence: number
  /** Writing direction of the value itself, independent of UI language. */
  dir: 'rtl' | 'ltr'
  /** Set when a reviewer changed the value; holds what the AI produced. */
  originalValue?: string
  /** Reviewer explicitly confirmed the AI value as correct. */
  confirmed?: boolean
}

export interface Entity {
  type: EntityType
  value: string
}

export interface TranscriptionBlock {
  lang: 'ar' | 'en'
  text: string
  confidence: number
}

export interface AnalysisResult {
  title: Bilingual
  language: DocLanguage
  category: CategoryId
  categoryConfidence: number
  overallConfidence: number
  pageCount: number
  fields: ExtractedField[]
  entities: Entity[]
  transcription: TranscriptionBlock[]
  keywords: string[]
  preprocessing: {
    deskewDeg: number
    noiseReductionPct: number
    contrastGainPct: number
    dpi: number
  }
  layout: {
    textRegions: number
    tables: number
    stamps: number
    signatures: number
  }
}

export interface HistoryEvent {
  at: string
  kind: 'uploaded' | 'processing_started' | 'processing_done' | 'edited' | 'approved' | 'rejected' | 'draft_saved'
  actor?: string
  detail?: string
}

export interface DocRecord {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  /** Object URL of the user's original upload, when available. */
  previewUrl?: string
  /** True for the built-in demo document. */
  isSample?: boolean
  uploadedAt: string
  status: DocStatus
  stages: StageState[]
  result?: AnalysisResult
  meta: {
    category?: CategoryId
    department?: string
  }
  history: HistoryEvent[]
  rejectionReason?: string
}
