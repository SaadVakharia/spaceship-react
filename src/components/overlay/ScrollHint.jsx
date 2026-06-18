import { useEffect, useState } from 'react'
import { SCROLL_HINT } from '../../config/scroll'
import '../../styles/scroll-hint.css'

export function ScrollHint({ visible }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), SCROLL_HINT.delayMs)
    return () => clearTimeout(timer)
  }, [])

  if (!visible || !mounted) return null

  return (
    <div className="scroll-hint">
      <span className="scroll-hint__label">Scroll to explore</span>

      <div className="scroll-hint__track">
        <div className="scroll-hint__pulse" />
      </div>
    </div>
  )
}
