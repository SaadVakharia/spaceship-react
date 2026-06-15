import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const STARS_COUNT = 350
const COLORS = ['#fcaa67', '#C75D59', '#ffffc7', '#8CC5C6', '#A5898C']

function r(min, max) {
  return min + Math.random() * (max - min)
}

function resetStar(star) {
  if (r(0, 1) > 0.8) {
    star.pos.set(r(-10, -30), r(-5, 5), r(6, -6))
    star.len = r(1.5, 15)
  } else {
    star.pos.set(r(-15, -45), r(-10.5, 1.5), r(30, -45))
    star.len = r(2.5, 20)
  }
  star.speed = r(19.5, 42)
  star.color
    .set(COLORS[Math.floor(Math.random() * COLORS.length)])
    .convertSRGBToLinear()
    .multiplyScalar(1.3)
  return star
}

function makeStar() {
  const star = {
    pos:   new THREE.Vector3(),
    len:   0,
    speed: 0,
    color: new THREE.Color(),
  }
  return resetStar(star)
}

export function Stars() {
  const meshRef  = useRef()
  const starTex  = useTexture('/textures/star.png')
  const stars    = useMemo(() => Array.from({ length: STARS_COUNT }, makeStar), [])
  const dummy    = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i]
      star.pos.x += star.speed * delta
      if (star.pos.x > 40) resetStar(star)

      dummy.position.copy(star.pos)
      dummy.scale.set(star.len, 1, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, star.color)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, STARS_COUNT]}>
      <planeGeometry args={[1, 0.05]} />
      <meshBasicMaterial
        alphaMap={starTex}
        transparent
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}
