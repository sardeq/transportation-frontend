import { useCallback, useMemo, useReducer, type ReactNode } from 'react'
import { STAGES } from './catalog'
import { mockEngine, type AnalysisEngine } from './engine'
import { seedDocuments } from './seed'
import { CURRENT_USER, DocumentsContext, type DocumentsApi, type SubmitInput, type SubmitMeta } from './store-context'
import type { AnalysisResult, CategoryId, DocRecord, HistoryEvent, StageState } from './types'

type Action =
  | { type: 'add'; docs: DocRecord[] }
  | { type: 'patch'; id: string; patch: Partial<DocRecord> }
  | { type: 'stage'; id: string; stage: StageState }
  | { type: 'result'; id: string; result: AnalysisResult }
  | { type: 'field'; id: string; fieldId: string; value?: string; confirmed?: boolean }
  | { type: 'category'; id: string; category: CategoryId }
  | { type: 'history'; id: string; event: HistoryEvent }

const now = () => new Date().toISOString()

function update(state: DocRecord[], id: string, fn: (d: DocRecord) => DocRecord) {
  return state.map((d) => (d.id === id ? fn(d) : d))
}

function reducer(state: DocRecord[], a: Action): DocRecord[] {
  switch (a.type) {
    case 'add':
      return [...a.docs, ...state]
    case 'patch':
      return update(state, a.id, (d) => ({ ...d, ...a.patch }))
    case 'stage':
      return update(state, a.id, (d) => ({
        ...d,
        status: 'processing',
        stages: d.stages.map((s) => (s.id === a.stage.id ? { ...s, ...a.stage } : s)),
      }))
    case 'result':
      return update(state, a.id, (d) => ({
        ...d,
        status: 'review',
        result: a.result,
        history: [...d.history, { at: now(), kind: 'processing_done' }],
      }))
    case 'field':
      return update(state, a.id, (d) => {
        if (!d.result) return d
        const fields = d.result.fields.map((f) => {
          if (f.id !== a.fieldId) return f
          const next = { ...f }
          if (a.value !== undefined) {
            const original = f.originalValue ?? f.value
            next.value = a.value
            next.originalValue = a.value === original ? undefined : original
          }
          if (a.confirmed !== undefined) next.confirmed = a.confirmed
          return next
        })
        return { ...d, result: { ...d.result, fields } }
      })
    case 'category':
      return update(state, a.id, (d) => (d.result ? { ...d, result: { ...d.result, category: a.category } } : d))
    case 'history':
      return update(state, a.id, (d) => ({ ...d, history: [...d.history, a.event] }))
  }
}

let counter = 912
const nextId = () => `DOC-2026-${String(++counter).padStart(4, '0')}`

const SAMPLE = {
  fileName: 'ترخيص-نقل-البضائع-2023.pdf',
  fileSize: 4.2 * 1024 * 1024,
  mimeType: 'application/pdf',
}

export function DocumentsProvider({ children, engine = mockEngine }: { children: ReactNode; engine?: AnalysisEngine }) {
  const [docs, dispatch] = useReducer(reducer, undefined, seedDocuments)

  const run = useCallback(
    async (doc: DocRecord) => {
      dispatch({ type: 'history', id: doc.id, event: { at: now(), kind: 'processing_started' } })
      try {
        const result = await engine.analyze(doc, (stage) => dispatch({ type: 'stage', id: doc.id, stage }))
        dispatch({ type: 'result', id: doc.id, result })
      } catch (err) {
        console.error(err)
        dispatch({ type: 'patch', id: doc.id, patch: { status: 'failed' } })
      }
    },
    [engine],
  )

  const submit = useCallback(
    (inputs: SubmitInput[], meta: SubmitMeta) => {
      const created: DocRecord[] = inputs.map(({ file, sample }) => {
        const src = sample || !file ? SAMPLE : { fileName: file.name, fileSize: file.size, mimeType: file.type }
        return {
          id: nextId(),
          ...src,
          previewUrl: file && !sample ? URL.createObjectURL(file) : undefined,
          isSample: sample || !file,
          uploadedAt: now(),
          status: 'queued',
          stages: STAGES.map((s) => ({ id: s.id, status: 'pending', progress: 0 })),
          meta,
          history: [{ at: now(), kind: 'uploaded', actor: CURRENT_USER.name.en }],
        }
      })
      dispatch({ type: 'add', docs: created })
      // Stagger starts slightly so a batch doesn't move in lockstep.
      created.forEach((d, i) => setTimeout(() => run(d), 250 + i * 700))
      return created.map((d) => d.id)
    },
    [run],
  )

  const api = useMemo<DocumentsApi>(() => {
    const log = (id: string, kind: HistoryEvent['kind'], detail?: string) =>
      dispatch({ type: 'history', id, event: { at: now(), kind, actor: CURRENT_USER.name.en, detail } })

    return {
      docs,
      getDoc: (id) => docs.find((d) => d.id === id),
      submit,
      updateField: (id, fieldId, value) => dispatch({ type: 'field', id, fieldId, value }),
      confirmField: (id, fieldId, confirmed) => dispatch({ type: 'field', id, fieldId, confirmed }),
      setCategory: (id, category) => dispatch({ type: 'category', id, category }),
      saveDraft: (id) => {
        const edited = docs.find((d) => d.id === id)?.result?.fields.filter((f) => f.originalValue !== undefined)
        log(id, 'draft_saved', edited?.length ? edited.map((f) => f.id).join(', ') : undefined)
      },
      approve: (id) => {
        dispatch({ type: 'patch', id, patch: { status: 'approved' } })
        log(id, 'approved')
      },
      reject: (id, reason) => {
        dispatch({ type: 'patch', id, patch: { status: 'rejected', rejectionReason: reason } })
        log(id, 'rejected', reason)
      },
      reopen: (id) => dispatch({ type: 'patch', id, patch: { status: 'review', rejectionReason: undefined } }),
    }
  }, [docs, submit])

  return <DocumentsContext.Provider value={api}>{children}</DocumentsContext.Provider>
}
