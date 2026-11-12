import { Component } from 'react'

// Last line of defence: a render error anywhere below used to unmount the whole
// tree and leave a blank white screen, which on iOS can only be cleared by
// force-quitting the app. Show a way back instead.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Render error:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#111' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong.</div>
        <div style={{ fontSize: 14, color: '#666', maxWidth: 320, lineHeight: 1.5 }}>Sorry about that. Reloading usually fixes it.</div>
        <button onClick={() => window.location.reload()} style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 600, padding: '11px 24px', background: '#1f3b8f', color: '#fff', border: 'none', borderRadius: 0, cursor: 'pointer' }}>reload</button>
      </div>
    )
  }
}
