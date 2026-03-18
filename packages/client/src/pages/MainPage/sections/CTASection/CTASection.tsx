import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Skull } from 'lucide-react';

import { PixelButton } from '@/components/PixelButton';
import { ROUTE_PATHS } from '@/routes';

import styles from './CTASection.module.scss';

export const CTASection = memo(() => {
  const navigate = useNavigate();

  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>READY TO ENTER THE ZONE?</h2>
        <p className={styles.ctaDescription}>
          Join thousands of stalkers in the ultimate zombie survival experience.
          The Zone is waiting. Are you ready?
        </p>

        <div className={styles.ctaButtonsBottom}>
          <PixelButton
            variant="primary"
            size="lg"
            icon={<Play />}
            onClick={() => navigate(ROUTE_PATHS.signin)}
            className={styles.ctaButton}
          >
            Start Mission
          </PixelButton>
          <PixelButton
            variant="success"
            size="lg"
            icon={<Trophy />}
            onClick={() => navigate(ROUTE_PATHS.leaderboard)}
            className={styles.ctaButton}
          >
            View Rankings
          </PixelButton>
        </div>

        {/* Warning */}
        <div className={styles.freeToPlayBadge}>
          <Skull className={styles.freeToPlayIcon} />
          <span className={styles.freeToPlayText}>
            Free to Play • No Downloads Required
          </span>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';
