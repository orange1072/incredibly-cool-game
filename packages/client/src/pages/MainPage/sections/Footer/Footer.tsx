import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';

import styles from './Footer.module.scss';

export const Footer = memo(() => {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <div className={styles.footerTitle}>Z.O.N.E.</div>
            <div className={styles.footerSubtitle}>
              Created for Yandex Praktikum Junior Team
            </div>
          </div>

          <div className={styles.footerLinks}>
            <button className={styles.footerIcon}>
              <Github />
            </button>
            <button onClick={() => navigate('#')} className={styles.footerLink}>
              Community
            </button>
            <button className={styles.footerLink}>About</button>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          © 2025 Z.O.N.E. Project. All anomalies reserved.
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
