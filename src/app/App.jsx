import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

const BlogList = lazy(() => import('../pages/BlogList'))
const BlogPost = lazy(() => import('../pages/BlogPost'))

function MainExperience() {
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

export default function App() {
  return (
    <Suspense fallback={
      <div style={{
        height: '100vh',
        width: '100vw',
        background: '#05060b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
        color: '#c4b5fd',
        letterSpacing: '0.1em'
      }}>
        LOADING...
      </div>
    }>
      <Routes>
        <Route path="/" element={<MainExperience />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
