import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { Scene } from './components/Scene'
import * as THREE from 'three'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    const onWheel = (event) => {
      event.preventDefault()
      scrollProgressRef.current = Math.max(0, scrollProgressRef.current + event.deltaY * 0.0015)
      setScrollProgress(scrollProgressRef.current)
    }

    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}>
        <Canvas
          style={{ width: '100vw', height: '100vh', display: 'block' }}
          gl={{
            antialias: true,
            toneMapping: THREE.NoToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          camera={{ position: [-5, 6, 10], fov: 25 }}
          frameloop="always"
        >
          <Scene scrollProgress={scrollProgress} />
        </Canvas>
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
