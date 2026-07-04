import { useEffect, useState, useRef } from 'react'
import { MAX_SCROLL, PLANETS_START, SCROLL_SENSITIVITY } from '../config/scroll'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const targetScroll = useRef(0)
  const snapTimeout = useRef(null)
  const isSnapping = useRef(false)
  const gateLocked = useRef(false) // once true, can't scroll back below PLANETS_START

  const scrollTo = (value) => {
    if (snapTimeout.current) clearTimeout(snapTimeout.current)
    const minScroll = gateLocked.current ? PLANETS_START : 0
    targetScroll.current = clamp(value, minScroll, MAX_SCROLL)
    if (value >= PLANETS_START) gateLocked.current = true
  }

  useEffect(() => {
    let touchStartY = 0

    // Smooth lerping loop driven by requestAnimationFrame
    let animationFrameId
    const loop = () => {
      setScrollProgress((current) => {
        const diff = targetScroll.current - current
        if (Math.abs(diff) < 0.0005) {
          isSnapping.current = false // snap finished
          return targetScroll.current
        }

        const baseLerp = current >= PLANETS_START ? 0.08 : 0.025
        const lerpFactor = isSnapping.current ? 0.05 : baseLerp
        return current + diff * lerpFactor
      })
      animationFrameId = requestAnimationFrame(loop)
    }
    animationFrameId = requestAnimationFrame(loop)

    const triggerSnap = () => {
      const currentTarget = targetScroll.current
      if (currentTarget >= 3.2 && currentTarget <= 9.0) {
        let nearestPanel = Math.round(currentTarget - 0.5) + 0.5
        nearestPanel = clamp(nearestPanel, 3.5, 8.5)
        targetScroll.current = nearestPanel
        isSnapping.current = true
      }
    }

    const onScrollActivity = (delta) => {
      isSnapping.current = false
      if (snapTimeout.current) clearTimeout(snapTimeout.current)

      const minScroll = gateLocked.current ? PLANETS_START : 0
      targetScroll.current = clamp(targetScroll.current + delta, minScroll, MAX_SCROLL)

      // Lock the gate once we've reached the 2D zone
      if (targetScroll.current >= PLANETS_START) {
        gateLocked.current = true
      }

      // Wait a generous 600ms before snapping so it doesn't fight the user's natural scroll pauses
      snapTimeout.current = setTimeout(() => {
        triggerSnap()
      }, 600)
    }

    const isScrollableScrollEvent = (event, deltaY) => {
      const scrollable = event.target.closest('.contact-inner')
      if (!scrollable) return false

      const isAtTop = scrollable.scrollTop <= 0
      const isAtBottom = Math.abs(scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop) < 1

      if (deltaY < 0 && !isAtTop) return true // native scroll up
      if (deltaY > 0 && !isAtBottom) return true // native scroll down

      return false
    }

    const onWheel = (event) => {
      if (isScrollableScrollEvent(event, event.deltaY)) return

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

      if (isScrollableScrollEvent(event, delta)) return

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

  return { scrollProgress, scrollTo }
}
