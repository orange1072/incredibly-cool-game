import { memo } from 'react';
import { Button } from '../Button';
import styles from '../GameCanvas/GameCanvas.module.scss';

interface GameOverPopupProps {
  onRestart: () => void;
}

export const GameOverPopup = memo(({ onRestart }: GameOverPopupProps) => (
  <div className={styles.overlay}>
    <div className={styles.popup}>
      <h2 className={styles.title}>You were killed</h2>
      <Button className={styles.restartButton} onClick={onRestart}>
        Restart
      </Button>
    </div>
  </div>
));

GameOverPopup.displayName = 'GameOverPopup';
