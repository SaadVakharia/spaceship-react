import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

// Optimizations vs previous version:
//  - hash uses a single vec2 dot instead of vec3 (cheaper)
//  - fbm reduced from 6 octaves to 3
//  - fbm calls in main() reduced from 8 → 3
//  - no double-warp (was calling fbm twice just for the warp vec2)
//  - uTime updates at ~20fps via JS throttle, not every frame
//  - stars grid halved (180 → 90 cells)
const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1,0));
    float c = hash(i + vec2(0,1));
    float d = hash(i + vec2(1,1));
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }

  // Only 3 octaves — enough for a soft cloud look
  float fbm(vec2 p) {
    float v = 0.0;
    v += 0.500 * noise(p);
    v += 0.250 * noise(p * 2.1 + vec2(1.7, 9.2));
    v += 0.125 * noise(p * 4.3 + vec2(8.3, 2.8));
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.03;

    // Single cheap warp pass
    float warp = fbm(uv * 1.8 + t);

    // Two cloud samples (was 8 fbm calls before)
    float cloud  = fbm(uv * 1.5 + warp * 0.5 + t * 0.08);
    float cloud2 = fbm(uv * 2.8 - warp * 0.3 + t * 0.05 + 3.7);

    float density = smoothstep(0.38, 0.72, cloud) * 0.75
                  + smoothstep(0.42, 0.78, cloud2) * 0.25;

    // Palette
    vec3 deepPurple   = vec3(0.04, 0.00, 0.12);
    vec3 violet       = vec3(0.20, 0.04, 0.36);
    vec3 electricBlue = vec3(0.05, 0.10, 0.52);

    vec3 col = mix(deepPurple, violet, smoothstep(0.3, 0.7, cloud));
    col = mix(col, electricBlue, smoothstep(0.45, 0.80, cloud2) * 0.55);
    col *= 0.12 + density * 1.05;

    // Core glow
    float core = smoothstep(0.64, 0.84, cloud) * smoothstep(0.60, 0.80, cloud2);
    col += vec3(0.30, 0.12, 0.50) * core * 0.55;
    col += vec3(0.08, 0.20, 0.65) * core * 0.35;

    // Vignette
    col *= clamp(1.0 - dot(uv - 0.5, uv - 0.5) * 1.6, 0.0, 1.0);

    // Stars — halved grid resolution (90 vs 180)
    vec2 gi = floor(uv * 90.0);
    vec2 gp = fract(uv * 90.0);
    float h  = hash(gi);
    float h2 = hash(gi + 13.7);
    float star = step(0.97, h)
               * smoothstep(0.02, 0.0, length(gp - 0.5))
               * (0.5 + 0.5 * sin(uTime * (1.5 + h2 * 3.0)));
    col += vec3(0.8, 0.85, 1.0) * star * 0.85;

    gl_FragColor = vec4(col, 1.0);
  }
`

export function Nebula() {
  const meshRef = useRef()
  const lastUpdate = useRef(0)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame((state) => {
    // Throttle uniform updates to ~20fps — imperceptible on a slow nebula
    const now = state.clock.elapsedTime
    if (now - lastUpdate.current > 0.05) {
      uniforms.uTime.value = now
      lastUpdate.current = now
    }
  })

  return (
    <mesh ref={meshRef} frustumCulled={false} renderOrder={-1}>
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
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}