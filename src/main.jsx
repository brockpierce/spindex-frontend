import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './profile-themes.css'
import App from './App.jsx'
import { Capacitor } from '@capacitor/core'

// Native (Capacitor) setup — dynamically imported and guarded so the web build
// is completely unaffected. The webview extends under the status bar (we handle
// spacing via CSS safe-area insets); the light UI gets dark status-bar text.
if (Capacitor.isNativePlatform()) {
  import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
    StatusBar.setStyle({ style: Style.Light }).catch(() => {})
    // Don't overlay: let iOS place the webview BELOW the status bar so the top
    // nav clears the notch. (Overlaying leaves env(safe-area-inset-top)=0 in the
    // webview, so CSS padding can't compensate.)
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {})
  }).catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
