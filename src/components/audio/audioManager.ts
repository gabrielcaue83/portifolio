import { Howl, Howler, type HowlOptions } from 'howler'

const base = import.meta.env.BASE_URL

const SOUNDS = {
  hover: { src: [`${base}sounds/hover.wav`], volume: 0.2 },
  click: { src: [`${base}sounds/click.wav`], volume: 0.5 },
  boing: { src: [`${base}sounds/boing.wav`], volume: 0.5 },
  siren: { src: [`${base}sounds/siren.wav`], volume: 0.35 },
  ambient: { src: [`${base}sounds/ambient.wav`], volume: 0.35, loop: true },
} satisfies Record<string, HowlOptions>

export type SoundName = keyof typeof SOUNDS
export type SfxName = Exclude<SoundName, 'ambient'>

const FADE_IN_MS = 1200
const FADE_OUT_MS = 400

/**
 * Gerenciador de áudio global. Começa mudo (navegadores bloqueiam autoplay)
 * e só cria/baixa os sons no primeiro unmute, que já é um gesto do usuário.
 */
class AudioManager {
  private howls = new Map<SoundName, Howl>()
  private muted = true
  private listeners = new Set<() => void>()

  constructor() {
    Howler.mute(true)
  }

  private howl(name: SoundName) {
    let howl = this.howls.get(name)
    if (!howl) {
      howl = new Howl(SOUNDS[name])
      this.howls.set(name, howl)
    }
    return howl
  }

  /** Toca um efeito sonoro. Ignorado enquanto estiver mudo. */
  play = (name: SfxName) => {
    if (this.muted) return
    this.howl(name).play()
  }

  isMuted = () => this.muted

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  setMuted = (muted: boolean) => {
    if (muted === this.muted) return
    this.muted = muted
    const ambient = this.howl('ambient')

    if (muted) {
      ambient.fade(ambient.volume(), 0, FADE_OUT_MS)
      ambient.once('fade', () => {
        // Pode ter sido desmutado de novo durante o fade
        if (!this.muted) return
        ambient.pause()
        Howler.mute(true)
      })
    } else {
      Howler.mute(false)
      for (const name of Object.keys(SOUNDS) as SoundName[]) this.howl(name)
      if (!ambient.playing()) ambient.play()
      ambient.fade(0, SOUNDS.ambient.volume, FADE_IN_MS)
    }

    this.listeners.forEach((listener) => listener())
  }

  toggleMute = () => this.setMuted(!this.muted)
}

export const audio = new AudioManager()
