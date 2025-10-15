import { memo } from 'react'
import { Particle, ParticleColor } from '@/components/Particle'
import styles from './ParticleBackground.module.scss'

interface ParticleBackgroundProps {
  particleCount?: number
}

export const ParticleBackground = memo<ParticleBackgroundProps>(
  ({ particleCount = 50 }) => {
    const particles = Array.from({ length: particleCount }, (_, i) => {
      const colors: ParticleColor[] = ['cyan', 'orange', 'red']
      const color = colors[i % 3]

      return {
        id: i,
        color,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 4,
      }
    })

    return (
      <div className={styles.backgroundParticles}>
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            color={particle.color}
            left={particle.left}
            top={particle.top}
            animationDelay={particle.animationDelay}
          />
        ))}
      </div>
    )
  }
)

ParticleBackground.displayName = 'ParticleBackground'
