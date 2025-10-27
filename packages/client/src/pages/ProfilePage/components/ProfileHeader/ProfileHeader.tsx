import { AnalyticSVG } from '@/assets/icons';
import styles from '../../styles.module.scss';

export const ProfileHeader = () => (
  <div className={styles.top}>
    <h3 className={styles.title}>
      <span className={styles.icon}>
        <AnalyticSVG />
      </span>
      PERSONAL DATA ARCHIVE
    </h3>
    <p className={styles.subtitle}>Stalker Profile Management</p>
  </div>
);
