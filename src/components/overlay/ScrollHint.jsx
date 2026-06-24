import { useEffect, useState } from 'react'
import { SCROLL_HINT } from '../../config/scroll'
import '../../styles/scroll-hint.css'

export function ScrollHint({ scrollProgress }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), SCROLL_HINT.delayMs)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  // Fade out smoothly between 3.0 and 3.5 (right as 2D zone starts)
  const opacity = scrollProgress >= 3.5 ? 0 : scrollProgress >= 3.0 ? 1 - (scrollProgress - 3.0) / 0.5 : 1

  if (opacity <= 0.001) return null

  return (
    <div className="scroll-hint" style={{ opacity }}>
      <span className="scroll-hint__label">Scroll to explore</span>

      <div className="scroll-hint__track">
        <div className="scroll-hint__pulse" />
      </div>
    </div>
  )
}
