import { SoundToggle } from './components/audio/SoundToggle'
import { SmoothScroll } from './components/scroll/SmoothScroll'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Fim } from './components/sections/Fim'
import { Footer } from './components/sections/Footer'
import { Hero } from './components/sections/Hero'
import { Nav } from './components/sections/Nav'
import { Process } from './components/sections/Process'
import { Services } from './components/sections/Services'
import { Skills } from './components/sections/skills/Skills'
import { Work } from './components/sections/Work'
import { ClickStars } from './components/ui/ClickStars'
import { CustomCursor } from './components/ui/CustomCursor'
import { Wave } from './components/ui/Decor'
import { Iris } from './components/ui/Iris'
import { LineBoil } from './components/ui/LineBoil'
import { Marquees } from './components/ui/Marquees'
import { PanicOverlay } from './components/ui/PanicOverlay'
import { Reveals } from './components/ui/Reveals'

export default function App() {
  return (
    <SmoothScroll>
      <LineBoil />
      <Iris />
      <div className="grain" aria-hidden />
      <CustomCursor />
      <ClickStars />

      <Nav />
      <main>
        <Hero />
        <Marquees />
        <About />
        <Wave from="var(--paper)" to="var(--ink)" />
        <Skills />
        <Wave from="var(--ink)" to="var(--acid)" variant="b" />
        <Services />
        <Wave from="var(--acid)" to="var(--paper)" />
        <Process />
        <Wave from="var(--paper)" to="var(--mag)" variant="b" />
        <Work />
        <Wave from="var(--mag)" to="var(--orange)" />
        <Contact />
        <Fim />
      </main>
      <Footer />

      {/* Depois das seções: as entradas no scroll enxergam o DOM inteiro */}
      <Reveals />
      <PanicOverlay />
      <SoundToggle />
    </SmoothScroll>
  )
}
