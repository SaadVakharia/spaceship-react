import { useEffect, useMemo, forwardRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Author: Sousinho – CC-BY-4.0
// https://sketchfab.com/3d-models/rusty-spaceship-orange-18541ebed6ce44a9923f9b8dc30d87f5

export const Spaceship = forwardRef(function Spaceship({ position, rotation }, ref) {
  const { nodes, materials } = useGLTF('/models/spaceship.glb')
  const beamTex = useTexture('/textures/energy-beam-opacity.png')

  // alphaFix – matches the original gltf.then() call in spaceship.svelte
  useEffect(() => {
    const fix = (mat) => {
      if (!mat) return
      mat.transparent      = true
      mat.alphaToCoverage  = true
      mat.depthFunc        = THREE.LessEqualDepth
      mat.depthTest        = true
      mat.depthWrite       = true
      mat.needsUpdate      = true
    }
    fix(materials.spaceship_racer)
    fix(materials.cockpit)
  }, [materials])

  const beamMat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      color:         new THREE.Color(1.0, 0.4, 0.02),
      alphaMap:      beamTex,
      transparent:   true,
      blending:      THREE.CustomBlending,
      blendDst:      THREE.OneFactor,
      blendEquation: THREE.AddEquation,
      side:          THREE.DoubleSide,
    })
    return m
  }, [beamTex])

  return (
    <group ref={ref} position={position} rotation={rotation} dispose={false}>
      {/* scale/rotation/position match the original <T.Group> wrapper */}
      <group
        scale={0.003}
        rotation={[0, -Math.PI * 0.5, 0]}
        position={[0.95, 0, -2.235]}
      >
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cube001_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, -64.81, 64.77]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cylinder002_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.69, -59.39, -553.38]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cylinder003_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[742.15, -64.53, -508.88]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cube003_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[737.62, 46.84, -176.41]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cylinder004_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[789.52, 59.45, -224.91]}
          rotation={[1, 0, 0]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cube001_RExtr001_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[745.54, 159.32, -5.92]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cube001_RPanel003_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, 0, 0]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cube001_RPanel003_RExtr_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, 0, 0]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cube002_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[736.79, -267.14, -33.21]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cube001_RPanel001_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, 0, 0]}
        />
        <mesh
          castShadow receiveShadow
          geometry={nodes.Cube001_RPanel003_RExtr001_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, 0, 0]}
        />

        {/* cockpit meshes */}
        <mesh
          geometry={nodes.Cube005_cockpit_0.geometry}
          material={materials.cockpit}
          position={[739.45, 110.44, 307.18]}
          rotation={[0.09, 0, 0]}
        />
        <mesh
          geometry={nodes.Sphere_cockpit_0.geometry}
          material={materials.cockpit}
          position={[739.37, 145.69, 315.6]}
          rotation={[0.17, 0, 0]}
        />

        {/* energy beam – position/rotation match the original */}
        <mesh position={[740, -60, -1350]} rotation={[Math.PI * 0.5, 0, 0]}>
          <cylinderGeometry args={[70, 25, 1600, 15]} />
          <primitive object={beamMat} attach="material" />
        </mesh>
      </group>
    </group>
  )
})

useGLTF.preload('/models/spaceship.glb')
