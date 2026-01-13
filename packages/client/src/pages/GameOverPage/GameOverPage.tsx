import { Helmet } from 'react-helmet';
import { Trophy, RotateCcw, Home, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PixelButton } from '@/components/PixelButton';
import { ParticleBackground } from '@/components/ParticleBackground';
import { StatsSection } from './components/StatsSection';
import { GameStats, DEFAULT_STATS } from './types';
import { VictoryHeader, DeathHeader } from './components';
import { useSendLeaderboardResultMutation } from '@/api';
import { selectUserDisplayName, selectUser } from '@/store/slices/userSlice';

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
  const user = useSelector(selectUser);
  const displayName = useSelector(selectUserDisplayName);
  const [sendLeaderboardResult, { isLoading, error }] =
    useSendLeaderboardResultMutation();

  useEffect(() => {
    if (!user || isLoading) return;

    const username = displayName || user.login || 'Anonymous';
    const score = stats.zombiesKilled * 10 + stats.wave * 100;
    const level = stats.wave;

    sendLeaderboardResult({
      username,
      score,
      level,
      timeAlive: stats.timeAlive,
    });
  }, [user, displayName, stats, sendLeaderboardResult, isLoading]);

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
              {victory ? <VictoryHeader /> : <DeathHeader />}
            </header>
            <StatsSection
              zombiesKilled={stats.zombiesKilled}
              timeAlive={stats.timeAlive}
              wave={stats.wave}
              accuracy={stats.accuracy}
              headshots={stats.headshots}
            />
            {error && (
              <div className={styles.errorMessage}>
                Failed to submit score:{' '}
                {'error' in error
                  ? error.error
                  : 'data' in error
                  ? JSON.stringify(error.data)
                  : 'message' in error
                  ? error.message
                  : 'Unknown error'}
              </div>
            )}
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
                onClick={() => navigate('#')}
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
