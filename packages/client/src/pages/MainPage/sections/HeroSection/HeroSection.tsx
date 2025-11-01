import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users } from 'lucide-react';

import { PixelButton } from '@/components/PixelButton';
import {
  ImageWithFallback,
  Logo,
  WarningBadge,
  ScrollIndicator,
} from '@/components/ui';
import { ROUTES } from '@/constants';

import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  scrollY: number;
}

export const HeroSection = memo<HeroSectionProps>(({ scrollY }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.heroSection}>
      <div
        className={styles.parallaxBackground}
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <ImageWithFallback
          src="/landing.png"
          alt="Zone"
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundGradient} />
      </div>

      <div className={styles.heroContent}>
        <Logo />
        <h1 className={styles.title}>
          <div className={styles.mainTitle}>Z.O.N.E.</div>
          <div className={styles.subtitle}>
            Zombie Outbreak Neutralization Expedition
          </div>
        </h1>
        <p className={styles.description}>
          Enter the contaminated wasteland. Face endless zombie hordes. Survive
          the radiation. Become a legend in the Zone.
        </p>
        <div className={styles.ctaButtons}>
          <PixelButton
            variant="primary"
            size="lg"
            icon={<Play />}
            onClick={() => navigate(ROUTES.SIGNIN)}
            className={styles.ctaButton}
          >
            Play Now
          </PixelButton>
          <PixelButton
            variant="secondary"
            size="lg"
            icon={<Users />}
            onClick={() => navigate(ROUTES.SIGNUP)}
            className={styles.ctaButton}
          >
            Join Expedition
          </PixelButton>
        </div>
        <WarningBadge text="Warning: High Radiation Area" />
        <ScrollIndicator />
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
