import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { Scene } from './components/Scene'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

// Scroll phases:
// 0 → 1  : camera orbits around ship
// 1 → 2  : ship flies left toward black hole
// 2 → 3  : black hole rushes toward camera
// 3 → 4  : fade to black → HTML content

const MAX_SCROLL = 4

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollProgressRef = useRef(0)

  // Canvas opacity: full until scroll=3, then fades to 0 by scroll=3.6
  const canvasOpacity = scrollProgressRef.current < 3
    ? 1
    : Math.max(0, 1 - (scrollProgressRef.current - 3) / 0.6)

  // HTML content opacity: starts fading in at scroll=3.5, full at 4
  const contentOpacity = scrollProgressRef.current < 3.5
    ? 0
    : Math.min(1, (scrollProgressRef.current - 3.5) / 0.5)

  // Re-render on scroll to keep derived opacity values in sync
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    let touchStartY = 0

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

    const updateScroll = (delta) => {
      scrollProgressRef.current = clamp(scrollProgressRef.current + delta, 0, MAX_SCROLL)
      setScrollProgress(scrollProgressRef.current)
      forceUpdate(n => n + 1)
    }

    const onWheel = (event) => {
      event.preventDefault()
      updateScroll(event.deltaY * 0.0015)
    }

    const onTouchStart = (event) => {
      touchStartY = event.touches[0].clientY
    }

    const onTouchMove = (event) => {
      const currentY = event.touches[0].clientY
      const delta = touchStartY - currentY
      touchStartY = currentY
      updateScroll(delta * 0.003)
      event.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  const sp = scrollProgressRef.current

  const canvasOp = sp < 3 ? 1 : Math.max(0, 1 - (sp - 3) / 0.6)
  const contentOp = sp < 3.5 ? 0 : Math.min(1, (sp - 3.5) / 0.5)
  // Black overlay starts at scroll=2.8, peaks at 1 by scroll=3.2, then we hand off to content
  const blackOp = sp < 2.8 ? 0 : Math.min(1, (sp - 2.8) / 0.4)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* ── Three.js Canvas ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: canvasOp,
          transition: 'opacity 0.1s linear',
          pointerEvents: canvasOp === 0 ? 'none' : 'auto',
        }}
      >
        <Canvas
          style={{ width: '100%', height: '100%' }}
          gl={{
            antialias: true,
            alpha: false,
            toneMapping: THREE.NoToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          camera={{
            position: [-5, 6, 10],
            fov: window.innerWidth < 768 ? 32 : 25,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        >
          <Scene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* ── Black overlay that wipes over the canvas ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          opacity: blackOp,
          pointerEvents: 'none',
        }}
      />

      {/* ── HTML content section ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: contentOp,
          pointerEvents: contentOp > 0 ? 'auto' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        {/* ────────────────────────────────────────────
            Replace everything below with your own
            website content / components
        ──────────────────────────────────────────── */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 1rem',
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome to the Game Zone
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            color: '#9ca3af',
            maxWidth: '520px',
            lineHeight: 1.7,
            margin: '0 0 2.5rem',
          }}
        >
          You survived the black hole. Now explore our PlayStation,
          VR, and PC zones — the adventure starts here.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['PlayStation', 'VR Zone', 'PC Zone'].map((label) => (
            <button
              key={label}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '999px',
                border: '1px solid rgba(167,139,250,0.4)',
                background: 'rgba(167,139,250,0.1)',
                color: '#c4b5fd',
                fontSize: '1rem',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(167,139,250,0.25)'}
              onMouseLeave={e => e.target.style.background = 'rgba(167,139,250,0.1)'}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Loader
        containerStyles={{ background: '#000' }}
        innerStyles={{ width: 'min(320px, 70vw)' }}
        dataStyles={{ color: '#fff', fontFamily: 'system-ui, sans-serif' }}
        barStyles={{ background: '#fff' }}
        progressStyles={{ background: '#111' }}
      />
    </div>
  )
}