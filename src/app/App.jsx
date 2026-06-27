import { useScrollProgress } from '../hooks/useScrollProgress'
import {
  getBlackOverlayOpacity,
  getHeroOpacity,
  shouldShowHero,
  shouldShowScrollHint,
} from '../lib/scroll/phases'
import { AppShell, Header, FooterBar } from '../components/layout'
import { GameCanvas } from '../components/canvas/GameCanvas'
import {
  HeroOverlay,
  BlackOverlay,
  PlanetOverlay,
  Starfield,
  ContactOverlay,
  ScrollHint,
  BoostButton,
  Scrollbar
} from '../components/overlay'

export default function App() {
  const { scrollProgress, scrollTo } = useScrollProgress()

  return (
    <AppShell>
      <Header scrollProgress={scrollProgress} scrollTo={scrollTo} />

      {shouldShowHero(scrollProgress) && (
        <HeroOverlay opacity={getHeroOpacity(scrollProgress)} />
      )}

      {scrollProgress < 3.4 && (
        <GameCanvas scrollProgress={scrollProgress} />
      )}

      <BlackOverlay opacity={getBlackOverlayOpacity(scrollProgress)} />
      <Starfield scrollProgress={scrollProgress} />
      <PlanetOverlay scrollProgress={scrollProgress} />
      <ContactOverlay scrollProgress={scrollProgress} />
      <ScrollHint scrollProgress={scrollProgress} />
      <BoostButton scrollProgress={scrollProgress} scrollTo={scrollTo} />
      <Scrollbar scrollProgress={scrollProgress} />
      <FooterBar scrollProgress={scrollProgress} />
    </AppShell>
  )
}
