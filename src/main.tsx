import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (import.meta.env.DEV) {
  // Dev only: demo data on first run; `await resetDemoData()` in the console refills it.
  void import('./lib/devDemo').then((m) => {
    Object.assign(window, { resetDemoData: m.resetDemoData })
    return m.seedDemoDataOnce()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
