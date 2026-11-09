import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18nApi, type UiLang } from './i18n-context'
import { strings } from './strings'

const STORAGE_KEY = 'ui-lang'

function readStoredLang(): UiLang {
  // `?lang=ar` / `?lang=en` overrides the stored preference (useful for demo links).
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'ar' || fromUrl === 'en') return fromUrl
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'ar' ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLang>(readStoredLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  const setLang = useCallback((next: UiLang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable — preference just won't persist */
    }
  }, [])

  const api = useMemo<I18nApi>(() => {
    // Western digits in both languages, matching common Jordanian government usage.
    const locale = lang === 'ar' ? 'ar-JO-u-nu-latn' : 'en-GB'
    const dateFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })
    const dateTimeFmt = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

    return {
      lang,
      dir,
      setLang,
      toggle: () => setLang(lang === 'ar' ? 'en' : 'ar'),
      t: (key, vars) => {
        let s: string = strings[lang][key] ?? strings.en[key]
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
        return s
      },
      pick: (v) => v[lang],
      formatDate: (iso, withTime) => (withTime ? dateTimeFmt : dateFmt).format(new Date(iso)),
      formatPct: (n) => `${Math.round(n * 100)}%`,
    }
  }, [lang, dir, setLang])

  return <I18nContext.Provider value={api}>{children}</I18nContext.Provider>
}
