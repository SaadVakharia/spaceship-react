import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function BlackHole({
  position = [-60, 0, 0],
  scrollProgress = 0,
}) {
  const group    = useRef()
  const { scene } = useGLTF('/models/blackhole.glb')

  useFrame((state, delta) => {
    if (!group.current) return

    const fly = Math.max(0, scrollProgress - 1)

    // Grow as ship approaches
    const scale = THREE.MathUtils.lerp(0.8, 8, Math.min(fly / 2.5, 1))
    group.current.scale.setScalar(scale)

    // Slow rotation
    group.current.rotation.x += delta * 0.2

    // Gentle breathing
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03
    group.current.scale.multiplyScalar(pulse)
  })

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, 0, -90]}
    >
      <primitive object={scene.clone()} />
    </group>
  )
}

useGLTF.preload('/models/blackhole.glb')