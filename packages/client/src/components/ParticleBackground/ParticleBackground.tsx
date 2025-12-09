import { memo, useMemo } from 'react';
import { Particle, ParticleColor } from '@/components/Particle';
import styles from './ParticleBackground.module.scss';

interface ParticleBackgroundProps {
  particleCount?: number;
}

export const ParticleBackground = memo<ParticleBackgroundProps>(
  ({ particleCount = 50 }) => {
    const particles = useMemo(() => {
      return Array.from({ length: particleCount }, (_, i) => {
        const colors: ParticleColor[] = ['cyan', 'orange', 'red'];
        const color = colors[i % 3];
        const seed = i + 1;
        const pseudoRandom = (seed * 9301 + 49297) % 233280;

        return {
          id: i,
          color,
          left: (pseudoRandom / 233280) * 100,
          top: (((seed * 49297 + 9301) % 233280) / 233280) * 100,
          animationDelay: (((seed * 12345 + 67890) % 233280) / 233280) * 4,
        };
      });
    }, [particleCount]);

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
    );
  }
);

ParticleBackground.displayName = 'ParticleBackground';
