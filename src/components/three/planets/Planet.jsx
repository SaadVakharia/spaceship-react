import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Planet({
  color = '#4d9fff',
  glow = '#7ec8ff',
  ring = false,
  active = false,
  transition = 0,
}) {
  const group = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    if (!group.current) return

    const time = state.clock.elapsedTime
    group.current.rotation.y = time * 0.12

    const enterScale = active
      ? THREE.MathUtils.lerp(0.35, 1, Math.min(1, transition * 2.5))
      : THREE.MathUtils.lerp(1, 0.35, Math.min(1, transition * 2))
    const breathe = 1 + Math.sin(time * 1.2) * 0.015

    group.current.scale.setScalar(enterScale * breathe)

    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.08
    }
  })

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.05, 48, 48]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {ring && (
        <mesh ref={ringRef} rotation={[Math.PI * 0.42, 0.1, 0]}>
          <torusGeometry args={[3.2, 0.06, 16, 128]} />
          <meshBasicMaterial
            color={glow}
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      <pointLight color={glow} intensity={active ? 2.5 : 0.4} distance={20} />
    </group>
  )
}
