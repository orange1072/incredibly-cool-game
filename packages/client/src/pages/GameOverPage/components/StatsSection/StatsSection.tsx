import styles from './StatsSection.module.scss';
import { GameStats } from '../../types';

interface StatsSectionProps extends GameStats {}

export const StatsSection = ({
  zombiesKilled,
  timeAlive,
  wave,
  accuracy,
  headshots,
}: StatsSectionProps) => {
  return (
    <section
      className={`metal-panel grunge-texture scanline ${styles.statsPanel}`}
    >
      <div className={styles.topLine} />
      <div className={styles.statsContent}>
        <h2 className={`stalker-text ${styles.statsTitle}`}>
          Mission Statistics
        </h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{zombiesKilled}</div>
            <div className={styles.statLabel}>Eliminated</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{timeAlive}</div>
            <div className={styles.statLabel}>Time</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>{wave}</div>
            <div className={styles.statLabel}>Wave</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>{accuracy}</div>
            <div className={styles.statLabel}>Accuracy</div>
          </div>
        </div>
        <div className={`${styles.headshotsCard} radiation-glow`}>
          <span className={styles.headshotIcon}>🎯</span>
          <div>
            <span className={styles.headshotLabel}>Headshots: </span>
            <span className={styles.headshotValue}>{headshots}</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomLine} />
    </section>
  );
};
