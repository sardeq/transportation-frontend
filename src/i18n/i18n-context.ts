import { createContext, useContext } from 'react'
import type { StringKey } from './strings'

export type UiLang = 'en' | 'ar'

/** Any piece of content that exists in both languages. */
export interface Bilingual {
  en: string
  ar: string
}

export interface I18nApi {
  lang: UiLang
  dir: 'ltr' | 'rtl'
  setLang(lang: UiLang): void
  toggle(): void
  /** UI string lookup with `{name}` interpolation. */
  t(key: StringKey, vars?: Record<string, string | number>): string
  /** Picks the current-language side of a bilingual value. */
  pick(value: Bilingual): string
  formatDate(iso: string, withTime?: boolean): string
  formatPct(n: number): string
}

export const I18nContext = createContext<I18nApi | null>(null)

export function useI18n(): I18nApi {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
