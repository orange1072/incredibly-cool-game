import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Send, Radio } from 'lucide-react';
import { PixelButton } from '@/components/PixelButton';
import { ParticleBackground } from '@/components/ParticleBackground';
import { AnimatedPanel } from '@/components/AnimatedPanel';

import sharedStyles from '@/styles/errorPage.module.scss';
import styles from './Error500Page.module.scss';

export function Error500Page() {
  const [countdown, setCountdown] = useState(300);
  const [zombiePos, setZombiePos] = useState(0);
  const [stalkerPos, setStalkerPos] = useState(100);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const animation = setInterval(() => {
      setZombiePos((prev) => (prev >= 90 ? 0 : prev + 1));
      setStalkerPos((prev) => (prev <= 10 ? 100 : prev - 0.8));
    }, 100);

    return () => clearInterval(animation);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleFeedbackSubmit = () => {
    setShowFeedback(false);
    setFeedbackText('');
  };

  return (
    <main className={sharedStyles.container}>
      <ParticleBackground particleCount={20} />

      <div className={sharedStyles.content}>
        <div className={sharedStyles.wrapper}>
          <div className={sharedStyles.header}>
            <div className={sharedStyles.errorCode}>
              <AlertTriangle className={styles.alertIcon} />
              <div className={sharedStyles.glitch}>500</div>
              <AlertTriangle className={styles.alertIcon} />
            </div>
            <h1 className={sharedStyles.title}>SERVER INFECTED</h1>
            <p className={sharedStyles.subtitle}>
              Zombies in the System - Stalkers Are Repairing
            </p>
            <div className={styles.countdown}>
              ⏱ ETA: {formatCountdown(countdown)}
            </div>
          </div>

          <div className={styles.battleAnimation}>
            <div className={styles.scanlineOverlay} />

            <div className={styles.serverRacks}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.rack} />
              ))}
            </div>

            <div className={styles.ground} />

            <div className={styles.zombie} style={{ left: `${zombiePos}%` }}>
              <div className={styles.zombieBody}>
                <div className={styles.zombieHead}>
                  <div className={styles.zombieEye} />
                </div>
              </div>
              <div className={styles.emoticon}>🔨</div>
            </div>

            <div className={styles.stalker} style={{ left: `${stalkerPos}%` }}>
              <div className={styles.stalkerBody}>
                <div className={styles.stalkerHead}>
                  <div className={styles.stalkerEye} />
                </div>
              </div>
              <div className={styles.emoticon}>🔧</div>
            </div>

            <div className={styles.battleEffect}>
              <div className={styles.spark}>⚡</div>
            </div>
          </div>

          <AnimatedPanel className={styles.statusPanel}>
            <div className={styles.statusContent}>
              <h2 className={styles.statusTitle}>
                <div className={sharedStyles.statusDot} />
                System Status
              </h2>
              <div className={styles.statusMessages}>
                <p>→ Anomaly detected in database...</p>
                <p>→ Stalkers eliminating zombie processes...</p>
                <p>→ Restoring connection to the Zone...</p>
                <p className={styles.successMessage}>
                  → Issues will be resolved shortly
                </p>
              </div>
            </div>
          </AnimatedPanel>

          <div className={styles.actions}>
            <PixelButton
              variant="primary"
              size="lg"
              icon={<RefreshCw />}
              onClick={handleRetry}
              className={sharedStyles.fullWidth}
            >
              Retry Connection
            </PixelButton>

            <PixelButton
              variant="secondary"
              size="md"
              onClick={() => setShowFeedback(!showFeedback)}
              className={sharedStyles.fullWidth}
            >
              {showFeedback ? 'Hide Form' : 'Report Anomaly'}
            </PixelButton>
          </div>

          {showFeedback && (
            <AnimatedPanel variant="cyan" className={styles.feedbackPanel}>
              <div className={styles.feedbackContent}>
                <h3 className={styles.feedbackTitle}>Anomaly Report</h3>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the issue..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
                <PixelButton
                  variant="success"
                  size="sm"
                  icon={<Send />}
                  onClick={handleFeedbackSubmit}
                >
                  Transmit Report
                </PixelButton>
              </div>
            </AnimatedPanel>
          )}

          <div className={styles.warning}>
            <p className={styles.warningTitle}>
              ⚠ CRITICAL ERROR: ZOMBIE PROCESS IN SERVER
            </p>
            <p className={styles.warningQuote}>
              <Radio className={styles.radioIcon} />
              "In the Zone, anything is possible. Even zombie servers..." -
              Sidorovich
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
