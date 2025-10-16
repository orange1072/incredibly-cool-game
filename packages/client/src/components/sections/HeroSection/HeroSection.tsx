import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Users } from 'lucide-react'

import { PixelButton } from '@/components/PixelButton'
import {
  ImageWithFallback,
  Logo,
  WarningBadge,
  ScrollIndicator,
} from '@/components/ui'

import styles from './HeroSection.module.scss'

interface HeroSectionProps {
  scrollY: number
}

export const HeroSection = memo<HeroSectionProps>(({ scrollY }) => {
  const navigate = useNavigate()

  return (
    <section className={styles.heroSection}>
      {/* Parallax Background */}
      <div
        className={styles.parallaxBackground}
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1563988346830-7e578dca30db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVybm9ieWwlMjBhYmFuZG9uZWQlMjByZWFjdG9yfGVufDF8fHx8MTc2MDA5OTQzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Zone"
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundGradient} />
      </div>

      <div className={styles.heroContent}>
        {/* Logo Animation */}
        <Logo />

        {/* Title */}
        <h1 className={styles.title}>
          <div className={styles.mainTitle}>Z.O.N.E.</div>
          <div className={styles.subtitle}>
            Zombie Outbreak Neutralization Expedition
          </div>
        </h1>

        {/* Subtitle */}
        <p className={styles.description}>
          Enter the contaminated wasteland. Face endless zombie hordes. Survive
          the radiation. Become a legend in the Zone.
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          <PixelButton
            variant="primary"
            size="lg"
            icon={<Play />}
            onClick={() => navigate('/signin')}
            className={styles.ctaButton}
          >
            Play Now
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="lg"
            icon={<Users />}
            onClick={() => navigate('/signup')}
            className={styles.ctaButton}
          >
            Join Expedition
          </PixelButton>
        </div>
        <WarningBadge text="Warning: High Radiation Area" />
        <ScrollIndicator />
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'
