import { Link, useLocation } from 'react-router-dom';
import {
  Radiation,
  User,
  Trophy,
  Radio,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { clearCacheAndUpdate } from '@/utils/clearCacheAndUpdate';
import { ROUTE_PATHS } from '@/routes';
import styles from './Nav.module.scss';

export const NavBar = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const navItems = [
    { id: ROUTE_PATHS.gameMenu, label: 'ZONE', icon: Radiation },
    { id: ROUTE_PATHS.profile, label: 'PROFILE', icon: User },
    { id: ROUTE_PATHS.leaderboard, label: 'LEADERBOARD', icon: Trophy },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.scanline} />
      <div className={styles.topLine} />
      <div className={styles.container}>
        <div className={styles.content}>
          <Link to={ROUTE_PATHS.root} className={styles.logo}>
            <div className={styles.logoIcon}>
              <div className={styles.logoGlow} />
              <Radiation className={styles.radiationIcon} />
            </div>
            <div>
              <div className={styles.logoTitle}>
                Z.O.N.E.
                <Activity className={styles.activityIcon} />
              </div>
              <div className={styles.logoSubtitle}>
                Zombie Outbreak Neutralization
              </div>
            </div>
          </Link>
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (item.id === ROUTE_PATHS.gameMenu &&
                  (currentPage === ROUTE_PATHS.gamePlay ||
                    currentPage === ROUTE_PATHS.gameMenu));

              return (
                <Link
                  key={item.id}
                  to={item.id}
                  className={`${styles.navItem} ${
                    isActive ? styles.active : ''
                  }`}
                >
                  <Icon className={styles.navIcon} />
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={clearCacheAndUpdate}
              className={styles.cacheButton}
              title="Clear cache"
            >
              <RefreshCw className={styles.navIcon} />
              <span className={styles.navLabel}>CACHE</span>
            </button>
          </nav>
        </div>
      </div>
      <div className={styles.bottomLine} />
    </header>
  );
};
