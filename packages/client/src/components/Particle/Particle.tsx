import { memo } from 'react'
import styles from './Particle.module.scss'

export type ParticleColor = 'cyan' | 'orange' | 'red'

interface ParticleProps {
  color: ParticleColor
  left: number
  top: number
  animationDelay: number
}

export const Particle = memo<ParticleProps>(
  ({ color, left, top, animationDelay }) => {
    return (
      <div
        className={`${styles.particle} ${styles[color]}`}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          animationDelay: `${animationDelay}s`,
        }}
      />
    )
  }
)

Particle.displayName = 'Particle'
