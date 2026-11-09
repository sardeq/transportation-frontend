import { createContext, useContext } from 'react'
import type { CategoryId, DocRecord } from './types'

export interface SubmitInput {
  file?: File
  /** Use the built-in sample document instead of a real file. */
  sample?: boolean
}

export interface SubmitMeta {
  category?: CategoryId
  department?: string
}

export interface DocumentsApi {
  docs: DocRecord[]
  getDoc(id: string): DocRecord | undefined
  /** Registers documents and starts analysis. Returns the new ids in order. */
  submit(inputs: SubmitInput[], meta: SubmitMeta): string[]
  updateField(docId: string, fieldId: string, value: string): void
  confirmField(docId: string, fieldId: string, confirmed: boolean): void
  setCategory(docId: string, category: CategoryId): void
  saveDraft(docId: string): void
  approve(docId: string): void
  reject(docId: string, reason: string): void
  reopen(docId: string): void
}

export const DocumentsContext = createContext<DocumentsApi | null>(null)

export function useDocuments(): DocumentsApi {
  const ctx = useContext(DocumentsContext)
  if (!ctx) throw new Error('useDocuments must be used inside <DocumentsProvider>')
  return ctx
}

export const CURRENT_USER = {
  name: { en: 'Lina Haddad', ar: 'لينا حداد' },
  role: { en: 'Archive reviewer', ar: 'مراجِعة الأرشيف' },
  initials: 'LH',
}
