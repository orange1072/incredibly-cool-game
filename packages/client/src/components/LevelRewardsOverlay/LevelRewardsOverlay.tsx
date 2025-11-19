import type GameStats from '@/types/game-stats.types';
import type { PassiveBonusKind } from '@/types/component.types';
import styles from '../GameCanvas/GameCanvas.module.scss';

type LevelRewardsState = GameStats['levelRewards'];

interface LevelRewardsOverlayProps {
  levelRewards: LevelRewardsState;
  onBonusPick: (bonus: PassiveBonusKind) => void;
  onClose: () => void;
}

export const LevelRewardsOverlay = ({
  levelRewards,
  onBonusPick,
  onClose,
}: LevelRewardsOverlayProps) => {
  if (!levelRewards.visible || levelRewards.options.length === 0) {
    return null;
  }

  return (
    <div className={styles.levelUpOverlay}>
      <div className={styles.levelUpPanel}>
        <div className={styles.levelUpHeader}>
          <h3>Повышение уровня</h3>
          <p>
            Осталось выборов: <strong>{levelRewards.pending}</strong>
          </p>
        </div>

        <div className={styles.levelUpOptions}>
          {levelRewards.options.map((option) => (
            <button
              key={option.kind}
              className={styles.levelUpOptionButton}
              type="button"
              onClick={() => onBonusPick(option.kind)}
            >
              <span className={styles.optionTitle}>{option.label}</span>
              <span className={styles.optionDescription}>
                {option.description}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.dismissButton}
          onClick={onClose}
          disabled={levelRewards.pending > 0}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default LevelRewardsOverlay;
