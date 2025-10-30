import { Trophy } from 'lucide-react';
import styles from '../GameOverPage.module.scss';

export const VictoryHeader = () => (
  <>
    <div className={styles.iconWrapper}>
      <Trophy
        className={`${styles.icon} ${styles.trophyIcon} cyan-glow anomaly-shimmer`}
      />
    </div>
    <h1
      className={`${styles.mainTitle} stalker-text glitch ${styles.victoryTitle}`}
    >
      ZONE CLEARED
    </h1>
    <p className={styles.subtitle}>Mission Accomplished</p>
  </>
);
