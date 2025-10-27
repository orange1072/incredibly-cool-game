import { Helmet } from 'react-helmet';
import { Trophy, RotateCcw, Home, Share2, Skull } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PixelButton } from '@/components/PixelButton';
import { ParticleBackground } from '@/components/ParticleBackground';
import { StatsSection } from './components/StatsSection';
import { GameStats, DEFAULT_STATS } from './types';
import styles from './GameOverPage.module.scss';

export interface GameOverPageProps {
  victory?: boolean;
  stats?: GameStats;
}

export const GameOverPage = ({
  victory = false,
  stats = DEFAULT_STATS,
}: GameOverPageProps) => {
  const navigate = useNavigate();

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
          {!victory && <div className={styles.redGradient} />}
        </div>
        <div className={styles.particles} aria-hidden="true">
          <ParticleBackground particleCount={30} />
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
                <Trophy className={styles.trophyIcon} />
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
