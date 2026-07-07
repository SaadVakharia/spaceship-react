import { useEffect, useState, useRef } from 'react'
import { MAX_SCROLL, PLANETS_START, SCROLL_SENSITIVITY } from '../config/scroll'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const targetScroll = useRef(0)
  const isSnapping = useRef(true)
  const gateLocked = useRef(false) // once true, can't scroll back below PLANETS_START
  const lastScrollTime = useRef(0)

  const scrollTo = (value) => {
    const minScroll = gateLocked.current ? PLANETS_START : 0
    targetScroll.current = clamp(value, minScroll, MAX_SCROLL)
    if (value >= PLANETS_START) gateLocked.current = true
    isSnapping.current = true
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

        // Fast, punchy lerp for discrete page turns
        return current + diff * 0.07
      })
      animationFrameId = requestAnimationFrame(loop)
    }
    animationFrameId = requestAnimationFrame(loop)

    const ALL_STOPS = [0, 1.5, 3.0, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5, 16.5, 17.5]

    const handleDiscreteScroll = (direction) => {
      const now = Date.now()
      // Cooldown to prevent multiple page jumps from a single flick/swipe
      if (now - lastScrollTime.current < 600) return
      
      const currentTarget = targetScroll.current
      const minScroll = gateLocked.current ? PLANETS_START : 0

      if (direction > 0) {
        // Next page
        const nextStop = ALL_STOPS.find(stop => stop > currentTarget + 0.1)
        if (nextStop !== undefined) {
          targetScroll.current = nextStop
          isSnapping.current = true
          lastScrollTime.current = now
        }
      } else {
        // Prev page
        const prevStops = ALL_STOPS.filter(stop => stop < currentTarget - 0.1)
        if (prevStops.length > 0) {
          targetScroll.current = Math.max(minScroll, prevStops[prevStops.length - 1])
          isSnapping.current = true
          lastScrollTime.current = now
        }
      }

      // Lock the gate once we've reached the 2D zone
      if (targetScroll.current >= PLANETS_START) {
        gateLocked.current = true
      }
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
      
      // Ignore tiny unintentional trackpad movements
      if (Math.abs(event.deltaY) < 10) return
      
      handleDiscreteScroll(event.deltaY > 0 ? 1 : -1)
    }

    const onTouchStart = (event) => {
      touchStartY = event.touches[0].clientY
    }

    const onTouchMove = (event) => {
      const currentY = event.touches[0].clientY
      const delta = touchStartY - currentY

      if (isScrollableScrollEvent(event, delta)) return
      event.preventDefault() // prevent native overscroll/bounce

      // Require a meaningful swipe distance to trigger
      if (Math.abs(delta) > 50) {
        handleDiscreteScroll(delta > 0 ? 1 : -1)
        touchStartY = currentY
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return { scrollProgress, scrollTo }
}
