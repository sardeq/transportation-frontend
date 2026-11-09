import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import './shell.css'

export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile drawer whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setNavOpen(false)
  }

  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setNavOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  return (
    <div className="shell" data-nav-open={navOpen || undefined}>
      <Sidebar />
      <div className="shell__scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />
      <div className="shell__main">
        <Topbar onMenu={() => setNavOpen((o) => !o)} />
        <main className="shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
