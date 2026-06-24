import { useEffect, useMemo, useRef, forwardRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Author: Sousinho – CC-BY-4.0
// https://sketchfab.com/3d-models/rusty-spaceship-orange-18541ebed6ce44a9923f9b8dc30d87f5

export const Spaceship = forwardRef(function Spaceship({ position, rotation }, ref) {
  const { nodes, materials } = useGLTF('/models/spaceship.glb')
  const beamTex = useTexture('/textures/energy-beam-opacity.png')
  const beamRef = useRef()

  useEffect(() => {
    const fixMaterial = (material, isMainBody = false) => {
      if (!material) return

      // If it's the main body, we want to make the orange parts white but KEEP the black parts.
      // We do this by injecting a tiny custom shader that desaturates the texture at runtime!
      if (isMainBody) {
        material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>
            
            // Convert the texture colors to grayscale
            float luminance = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
            
            // Boost the brightness so the gray becomes a bright white, but true black stays dark
            vec3 whitish = vec3(luminance) * 2.4;
            
            // Add a tiny bit of blue tint for a sleek "cool white" sci-fi look
            diffuseColor.rgb = whitish * vec3(0.95, 0.98, 1.05);
            `
          )
        }
      }

      material.transparent = true
      material.alphaToCoverage = true
      material.depthFunc = THREE.LessEqualDepth
      material.depthTest = true
      material.depthWrite = true
      material.needsUpdate = true
    }

    fixMaterial(materials.spaceship_racer, true)
    fixMaterial(materials.cockpit, false)
  }, [materials])

  const beamMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(1.0, 0.4, 0.02),
      alphaMap: beamTex,
      transparent: true,
      blending: THREE.CustomBlending,
      blendDst: THREE.OneFactor,
      blendEquation: THREE.AddEquation,
      side: THREE.DoubleSide,
    })
  }, [beamTex])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (beamRef.current) {
      beamRef.current.scale.y = 1 + Math.sin(time * 35) * 0.08
      beamRef.current.scale.x = 1 + Math.sin(time * 20) * 0.02
      beamRef.current.scale.z = 1 + Math.cos(time * 20) * 0.02
    }

    beamMaterial.opacity = 0.75 + Math.sin(time * 30) * 0.2
  })

  return (
    <group ref={ref} position={position} rotation={rotation} dispose={false}>
      <group
        scale={0.003}
        rotation={[0, -Math.PI * 0.5, 0]}
        position={[0.95, 0, -2.235]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, -64.81, 64.77]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder002_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.69, -59.39, -553.38]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder003_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[742.15, -64.53, -508.88]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube003_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[737.62, 46.84, -176.41]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder004_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[789.52, 59.45, -224.91]}
          rotation={[1, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001_RExtr001_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[745.54, 159.32, -5.92]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001_RPanel003_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001_RPanel003_RExtr_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[736.79, -267.14, -33.21]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001_RPanel001_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, 0, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001_RPanel003_RExtr001_spaceship_racer_0.geometry}
          material={materials.spaceship_racer}
          position={[739.26, 0, 0]}
        />
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

        <mesh
          ref={beamRef}
          position={[740, -60, -1350]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <cylinderGeometry args={[70, 25, 1600, 15]} />
          <primitive object={beamMaterial} attach="material" />
        </mesh>

        <pointLight position={[740, -60, -1180]} intensity={2} color="#4fc3ff" distance={600} />
        <pointLight position={[740, -60, -1450]} intensity={1} color="#7b68ff" distance={900} />
      </group>
    </group>
  )
})

useGLTF.preload('/models/spaceship.glb')
