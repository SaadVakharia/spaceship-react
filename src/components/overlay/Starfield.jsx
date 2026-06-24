import { useMemo } from 'react'
import '../../styles/starfield.css'

const generateStars = (n, maxWidth, maxHeight) => {
  let shadow = ''
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * maxWidth)
    const y = Math.floor(Math.random() * maxHeight)
    shadow += `${x}px ${y}px #FFF${i === n - 1 ? '' : ', '}`
  }
  return shadow
}

export function Starfield({ scrollProgress }) {
  // Fade in at 3.0, fully visible at 3.5
  const opacity = scrollProgress < 3.0 ? 0 : scrollProgress < 3.5 ? (scrollProgress - 3.0) / 0.5 : 1

  const smallStars = useMemo(() => generateStars(150, 2000, 2000), [])
  const mediumStars = useMemo(() => generateStars(75, 2000, 2000), [])
  const largeStars = useMemo(() => generateStars(35, 2000, 2000), [])

  if (opacity <= 0.001) return null

  return (
    <div className="starfield-wrapper" style={{ opacity }}>
      <div className="star-layer-container stars-small">
        <div className="star-layer" style={{ boxShadow: smallStars }} />
        <div className="star-layer star-layer--after" style={{ boxShadow: smallStars }} />
      </div>

      <div className="star-layer-container stars-medium">
        <div className="star-layer" style={{ boxShadow: mediumStars }} />
        <div className="star-layer star-layer--after" style={{ boxShadow: mediumStars }} />
      </div>

      <div className="star-layer-container stars-large">
        <div className="star-layer" style={{ boxShadow: largeStars }} />
        <div className="star-layer star-layer--after" style={{ boxShadow: largeStars }} />
      </div>
    </div>
  )
}
