import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function BlackHole({
    position = [-250, 0, 0],
    scrollProgress = 0,
}) {
    const group = useRef()
    const innerRing = useRef()
    const outerRing = useRef()

    useFrame((_, delta) => {
        if (!group.current) return

        // rotate effects
        if (innerRing.current) innerRing.current.rotation.z -= delta * 0.6
        if (outerRing.current) outerRing.current.rotation.z += delta * 0.2

        // grow after the ship starts flying
        const fly = Math.max(0, scrollProgress - 1)
        const scale = THREE.MathUtils.lerp(
            2,
            18,
            Math.min(fly / 2, 1)
        )

        group.current.scale.setScalar(scale)
    })

    return (
        <group
            ref={group}
            position={position}
            rotation={[0, Math.PI / 2, 0]}
        >
            {/* Event horizon */}
            <mesh>
                <sphereGeometry args={[3.2, 64, 64]} />
                <meshBasicMaterial color="black" />
            </mesh>

            {/* Blue ring */}
            <mesh ref={innerRing}>
                <torusGeometry args={[5.2, 0.45, 32, 256]} />
                <meshBasicMaterial
                    color="#3dbdff"
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* Purple outer glow */}
            <mesh ref={outerRing}>
                <torusGeometry args={[6.8, 0.9, 32, 256]} />
                <meshBasicMaterial
                    color="#7b2cff"
                    transparent
                    opacity={0.45}
                />
            </mesh>

            {/* Faint halo */}
            <mesh>
                <sphereGeometry args={[8.5, 64, 64]} />
                <meshBasicMaterial
                    color="#4a00ff"
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    )
}