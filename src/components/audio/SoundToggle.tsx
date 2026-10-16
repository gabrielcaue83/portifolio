import { Volume2, VolumeX } from 'lucide-react'
import { useAudio } from './useAudio'

export function SoundToggle() {
  const { muted, toggleMute } = useAudio()

  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? 'Ativar som' : 'Desativar som'}
      aria-pressed={!muted}
      className={`btn fixed right-4 bottom-4 z-50 size-14 !justify-center !p-0 ${muted ? 'btn-paper' : 'btn-acid'}`}
    >
      {muted ? <VolumeX strokeWidth={3} /> : <Volume2 strokeWidth={3} />}
    </button>
  )
}
