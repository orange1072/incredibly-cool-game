import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play,
  Users,
  Trophy,
  Zap,
  Skull,
  Radiation,
  AlertTriangle,
  ChevronDown,
  Github,
} from 'lucide-react'

import styles from './MainPage.module.scss'
import { PixelButton } from '@/components/PixelButton'
import { ImageWithFallback } from '@/components/ui'

export const MainPage = () => {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Skull,
      title: 'Intense Waves',
      description: 'Face endless zombie hordes in brutal top-down combat',
      colorClass: styles.red,
    },
    {
      icon: Radiation,
      title: 'Radiation Zones',
      description: 'Explore contaminated areas with deadly anomalies',
      colorClass: styles.orange,
    },
    {
      icon: Zap,
      title: 'Power-Ups',
      description: 'Collect artifacts and weapons to survive longer',
      colorClass: styles.cyan,
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Compete globally and prove you are the ultimate stalker',
      colorClass: styles.lightCyan,
    },
  ]

  const screenshots = [
    { title: 'City Ruins', emoji: '🏚️' },
    { title: 'Exclusion Zone', emoji: '☢️' },
    { title: 'Ground Zero', emoji: '💀' },
  ]

  return (
    <div className={styles.container}>
      {/* Animated Background Particles */}
      <div className={styles.backgroundParticles}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={`${styles.particle} ${
              i % 3 === 0
                ? styles.cyan
                : i % 3 === 1
                ? styles.orange
                : styles.red
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* Parallax Background */}
        <div
          className={styles.parallaxBackground}
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1563988346830-7e578dca30db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVybm9ieWwlMjBhYmFuZG9uZWQlMjByZWFjdG9yfGVufDF8fHx8MTc2MDA5OTQzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Zone"
            className={styles.backgroundImage}
          />
          <div className={styles.backgroundGradient} />
          <div className={styles.fogOverlay} />
        </div>

        <div className={styles.heroContent}>
          {/* Logo Animation */}
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoGlow} />
              <Radiation className={styles.logoIcon} />
            </div>
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            <div className={styles.mainTitle}>Z.O.N.E.</div>
            <div className={styles.subtitle}>
              Zombie Outbreak Neutralization Expedition
            </div>
          </h1>

          {/* Subtitle */}
          <p className={styles.description}>
            Enter the contaminated wasteland. Face endless zombie hordes.
            Survive the radiation. Become a legend in the Zone.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaButtons}>
            <PixelButton
              variant="primary"
              size="lg"
              icon={<Play />}
              onClick={() => navigate('/signin')}
              className={styles.ctaButton}
            >
              Play Now
            </PixelButton>
            <PixelButton
              variant="secondary"
              size="lg"
              icon={<Users />}
              onClick={() => navigate('/signup')}
              className={styles.ctaButton}
            >
              Join Expedition
            </PixelButton>
          </div>

          {/* Warning Badge */}
          <div className={styles.warningBadge}>
            <AlertTriangle className={styles.warningIcon} />
            <span className={styles.warningText}>
              Warning: High Radiation Area
            </span>
            <AlertTriangle className={styles.warningIcon} />
          </div>

          {/* Scroll Indicator */}
          <div className={styles.scrollIndicator}>
            <ChevronDown className={styles.scrollIcon} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.fogOverlay} />

        <div className={styles.featuresContent}>
          <div className={styles.sectionTitle}>
            <h2 className={styles.sectionTitleText}>GAME FEATURES</h2>
            <div className={styles.sectionDivider} />
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureTopLine} />

                  <div className={styles.featureContent}>
                    <Icon
                      className={`${styles.featureIcon} ${feature.colorClass}`}
                    />
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className={styles.screenshotsSection}>
        <div className={styles.screenshotsContent}>
          <div className={styles.sectionTitle}>
            <h2 className={styles.sectionTitleText}>EXPLORE THE ZONES</h2>
            <div className={styles.sectionDivider} />
          </div>

          <div className={styles.screenshotsGrid}>
            {screenshots.map((screenshot, index) => (
              <div key={index} className={styles.screenshotCard}>
                <div className={styles.screenshotContent}>
                  {/* Screenshot Placeholder */}
                  <div className={styles.screenshotPlaceholder}>
                    <div>
                      <div className={styles.screenshotEmoji}>
                        {screenshot.emoji}
                      </div>
                      <div className={styles.screenshotPreviewText}>
                        Preview
                      </div>
                    </div>
                  </div>

                  <h3 className={styles.screenshotTitle}>{screenshot.title}</h3>
                </div>

                {/* Hover glow */}
                <div className={styles.screenshotBottomLine} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContent}>
          <div className={styles.statsCard}>
            <div className={styles.statsTopLine} />

            <div className={styles.statsGrid}>
              <div>
                <div className={`${styles.statNumber} ${styles.cyan}`}>
                  1000+
                </div>
                <div className={styles.statLabel}>Active Stalkers</div>
              </div>
              <div>
                <div className={`${styles.statNumber} ${styles.orange}`}>
                  50K+
                </div>
                <div className={styles.statLabel}>Zombies Eliminated</div>
              </div>
              <div>
                <div className={`${styles.statNumber} ${styles.lightCyan}`}>
                  24/7
                </div>
                <div className={styles.statLabel}>Zone Access</div>
              </div>
            </div>

            {/* Bottom line */}
            <div className={styles.statsBottomLine} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.fogOverlay} />

        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>READY TO ENTER THE ZONE?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of stalkers in the ultimate zombie survival
            experience. The Zone is waiting. Are you ready?
          </p>

          <div className={styles.ctaButtonsBottom}>
            <PixelButton
              variant="primary"
              size="lg"
              icon={<Play />}
              onClick={() => navigate('/signin')}
              className={styles.ctaButton}
            >
              Start Mission
            </PixelButton>
            <PixelButton
              variant="success"
              size="lg"
              icon={<Trophy />}
              onClick={() => navigate('/leaderboard')}
              className={styles.ctaButton}
            >
              View Rankings
            </PixelButton>
          </div>

          {/* Warning */}
          <div className={styles.freeToPlayBadge}>
            <Skull className={styles.freeToPlayIcon} />
            <span className={styles.freeToPlayText}>
              Free to Play • No Downloads Required
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                {[
                  { page: '', label: 'Main' },
                  { page: 'signin', label: 'Login' },
                  { page: 'signup', label: 'Register' },
                  { page: 'profile', label: 'Profile' },
                  { page: 'demo', label: 'Demo' },
                  { page: 'leaderboard', label: 'Leaderboard' },
                  { page: 'forum', label: 'Forum' },
                  { page: 'error404', label: '404 Error' },
                  { page: 'error500', label: '500 Error' },
                ].map((item) => (
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
    </div>
  )
}
