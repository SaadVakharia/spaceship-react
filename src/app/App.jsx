import { useScrollProgress } from '../hooks/useScrollProgress'
import {
  getBlackOverlayOpacity,
  getHeroOpacity,
  shouldShowHero,
  shouldShowScrollHint,
} from '../lib/scroll/phases'
import { AppShell } from '../components/layout/AppShell'
import { Header } from '../components/layout/Header'
import { GameCanvas } from '../components/canvas/GameCanvas'
import { HeroOverlay } from '../components/overlay/HeroOverlay'
import { BlackOverlay } from '../components/overlay/BlackOverlay'
import { PlanetOverlay } from '../components/overlay/PlanetOverlay'
import { ScrollHint } from '../components/overlay/ScrollHint'

export default function App() {
  const scrollProgress = useScrollProgress()

  return (
    <AppShell>
      <Header />

      {shouldShowHero(scrollProgress) && (
        <HeroOverlay opacity={getHeroOpacity(scrollProgress)} />
      )}

      {scrollProgress < 3.4 && (
        <GameCanvas scrollProgress={scrollProgress} />
      )}

      <BlackOverlay opacity={getBlackOverlayOpacity(scrollProgress)} />
      <PlanetOverlay scrollProgress={scrollProgress} />
      <ScrollHint visible={shouldShowScrollHint(scrollProgress)} />
    </AppShell>
  )
}
