import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

// In-app splash screen — design 1a. iOS / native ONLY: it returns null on web,
// so the website never shows a splash. White screen with the centered logo mark
// and "noteblock" wordmark, a loading bar near the bottom that fills 0 -> 100%,
// then the whole thing fades out over 250ms into the app.
//
// Pairs with the native LaunchScreen (static, shown before the webview loads);
// this is the animated layer that takes over once React mounts.
export default function NativeSplash() {
  const native = typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform && Capacitor.isNativePlatform()
  const [progress, setProgress] = useState(0) // loading-bar fill, 0..1
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!native) return
    // Hide Capacitor's own launch splash so this animated one shows through.
    import('@capacitor/splash-screen')
      .then(({ SplashScreen }) => { SplashScreen.hide({ fadeOutDuration: 0 }).catch(() => {}) })
      .catch(() => {})

    // Determinate fill over ~1.3s (progress isn't otherwise known), then fade out.
    const DURATION = 1300
    const FADE_MS = 250
    let raf
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION)
      setProgress(p)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setFading(true)
        setTimeout(() => setGone(true), FADE_MS + 20)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [native])

  if (!native || gone) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 100000, background: '#FFFFFF',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        opacity: fading ? 0 : 1, transition: 'opacity 250ms ease-out',
        pointerEvents: fading ? 'none' : 'auto',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      {/* logo mark — tinted to nb-blue via a mask so it's exactly #1F388A */}
      <div
        style={{
          width: 168, height: 110, background: '#1F388A',
          WebkitMaskImage: 'url(/spindex-logo.svg)', maskImage: 'url(/spindex-logo.svg)',
          WebkitMaskSize: 'contain', maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center', maskPosition: 'center',
        }}
      />
      {/* wordmark */}
      <div style={{ marginTop: 28, fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em', color: '#1A1A1A', fontWeight: 400 }}>
        noteblock
      </div>
      {/* loading bar — 56pt above the bottom, clearing the home indicator */}
      <div
        style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          bottom: 'calc(56px + env(safe-area-inset-bottom, 0px))',
          width: 120, height: 2, background: '#E3E3E3',
        }}
      >
        <div style={{ height: '100%', width: `${Math.round(progress * 100)}%`, background: '#1F388A' }} />
      </div>
    </div>
  )
}
