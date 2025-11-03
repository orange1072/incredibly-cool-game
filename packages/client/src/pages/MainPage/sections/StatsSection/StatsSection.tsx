import { memo } from 'react';
import styles from './StatsSection.module.scss';

interface Stat {
  number: string;
  label: string;
  colorClass: string;
}

const stats: Stat[] = [
  {
    number: '1000+',
    label: 'Active Stalkers',
    colorClass: styles.cyan,
  },
  {
    number: '50K+',
    label: 'Zombies Eliminated',
    colorClass: styles.orange,
  },
  {
    number: '24/7',
    label: 'Zone Access',
    colorClass: styles.lightCyan,
  },
];

export const StatsSection = memo(() => {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsContent}>
        <div className={styles.statsCard}>
          <div className={styles.statsTopLine} />

          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div className={`${styles.statNumber} ${stat.colorClass}`}>
                  {stat.number}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bottom line */}
          <div className={styles.statsBottomLine} />
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';
