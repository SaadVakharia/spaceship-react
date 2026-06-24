import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import '../../styles/loader.css'

export function CustomLoader() {
  const { progress, active } = useProgress()
  const [displayProgress, setDisplayProgress] = useState(0)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    let animationFrameId
    let isAnimating = true
    
    const loop = () => {
      if (!isAnimating) return
      
      setDisplayProgress((current) => {
        if (current >= 100) {
          isAnimating = false
          return 100
        }
        
        let next = current + (progress - current) * 0.05 + 0.2
        
        if (next > progress + 15 && progress !== 100) {
          next = progress + 15
        }
        
        // If loading is actually finished, rapidly accelerate to 100%
        if (!active || progress === 100) {
          next = current + (100 - current) * 0.15 + 1.5
        }
        
        return Math.min(100, next)
      })
      
      if (isAnimating) {
        animationFrameId = requestAnimationFrame(loop)
      }
    }
    
    animationFrameId = requestAnimationFrame(loop)

    return () => {
      isAnimating = false
      cancelAnimationFrame(animationFrameId)
    }
  }, [progress, active])

  useEffect(() => {
    if (displayProgress >= 100 && !active) {
      const timeout = setTimeout(() => setMounted(false), 800)
      return () => clearTimeout(timeout)
    }
  }, [displayProgress, active])

  if (!mounted) return null

  const isComplete = displayProgress >= 100 && !active

  return (
    <div className={`custom-loader ${isComplete ? 'custom-loader--complete' : ''}`}>
      <div className="custom-loader__inner">
        <div className="custom-loader__header">
          <span className="custom-loader__title">LOADING ESCAPE GAMING...</span>
          <span className="custom-loader__text">{Math.round(displayProgress)}%</span>
        </div>
        <div className="custom-loader__track">
          <div 
            className="custom-loader__bar" 
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
