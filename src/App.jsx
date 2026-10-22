import SoundboardDemo from './SoundboardDemo'
import NativeSplash from './NativeSplash'

export default function App() {
  return (
    <>
      <SoundboardDemo />
      {/* iOS/native-only animated splash (returns null on web). */}
      <NativeSplash />
    </>
  )
}
