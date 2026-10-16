import { useSyncExternalStore } from 'react'
import { audio } from './audioManager'

/** Estado de mute reativo + atalhos do gerenciador de áudio. */
export function useAudio() {
  const muted = useSyncExternalStore(audio.subscribe, audio.isMuted)
  return { muted, toggleMute: audio.toggleMute, play: audio.play }
}
