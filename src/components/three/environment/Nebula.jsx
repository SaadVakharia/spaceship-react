import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { nebulaFragmentShader, nebulaVertexShader } from './nebulaShaders'

export function Nebula() {
  const lastUpdate = useRef(0)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame((state) => {
    const now = state.clock.elapsedTime
    if (now - lastUpdate.current > 0.05) {
      uniforms.uTime.value = now
      lastUpdate.current = now
    }
  })

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3]}
        />
        <bufferAttribute
          attach="attributes-uv"
          args={[new Float32Array([0, 0, 2, 0, 0, 2]), 2]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}
