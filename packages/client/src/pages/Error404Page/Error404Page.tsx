import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, AlertTriangle, Radiation } from 'lucide-react';
import { PixelButton } from '@/components/PixelButton';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Input } from '@/components/Input';
import { AnimatedPanel } from '@/components/AnimatedPanel';

import sharedStyles from '@/styles/errorPage.module.scss';
import styles from './Error404Page.module.scss';

export function Error404Page() {
  const navigate = useNavigate();
  const [zombiePosition, setZombiePosition] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (clicked) return;

    const interval = setInterval(() => {
      setZombiePosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => clearInterval(interval);
  }, [clicked]);

  const handleZombieClick = () => {
    setClicked(true);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleReturnToBase = () => {
    navigate('/');
  };

  const handleEnterZone = () => {
    navigate('/game-menu');
  };

  return (
    <main className={sharedStyles.container}>
      <ParticleBackground particleCount={30} />

      <div className={styles.anomalyParticles}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={styles.anomalyParticle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={sharedStyles.content}>
        <div className={sharedStyles.wrapper}>
          <div className={sharedStyles.header}>
            <div className={sharedStyles.errorCode}>
              <div className={sharedStyles.glitch}>404</div>
            </div>
            <h1 className={sharedStyles.title}>ZONE ANOMALY DETECTED</h1>
            <p className={sharedStyles.subtitle}>
              Page Has Mutated Into The Void
            </p>
          </div>

          <div className={styles.zombieAnimation}>
            <div className={styles.scanlineOverlay} />
            <div className={styles.ground} />

            <div className={styles.ruinLeft} />
            <div className={styles.ruinRight} />

            {!clicked ? (
              <button
                onClick={handleZombieClick}
                className={styles.zombie}
                style={{ left: `${zombiePosition}%` }}
              >
                <div className={styles.zombieContainer}>
                  <div className={styles.zombieBody} />
                  <div className={styles.zombieHead}>
                    <div className={styles.zombieEye} />
                  </div>
                  <div className={styles.zombieArmLeft} />
                  <div className={styles.zombieArmRight} />
                </div>
              </button>
            ) : (
              <div className={styles.explosion}>💥</div>
            )}
          </div>

          {clicked && (
            <div className={styles.successMessage}>
              ✓ HOSTILE NEUTRALIZED! Redirecting to safe zone...
            </div>
          )}

          <AnimatedPanel className={styles.instructionsPanel}>
            <div className={styles.instructionsContent}>
              <h2 className={styles.instructionsTitle}>
                <div className={sharedStyles.statusDot} />
                Mini Quest:
              </h2>
              <p className={styles.instructionsText}>
                Click the wandering zombie to "find" the page! 🎯
              </p>
              <p className={styles.instructionsWarning}>
                <AlertTriangle className={sharedStyles.warningIcon} />
                "Anomaly consumed the URL, but you can track it down..."
              </p>
            </div>
          </AnimatedPanel>

          <div className={styles.actionsWrapper}>
            <div className={styles.searchInput}>
              <Input
                type="text"
                placeholder="Search the zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                Icon={<Search />}
              />
            </div>

            <div className={styles.actions}>
              <PixelButton
                variant="primary"
                size="lg"
                icon={<Home />}
                onClick={handleReturnToBase}
                className={sharedStyles.fullWidth}
              >
                Return to Base
              </PixelButton>

              <PixelButton
                variant="secondary"
                size="lg"
                icon={<Radiation />}
                onClick={handleEnterZone}
                className={sharedStyles.fullWidth}
              >
                Enter Zone
              </PixelButton>
            </div>
          </div>

          <div className={styles.warningBar}>
            <AlertTriangle className={sharedStyles.warningIcon} />
            <span>Warning: Zone Unstable. Anomalies Possible.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
