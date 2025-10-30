import { Skull } from 'lucide-react';
import styles from '../GameOverPage.module.scss';

export const DeathHeader = () => (
  <>
    <div className={styles.iconWrapper}>
      <Skull className={`${styles.icon} ${styles.skullIcon} zombie-pulse`} />
    </div>
    <h1
      className={`${styles.mainTitle} stalker-text glitch ${styles.deathTitle}`}
    >
      INFECTED
    </h1>
    <p className={styles.subtitle}>Zone Claimed Another Victim</p>
  </>
);
