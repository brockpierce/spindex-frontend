import { useState, useEffect } from 'react'
import SoundboardDemo from './SoundboardDemo'

// In-app animated splash: the noteblock logo + wordmark fade/scale in on first
// load, then the overlay dismisses. Layers on top of the static native launch
// screen (same logo on white) so the handoff reads as one continuous reveal.
function IntroSplash({ onDone }) {
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    // Hand off from the native (static) splash to this animated one.
    try { import('@capacitor/splash-screen').then(({ SplashScreen }) => SplashScreen.hide().catch(() => {})).catch(() => {}) } catch (e) {}
    const t1 = setTimeout(() => setLeaving(true), 1150) // begin fade-out once logo has landed
    const t2 = setTimeout(() => onDone(), 1700)         // unmount
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  const NAVY = '#1F388A'
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 2147483000, background: '#ffffff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
      opacity: leaving ? 0 : 1, transition: 'opacity .55s ease', pointerEvents: leaving ? 'none' : 'auto',
    }}>
      <style>{`
        @keyframes nb-intro-in { from { opacity: 0; transform: scale(.80) translateY(12px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .nb-intro-mark, .nb-intro-word { animation-duration: .01ms !important; } }
      `}</style>
      {/* the noteblock mark (same paths as the in-app logo) */}
      <svg className="nb-intro-mark" width="132" height="132" viewBox="0 0 200 200"
        style={{ display: 'block', overflow: 'visible', animation: 'nb-intro-in .62s cubic-bezier(.2,.7,.3,1) both' }}>
        <g>
          <path d="M28,138 A72,72 0 0 1 172,138" fill="none" stroke={NAVY} strokeWidth="11" strokeLinecap="round" />
          <path d="M37,134 A33,33 0 0 0 37,200 Z" fill={NAVY} />
          <path d="M163,134 A33,33 0 0 1 163,200 Z" fill={NAVY} />
          <path d="M57,111 C55,124 55,140 58,153" fill="none" stroke={NAVY} strokeWidth="7" strokeLinecap="round" />
          <path d="M72,109 C71,124 72,140 76,154" fill="none" stroke={NAVY} strokeWidth="7" strokeLinecap="round" />
          <path d="M87,109 C88,124 91,139 95,152" fill="none" stroke={NAVY} strokeWidth="7" strokeLinecap="round" />
          <path d="M103,110 C103,124 107,138 114,149" fill="none" stroke={NAVY} strokeWidth="7" strokeLinecap="round" />
          <circle cx="74" cy="175" r="6" fill={NAVY} />
          <circle cx="126" cy="175" r="6" fill={NAVY} />
          <rect x="89" y="185" width="22" height="7" rx="3.5" fill={NAVY} />
        </g>
      </svg>
      <div className="nb-intro-word" style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 30, fontWeight: 400,
        color: '#111', letterSpacing: '-.01em', animation: 'nb-intro-in .62s cubic-bezier(.2,.7,.3,1) .12s both',
      }}>noteblock</div>
    </div>
  )
}

export default function App() {
  const [intro, setIntro] = useState(true)
  return (
    <>
      <SoundboardDemo />
      {intro && <IntroSplash onDone={() => setIntro(false)} />}
    </>
  )
}
