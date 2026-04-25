import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Play } from 'lucide-react';
import { PixelButton } from '@/components/PixelButton';
import { LEVELS, CHARACTERS, GAME_CONFIG } from './constants';

import styles from './GameMenuPage.module.scss';

export const GameMenuPage = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Очистка интервала при unmount для предотвращения утечки памяти
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Навигация после завершения отсчета
  useEffect(() => {
    if (countdown === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      navigate('/game-play');
    }
  }, [countdown, navigate]);

  const startGame = () => {
    // Очищаем предыдущий интервал, если он существует, чтобы избежать утечки памяти
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCountdown(GAME_CONFIG.COUNTDOWN_DURATION);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return styles.difficultyEasy;
      case 'Normal':
        return styles.difficultyNormal;
      case 'Hard':
        return styles.difficultyHard;
      default:
        return '';
    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Game Menu - Mission Briefing</title>
        <meta
          name="description"
          content="Select your zone and operative before entering the game"
        />
      </Helmet>

      <main className={styles.container}>
        {/* Эффекты фона */}
        <div className={styles.fogOverlay} aria-hidden="true" />

        {/* Аномалийные частицы */}
        <div className={styles.anomalyParticles} aria-hidden="true">
          {Array.from({ length: GAME_CONFIG.PARTICLE_COUNT }).map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className={styles.content}>
          <div className={styles.innerContent}>
            <header className={styles.header}>
              <h1 className={`${styles.title} stalker-text glitch`}>
                MISSION BRIEFING
              </h1>
              <p className={styles.subtitle}>Select Zone and Operative</p>
            </header>
            <section className={styles.grid} aria-label="Game setup options">
              {/* Выбор уровня */}
              <section
                className={`${styles.panel} metal-panel grunge-texture`}
                aria-labelledby="zone-selection-title"
              >
                <div className="scanline" aria-hidden="true" />
                <div className={styles.panelTopLine} aria-hidden="true" />

                <div className={styles.panelContent}>
                  <h2
                    id="zone-selection-title"
                    className={`${styles.panelTitle} stalker-text`}
                  >
                    <span className={styles.iconZap} aria-hidden="true">
                      ⚡
                    </span>
                    Zone Selection
                  </h2>
                  <div className={styles.optionsList} role="group">
                    {LEVELS.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`${styles.optionButton} ${
                          selectedLevel === level.id ? styles.selected : ''
                        } grunge-texture`}
                        aria-pressed={selectedLevel === level.id}
                        aria-label={`Select ${level.name}, ${level.difficulty} difficulty, ${level.zombies} hostiles`}
                      >
                        <div className={styles.optionHeader}>
                          <div className={styles.optionName}>
                            <span
                              className={styles.optionIcon}
                              aria-hidden="true"
                            >
                              {level.icon}
                            </span>
                            <span className={styles.optionText}>
                              {level.name}
                            </span>
                          </div>
                          <span
                            className={`${
                              styles.difficulty
                            } ${getDifficultyClass(level.difficulty)}`}
                          >
                            {level.difficulty}
                          </span>
                        </div>
                        <div className={styles.optionInfo}>
                          <span className={styles.iconSkull} aria-hidden="true">
                            💀
                          </span>
                          Hostiles: {level.zombies}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section
                className={`${styles.panel} metal-panel grunge-texture`}
                aria-labelledby="operative-selection-title"
              >
                <div className="scanline" aria-hidden="true" />
                <div className={styles.panelTopLine} aria-hidden="true" />

                <div className={styles.panelContent}>
                  <h2
                    id="operative-selection-title"
                    className={`${styles.panelTitle} stalker-text`}
                  >
                    <span className={styles.iconUsers} aria-hidden="true">
                      👥
                    </span>
                    Operative Selection
                  </h2>
                  <div className={styles.optionsList} role="group">
                    {CHARACTERS.map((character) => (
                      <button
                        key={character.id}
                        onClick={() => setSelectedCharacter(character.id)}
                        className={`${styles.optionButton} ${
                          selectedCharacter === character.id
                            ? styles.selected
                            : ''
                        } grunge-texture`}
                        aria-pressed={selectedCharacter === character.id}
                        aria-label={`Select ${character.name}, ${character.weapon}, ${character.health} HP`}
                      >
                        <div className={styles.optionHeader}>
                          <div className={styles.optionName}>
                            <span
                              className={styles.optionIcon}
                              aria-hidden="true"
                            >
                              {character.icon}
                            </span>
                            <span className={styles.optionText}>
                              {character.name}
                            </span>
                          </div>
                          <span className={styles.health}>
                            HP: {character.health}
                          </span>
                        </div>
                        <div className={styles.optionInfo}>
                          <span
                            className={styles.iconTarget}
                            aria-hidden="true"
                          >
                            🎯
                          </span>
                          {character.weapon}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </section>

            {/* Подсказки для игрока */}
            <aside
              className={`${styles.tipsPanel} metal-panel radiation-glow`}
              role="note"
              aria-label="Game tips"
            >
              <p className={styles.tipsText}>
                <span aria-hidden="true">⚠</span> Tip: Aim for the head! Collect
                health packs and ammo!
              </p>
            </aside>

            {/* Экшены */}
            <nav className={styles.actions} aria-label="Game controls">
              <PixelButton variant="secondary" size="lg">
                Settings
              </PixelButton>
              <PixelButton
                variant="primary"
                icon={<Play />}
                size="lg"
                onClick={startGame}
                className={styles.primaryButton}
              >
                Begin Mission
              </PixelButton>
              <PixelButton variant="secondary" size="lg">
                Audio
              </PixelButton>
            </nav>

            {/* Обратный отсчет */}
            {countdown !== null && (
              <div
                className={`${styles.countdownOverlay} vignette`}
                role="alert"
                aria-live="assertive"
                aria-label="Mission starting countdown"
              >
                <div className={styles.countdownContent}>
                  <div
                    className={`${styles.countdownNumber} cyan-glow glitch`}
                    aria-label={`${countdown} seconds`}
                  >
                    {countdown}
                  </div>
                  <p className={`${styles.countdownText} stalker-text`}>
                    ENTERING ZONE...
                  </p>
                  <div className={styles.radiationIndicator}>
                    <div
                      className={`${styles.radiationDot} radiation-glow`}
                      aria-hidden="true"
                    />
                    <span className={styles.radiationText}>
                      Radiation Detected
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
