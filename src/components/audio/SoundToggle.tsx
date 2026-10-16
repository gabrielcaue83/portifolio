import { Volume2, VolumeX } from 'lucide-react'
import { useAudio } from './useAudio'

export function SoundToggle() {
  const { muted, toggleMute } = useAudio()

  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? 'Ativar som' : 'Desativar som'}
      aria-pressed={!muted}
      data-cursor={muted ? 'som' : 'shh'}
      className={`cartoon-box cartoon-press fixed right-4 bottom-4 z-50 grid size-14 place-items-center rounded-full ${muted ? 'bg-white' : 'bg-pop-green'}`}
    >
      {muted ? <VolumeX strokeWidth={3} /> : <Volume2 strokeWidth={3} />}
    </button>
  )
}
