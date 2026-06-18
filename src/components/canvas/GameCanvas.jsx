import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { CANVAS_GL, getCameraConfig, getDevicePixelRatio } from '../../config/canvas'
import { SceneRoot } from './SceneRoot'
import '../../styles/app.css'

const LOADER_STYLES = {
  container: { background: '#000' },
  inner: { width: 'min(320px, 70vw)' },
  data: {
    color: '#fff',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontSize: '0.65rem',
  },
  bar: { background: '#fff' },
  progress: { background: '#111' },
}

export function GameCanvas({ scrollProgress }) {
  return (
    <>
      <div className="canvas-container">
        <Canvas
          gl={CANVAS_GL}
          camera={getCameraConfig()}
          dpr={getDevicePixelRatio()}
        >
          <SceneRoot scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      <Loader
        containerStyles={LOADER_STYLES.container}
        innerStyles={LOADER_STYLES.inner}
        dataStyles={LOADER_STYLES.data}
        barStyles={LOADER_STYLES.bar}
        progressStyles={LOADER_STYLES.progress}
      />
    </>
  )
}
