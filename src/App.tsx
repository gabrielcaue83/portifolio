import { SoundToggle } from './components/audio/SoundToggle'
import { Experience } from './components/canvas/Experience'
import { CameraDirector } from './components/scroll/CameraDirector'
import { SmoothScroll } from './components/scroll/SmoothScroll'
import { ContactSection } from './components/sections/ContactSection'
import { GsapSection } from './components/sections/GsapSection'
import { Hero } from './components/sections/Hero'
import { MotionSection } from './components/sections/MotionSection'
import { ThreeSection } from './components/sections/ThreeSection'
import { CustomCursor } from './components/ui/CustomCursor'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { Marquee } from './components/ui/Marquee'
import { PanicOverlay } from './components/ui/PanicOverlay'

export default function App() {
  return (
    <SmoothScroll>
      {/* Sem WebGL (ou se o 3D falhar) o site continua, só sem o mundo 3D */}
      <ErrorBoundary fallback={() => <div className="fixed inset-0 z-0 bg-pop-yellow" />}>
        <Experience />
      </ErrorBoundary>
      <CustomCursor />

      {/* Seções transparentes, sobrepostas ao canvas 3D fixo */}
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <ThreeSection />
        <GsapSection />
        <MotionSection />
        <ContactSection />
      </main>

      {/* Depois das seções: os pins já existem quando o trilho da câmera é medido */}
      <CameraDirector />
      <PanicOverlay />
      <SoundToggle />
    </SmoothScroll>
  )
}
