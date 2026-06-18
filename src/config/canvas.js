import * as THREE from 'three'

export const CANVAS_GL = {
  antialias: true,
  alpha: false,
  toneMapping: THREE.NoToneMapping,
  outputColorSpace: THREE.SRGBColorSpace,
}

export function getCameraConfig() {
  const isMobile = window.innerWidth < 768

  return {
    position: [-5, 6, 10],
    fov: isMobile ? 32 : 25,
    near: 0.1,
    far: 1000,
  }
}

export function getDevicePixelRatio() {
  return [1, Math.min(window.devicePixelRatio, 2)]
}
