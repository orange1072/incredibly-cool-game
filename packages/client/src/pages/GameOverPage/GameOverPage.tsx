import { Helmet } from 'react-helmet';
import { Trophy, RotateCcw, Home, Share2, Skull } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '@/components/PixelButton';
import { Particle } from '@/components/Particle';
import { StatsSection } from './components/StatsSection';
import styles from './GameOverPage.module.scss';

export interface GameOverPageProps {
  victory?: boolean;
}

export const GameOverPage = ({ victory = false }: GameOverPageProps) => {
  const navigate = useNavigate();
  const stats = {
    zombiesKilled: 47,
    timeAlive: '05:32',
    wave: 8,
    accuracy: '73%',
    headshots: 15,
  };

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDelay: Math.random() * 4,
  }));

  return (
    <>
      <Helmet>
        <title>Game Over - Mission Complete</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content={victory ? 'Zone cleared successfully' : 'Mission failed'}
        />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.background} aria-hidden="true">
          <div className={`fog-overlay ${styles.fog}`} />
          {!victory && <div className={styles.redGradient} />}
        </div>
        <div className={styles.particles} aria-hidden="true">
          {particles.map((particle) => (
            <Particle
              key={particle.id}
              color={victory ? 'cyan' : 'red'}
              left={particle.left}
              top={particle.top}
              animationDelay={particle.animationDelay}
            />
          ))}
        </div>
        <main className={styles.content}>
          <div className={styles.innerContainer}>
            <header className={styles.titleSection}>
              {victory ? (
                <>
                  <div className={styles.iconWrapper}>
                    <Trophy
                      className={`${styles.icon} ${styles.trophyIcon} cyan-glow anomaly-shimmer`}
                    />
                  </div>
                  <h1
                    className={`${styles.mainTitle} stalker-text glitch ${styles.victoryTitle}`}
                  >
                    ZONE CLEARED
                  </h1>
                  <p className={styles.subtitle}>Mission Accomplished</p>
                </>
              ) : (
                <>
                  <div className={styles.iconWrapper}>
                    <Skull
                      className={`${styles.icon} ${styles.skullIcon} zombie-pulse`}
                    />
                  </div>
                  <h1
                    className={`${styles.mainTitle} stalker-text glitch ${styles.deathTitle}`}
                  >
                    INFECTED
                  </h1>
                  <p className={styles.subtitle}>Zone Claimed Another Victim</p>
                </>
              )}
            </header>
            <StatsSection
              zombiesKilled={stats.zombiesKilled}
              timeAlive={stats.timeAlive}
              wave={stats.wave}
              accuracy={stats.accuracy}
              headshots={stats.headshots}
            />
            {victory && (
              <aside className={`metal-panel ${styles.trophyPanel} cyan-glow`}>
                <div className={styles.trophyIcon}>🏆</div>
                <div className={`stalker-text ${styles.trophyText}`}>
                  Achievement: Zone Master
                </div>
              </aside>
            )}
            <nav className={styles.actions}>
              <PixelButton
                variant="primary"
                size="lg"
                icon={<RotateCcw className={styles.buttonIcon} />}
                onClick={() => navigate('/game-play')}
                className={styles.retryButton}
              >
                Retry Mission
              </PixelButton>
              <PixelButton
                variant="secondary"
                size="lg"
                icon={<Home className={styles.buttonIcon} />}
                onClick={() => navigate('/game-menu')}
                className={styles.menuButton}
              >
                Main Menu
              </PixelButton>
              <PixelButton
                variant="success"
                size="md"
                icon={<Share2 className={styles.buttonIconSmall} />}
                className={styles.shareButton}
                onClick={() => navigate('/forum')}
              >
                Share on Communication Channel
              </PixelButton>
            </nav>
          </div>
        </main>
        <footer className={styles.quote}>
          <p className={styles.quoteText}>"The Zone never sleeps..."</p>
          <p className={styles.quoteAuthor}>- Old Veteran</p>
        </footer>
      </div>
    </>
  );
};
