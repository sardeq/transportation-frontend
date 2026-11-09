import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts: no third-party font CDN, in line with the project's data-control constraint.
import '@fontsource-variable/ibm-plex-sans'
import '@fontsource-variable/source-serif-4'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/500.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import '@fontsource/ibm-plex-sans-arabic/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
