import { STAGES } from './catalog'
import { TEMPLATES, pickTemplate } from './mockTemplates'
import type { AnalysisResult, DocRecord, StageId, StageState } from './types'

/**
 * The contract between the UI and the document-analysis backend.
 * Today it's backed by `mockEngine`; swap in an HTTP/websocket client that
 * reports stage progress and resolves with the final result.
 */
export interface AnalysisEngine {
  analyze(
    doc: DocRecord,
    onStage: (stage: StageState) => void,
    signal?: AbortSignal,
  ): Promise<AnalysisResult>
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(t)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const clamp01 = (n: number) => Math.min(0.995, Math.max(0.3, n))

/** Builds a plausible result, with small per-run variation. */
export function buildMockResult(doc: Pick<DocRecord, 'fileName' | 'mimeType' | 'meta'>): AnalysisResult {
  const base = TEMPLATES[pickTemplate(doc.fileName)]()
  const fields = base.fields.map((f) => ({ ...f, confidence: clamp01(f.confidence + rand(-0.03, 0.03)) }))
  const overall = fields.reduce((sum, f) => sum + f.confidence, 0) / fields.length
  const isImage = doc.mimeType.startsWith('image/')
  return {
    ...base,
    fields,
    overallConfidence: overall,
    pageCount: isImage ? 1 : base.pageCount,
    category: doc.meta.category ?? base.category,
  }
}

function stageNote(id: StageId, r: AnalysisResult, doc: DocRecord) {
  const lowCount = r.fields.filter((f) => f.confidence < 0.8).length
  const pct = (n: number) => `${Math.round(n * 100)}%`
  switch (id) {
    case 'ingest':
      return {
        en: `${r.pageCount} page${r.pageCount > 1 ? 's' : ''} · ${(doc.fileSize / 1024 / 1024).toFixed(1)} MB`,
        ar: `${r.pageCount} صفحة · ${(doc.fileSize / 1024 / 1024).toFixed(1)} م.ب`,
      }
    case 'preprocess':
      return {
        en: `Deskewed ${r.preprocessing.deskewDeg}° · noise −${r.preprocessing.noiseReductionPct}%`,
        ar: `تصحيح ميلان ${r.preprocessing.deskewDeg}° · تشويش −${r.preprocessing.noiseReductionPct}%`,
      }
    case 'layout':
      return {
        en: `${r.layout.textRegions} regions · ${r.layout.tables} table · ${r.layout.stamps} stamp`,
        ar: `${r.layout.textRegions} منطقة · ${r.layout.tables} جدول · ${r.layout.stamps} ختم`,
      }
    case 'ocr':
      return {
        en: r.transcription.map((b) => `${b.lang === 'ar' ? 'Arabic' : 'English'} ${pct(b.confidence)}`).join(' · '),
        ar: r.transcription.map((b) => `${b.lang === 'ar' ? 'عربي' : 'إنجليزي'} ${pct(b.confidence)}`).join(' · '),
      }
    case 'classify':
      return { en: `Match ${pct(r.categoryConfidence)}`, ar: `تطابق ${pct(r.categoryConfidence)}` }
    case 'extract':
      return {
        en: `${r.fields.length} fields · ${lowCount} flagged`,
        ar: `${r.fields.length} حقول · ${lowCount} بحاجة لمراجعة`,
      }
  }
}

export const mockEngine: AnalysisEngine = {
  async analyze(doc, onStage, signal) {
    const result = buildMockResult(doc)

    for (const def of STAGES) {
      const total = rand(...def.duration)
      const started = performance.now()
      onStage({ id: def.id, status: 'active', progress: 0 })

      // Tick progress so the UI has something real to animate.
      const steps = Math.max(4, Math.round(total / 120))
      for (let i = 1; i <= steps; i++) {
        await sleep(total / steps, signal)
        onStage({ id: def.id, status: 'active', progress: i / steps })
      }

      onStage({
        id: def.id,
        status: 'done',
        progress: 1,
        durationMs: Math.round(performance.now() - started),
        note: stageNote(def.id, result, doc),
      })
    }

    return result
  },
}
