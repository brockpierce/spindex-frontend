import SoundboardDemo from './SoundboardDemo'
import NativeSplash from './NativeSplash'
import ErrorBoundary from './ErrorBoundary'

export default function App() {
  return (
    <>
      <ErrorBoundary>
        <SoundboardDemo />
      </ErrorBoundary>
      {/* iOS/native-only animated splash (returns null on web). */}
      <NativeSplash />
    </>
  )
}
