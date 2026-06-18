import { useEffect, useState } from 'react'
import { MAX_SCROLL, SCROLL_SENSITIVITY } from '../config/scroll'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let touchStartY = 0

    const updateScroll = (delta) => {
      setScrollProgress((current) => clamp(current + delta, 0, MAX_SCROLL))
    }

    const onWheel = (event) => {
      event.preventDefault()
      updateScroll(event.deltaY * SCROLL_SENSITIVITY.wheel)
    }

    const onTouchStart = (event) => {
      touchStartY = event.touches[0].clientY
    }

    const onTouchMove = (event) => {
      const currentY = event.touches[0].clientY
      const delta = touchStartY - currentY
      touchStartY = currentY
      updateScroll(delta * SCROLL_SENSITIVITY.touch)
      event.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return scrollProgress
}
