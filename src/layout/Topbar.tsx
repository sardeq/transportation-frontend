import { Bell, FlaskConical, Languages, Menu, Search } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useI18n } from '../i18n/i18n-context'

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { t, lang, toggle } = useI18n()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // '/' focuses search from anywhere, unless the user is already typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (e.key !== '/' || el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search')
  }

  return (
    <header className="topbar">
      <button type="button" className="btn btn--ghost btn--icon topbar__menu" onClick={onMenu} aria-label={t('topbar.menu')}>
        <Menu size={18} />
      </button>

      <form className="topbar__search" onSubmit={onSearch} role="search">
        <Search size={15} aria-hidden="true" />
        <input
          ref={inputRef}
          className="topbar__search-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('topbar.search')}
          aria-label={t('topbar.search')}
        />
        <kbd className="mono">/</kbd>
      </form>

      <div className="topbar__end">
        <span className="topbar__demo" title={t('topbar.demoHint')}>
          <FlaskConical size={13} aria-hidden="true" />
          {t('topbar.demo')}
        </span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={toggle} lang={lang === 'ar' ? 'en' : 'ar'}>
          <Languages size={16} aria-hidden="true" />
          <span className="topbar__lang-label">{lang === 'ar' ? 'English' : 'العربية'}</span>
        </button>
        <button type="button" className="btn btn--ghost btn--icon" aria-label={t('topbar.notifications')}>
          <Bell size={17} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
