import { Canvas } from '@react-three/fiber'
import { CustomLoader } from '../overlay/CustomLoader'
import { CANVAS_GL, getCameraConfig, getDevicePixelRatio } from '../../config/canvas'
import { SceneRoot } from './SceneRoot'
import '../../styles/app.css'



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

      <CustomLoader />
    </>
  )
}
