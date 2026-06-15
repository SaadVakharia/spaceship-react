import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function BlackHole({ position = [-250, 0, 0], scrollProgress = 0 }) {
  const group = useRef()

  useFrame((state) => {
    if (!group.current) return

    // Slow rotation
    group.current.rotation.z += 0.003

    // Grow as the user scrolls
    const scale = 8 + Math.max(0, scrollProgress - 1) * 20
    group.current.scale.setScalar(scale)
  })

  return (
    <group ref={group} position={position}>
      {/* Dark center */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Purple glow */}
      <mesh>
        <torusGeometry args={[1.4, 0.25, 32, 128]} />
        <meshBasicMaterial color="#6a00ff" />
      </mesh>

      {/* Blue glow */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.8, 0.12, 32, 128]} />
        <meshBasicMaterial color="#33bbff" />
      </mesh>
    </group>
  )
}