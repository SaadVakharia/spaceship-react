import { useEffect, useState, useRef } from 'react'
import { MAX_SCROLL, SCROLL_SENSITIVITY } from '../config/scroll'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const targetScroll = useRef(0)
  const snapTimeout = useRef(null)

  useEffect(() => {
    let touchStartY = 0

    // Smooth lerping loop driven by requestAnimationFrame
    let animationFrameId
    const loop = () => {
      setScrollProgress((current) => {
        const diff = targetScroll.current - current
        if (Math.abs(diff) < 0.0005) return targetScroll.current
        return current + diff * 0.065 // Smooth interpolation factor
      })
      animationFrameId = requestAnimationFrame(loop)
    }
    animationFrameId = requestAnimationFrame(loop)

    const triggerSnap = () => {
      const currentTarget = targetScroll.current
      if (currentTarget >= 3.2 && currentTarget <= 8.5) {
        // Panels are at 3.5, 4.5, 5.5, 6.5, 7.5
        let nearestPanel = Math.round(currentTarget - 0.5) + 0.5
        nearestPanel = clamp(nearestPanel, 3.5, 7.5) // snap to branding or planet screens
        targetScroll.current = nearestPanel
      }
    }

    const onScrollActivity = (delta) => {
      // Clear snap timeout while actively scrolling
      if (snapTimeout.current) clearTimeout(snapTimeout.current)

      targetScroll.current = clamp(targetScroll.current + delta, 0, MAX_SCROLL)

      // Set snap timeout to trigger when scroll stops (250ms delay)
      snapTimeout.current = setTimeout(() => {
        triggerSnap()
      }, 250)
    }

    const onWheel = (event) => {
      event.preventDefault()
      onScrollActivity(event.deltaY * SCROLL_SENSITIVITY.wheel)
    }

    const onTouchStart = (event) => {
      touchStartY = event.touches[0].clientY
      if (snapTimeout.current) clearTimeout(snapTimeout.current)
    }

    const onTouchMove = (event) => {
      const currentY = event.touches[0].clientY
      const delta = touchStartY - currentY
      touchStartY = currentY
      onScrollActivity(delta * SCROLL_SENSITIVITY.touch)
      event.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      if (snapTimeout.current) clearTimeout(snapTimeout.current)
    }
  }, [])

  return scrollProgress
}
