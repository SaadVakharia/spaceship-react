import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { Scene } from './components/Scene'
import * as THREE from 'three'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    let touchStartY = 0

    const clamp = (value, min, max) =>
      Math.min(max, Math.max(min, value))

    const updateScroll = (delta) => {
      scrollProgressRef.current = clamp(
        scrollProgressRef.current + delta,
        0,
        4
      )

      setScrollProgress(scrollProgressRef.current)
    }

    // Desktop wheel support
    const onWheel = (event) => {
      event.preventDefault()
      updateScroll(event.deltaY * 0.0015)
    }

    // Mobile touch support
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

    window.addEventListener('wheel', onWheel, {
      passive: false,
    })

    window.addEventListener('touchstart', onTouchStart, {
      passive: true,
    })

    window.addEventListener('touchmove', onTouchMove, {
      passive: false,
    })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

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
      <Canvas
        style={{
          width: '100%',
          height: '100%',
        }}
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

      <Loader
        containerStyles={{
          background: '#000',
        }}
        innerStyles={{
          width: 'min(320px, 70vw)',
        }}
        dataStyles={{
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
        barStyles={{
          background: '#fff',
        }}
        progressStyles={{
          background: '#111',
        }}
      />
    </div>
  )
}