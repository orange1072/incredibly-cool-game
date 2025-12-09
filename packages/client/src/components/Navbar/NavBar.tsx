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
import { ThemeToggle } from '@/components/ThemeToggle';
import styles from './Nav.module.scss';

export const NavBar = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const navItems = [
    { id: '/game-menu', label: 'ZONE', icon: Radiation },
    { id: '/profile', label: 'PROFILE', icon: User },
    { id: '/leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { id: '/forum', label: 'FORUM', icon: Radio },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.scanline} />
      <div className={styles.topLine} />
      <div className={styles.container}>
        <div className={styles.content}>
          <Link to="/" className={styles.logo}>
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
                (item.id === '/game-menu' &&
                  (currentPage === '/game-play' ||
                    currentPage === '/game-menu'));

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
            <ThemeToggle />
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
