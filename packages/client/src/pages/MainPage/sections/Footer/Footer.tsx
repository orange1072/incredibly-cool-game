import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { ROUTES } from '@/constants';

import styles from './Footer.module.scss';

export const Footer = memo(() => {
  const navigate = useNavigate();

  const demoNavigationItems = [
    { page: ROUTES.HOME, label: 'Main' },
    { page: ROUTES.SIGNIN, label: 'Login' },
    { page: ROUTES.SIGNUP, label: 'Register' },
    { page: ROUTES.PROFILE, label: 'Profile' },
    { page: ROUTES.DEMO, label: 'Demo' },
    { page: ROUTES.GAME_MENU, label: 'Game Menu' },
    { page: ROUTES.GAME_OVER, label: 'Game Over' },
    { page: ROUTES.LEADERBOARD, label: 'Leaderboard' },
    { page: ROUTES.FORUM, label: 'Forum' },
    { page: ROUTES.ERROR_404, label: '404 Error' },
    { page: ROUTES.ERROR_500, label: '500 Error' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Demo Navigation */}
        <div className={styles.demoNavigation}>
          <div className={styles.demoNavigationContent}>
            <div className={styles.demoNavigationTitle}>
              <div className={styles.demoNavigationIndicator} />
              Demo Navigation - All Screens
            </div>
            <div className={styles.demoNavigationGrid}>
              {demoNavigationItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => navigate(item.page)}
                  className={styles.demoNavigationButton}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

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
            <button
              onClick={() => navigate(ROUTES.FORUM)}
              className={styles.footerLink}
            >
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
