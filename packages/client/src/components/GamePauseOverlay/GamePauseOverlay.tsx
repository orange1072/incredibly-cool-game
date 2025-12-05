import { useSelector } from 'react-redux';
import styles from './GamePauseOverlay.module.scss';
import { getModifiers } from '@/store/slices/game';
import {
  MAX_ATTACK_SPEED_BONUS,
  MAX_DAMAGE_BONUS,
  MAX_HEALTH_BONUS,
  MAX_MOVEMENT_SPEED_BONUS,
  MAX_XP_BONUS,
  PASSIVE_ATTACK_SPEED_STEP,
  PASSIVE_DAMAGE_STEP,
  PASSIVE_HEALTH_STEP,
  PASSIVE_MOVEMENT_SPEED_STEP,
  PASSIVE_XP_BONUS_STEP,
} from '@/engine/components/PassiveBonusesComponent';

interface PassiveUpgradeInfo {
  key: string;
  label: string;
  stepHint: string;
  current: number;
  max: number;
}

interface GamePauseOverlayProps {
  visible: boolean;
}

export const GamePauseOverlay = ({ visible }: GamePauseOverlayProps) => {
  const modifiers = useSelector(getModifiers);
  if (!visible) return null;

  const passiveUpgrades = [
    {
      key: 'movementSpeed',
      label: 'Скорость передвижения',
      current: Math.round(
        modifiers.movementSpeed / PASSIVE_MOVEMENT_SPEED_STEP
      ),
      max: Math.round(MAX_MOVEMENT_SPEED_BONUS / PASSIVE_MOVEMENT_SPEED_STEP),
      stepHint: `+${PASSIVE_MOVEMENT_SPEED_STEP} за уровень`,
    },
    {
      key: 'damage',
      label: 'Урон снарядов',
      current: Math.round(modifiers.damage / PASSIVE_DAMAGE_STEP),
      max: Math.round(MAX_DAMAGE_BONUS / PASSIVE_DAMAGE_STEP),
      stepHint: `+${PASSIVE_DAMAGE_STEP} за уровень`,
    },
    {
      key: 'attackSpeed',
      label: 'Скорость атаки',
      current: Math.round(modifiers.attackSpeed / PASSIVE_ATTACK_SPEED_STEP),
      max: Math.round(MAX_ATTACK_SPEED_BONUS / PASSIVE_ATTACK_SPEED_STEP),
      stepHint: `-${Math.round(
        PASSIVE_ATTACK_SPEED_STEP * 100
      )}% к кд за уровень`,
    },
    {
      key: 'maxHealth',
      label: 'Макс. здоровье',
      current: Math.round(modifiers.health / PASSIVE_HEALTH_STEP),
      max: Math.round(MAX_HEALTH_BONUS / PASSIVE_HEALTH_STEP),
      stepHint: `+${PASSIVE_HEALTH_STEP} HP за уровень`,
    },
    {
      key: 'xpGain',
      label: 'Бонус опыта',
      current: Math.round(modifiers.xp / PASSIVE_XP_BONUS_STEP),
      max: Math.round(MAX_XP_BONUS / PASSIVE_XP_BONUS_STEP),
      stepHint: `+${Math.round(PASSIVE_XP_BONUS_STEP * 100)}% опыта за уровень`,
    },
  ];
  return (
    <div className={styles.pauseOverlay}>
      <div className={styles.pausePanel}>
        <div className={styles.pauseHeader}>
          <h3>Пауза</h3>
          <p>Взятые апгрейды</p>
        </div>

        <div className={styles.upgradeList}>
          {passiveUpgrades.map((upgrade) => (
            <div className={styles.upgradeRow} key={upgrade.key}>
              <div>
                <div className={styles.upgradeName}>{upgrade.label}</div>
                <div className={styles.upgradeHint}>{upgrade.stepHint}</div>
              </div>
              <div className={styles.upgradeLevel}>
                {upgrade.current} / {upgrade.max}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePauseOverlay;
