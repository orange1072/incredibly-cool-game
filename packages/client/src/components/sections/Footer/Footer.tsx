import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Github } from 'lucide-react'

import styles from './Footer.module.scss'

export const Footer = memo(() => {
  const navigate = useNavigate()

  const demoNavigationItems = [
    { page: '', label: 'Main' },
    { page: 'signin', label: 'Login' },
    { page: 'signup', label: 'Register' },
    { page: 'profile', label: 'Profile' },
    { page: 'demo', label: 'Demo' },
    { page: 'leaderboard', label: 'Leaderboard' },
    { page: 'forum', label: 'Forum' },
    { page: 'error404', label: '404 Error' },
    { page: 'error500', label: '500 Error' },
  ]

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
                  onClick={() => navigate(`/${item.page}`)}
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
              onClick={() => navigate('/forum')}
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
  )
})

Footer.displayName = 'Footer'
