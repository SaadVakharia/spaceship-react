import { EXPERIENCES } from '../../config/experiences'
import '../../styles/overlays.css'

export function ExperienceProgress({ activeIndex }) {
  return (
    <div className="experience-progress">
      {EXPERIENCES.map((exp, index) => (
        <div
          key={exp.id}
          className={`experience-progress__dot${
            index === activeIndex ? ' experience-progress__dot--active' : ''
          }`}
        />
      ))}
    </div>
  )
}
