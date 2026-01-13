import {
  COMPONENT_TYPES,
  type PassiveBonusesComponentState,
  type PassiveBonusKind,
  type PassiveBonusOption,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types';
import type { PassiveBonusSnapshot } from '@/types/component.types';

export const PASSIVE_MOVEMENT_SPEED_STEP = 10;
export const PASSIVE_DAMAGE_STEP = 10;
export const PASSIVE_ATTACK_SPEED_STEP = 0.1;
export const PASSIVE_HEALTH_STEP = 50;
export const PASSIVE_XP_BONUS_STEP = 0.1;
export const MIN_ATTACK_COOLDOWN = 0.1;
export const MAX_MOVEMENT_SPEED_BONUS = PASSIVE_MOVEMENT_SPEED_STEP * 10;
export const MAX_DAMAGE_BONUS = PASSIVE_DAMAGE_STEP * 10;
export const MAX_ATTACK_SPEED_BONUS = 1;
export const MAX_HEALTH_BONUS = PASSIVE_HEALTH_STEP * 10;
export const MAX_XP_BONUS = PASSIVE_XP_BONUS_STEP * 10;

export const PASSIVE_BONUS_OPTIONS: PassiveBonusOption[] = [
  {
    kind: 'movementSpeed',
    label: 'Скорость передвижения',
    description: `Increase movement speed by ${PASSIVE_MOVEMENT_SPEED_STEP} units per second`,
  },
  {
    kind: 'damage',
    label: 'Урон',
    description: `Increase projectile damage by ${PASSIVE_DAMAGE_STEP} points`,
  },
  {
    kind: 'attackSpeed',
    label: 'Скорость атаки',
    description: `Reduce attack cooldown by roughly ${
      PASSIVE_ATTACK_SPEED_STEP * 100
    }%`,
  },
  {
    kind: 'maxHealth',
    label: 'Здоровье',
    description: `Increase max health by ${PASSIVE_HEALTH_STEP} (up to ${MAX_HEALTH_BONUS})`,
  },
  {
    kind: 'fullHeal',
    label: 'Полное лечение',
    description: 'Instantly heal to full health (one-time)',
  },
  {
    kind: 'xpGain',
    label: 'Бонус опыта',
    description: `Increase XP gain by ${PASSIVE_XP_BONUS_STEP * 100}%`,
  },
];

class PassiveBonusesComponent
  implements IPureDataComponent, PassiveBonusesComponentState
{
  type = COMPONENT_TYPES.passiveBonuses;
  entity!: IEntity;
  baseMovementSpeed: number;
  baseDamage: number;
  baseAttackCooldown: number;
  movementSpeedBonus: number;
  damageBonus: number;
  attackSpeedBonus: number;
  healthBonus: number;
  xpBonus: number;
  healUsed: boolean;
  selectionsUsed: number;

  constructor({
    baseMovementSpeed,
    baseDamage,
    baseAttackCooldown,
    movementSpeedBonus = 0,
    damageBonus = 0,
    attackSpeedBonus = 0,
    healthBonus = 0,
    xpBonus = 0,
    healUsed = false,
    selectionsUsed = 0,
  }: PassiveBonusesComponentState) {
    this.baseMovementSpeed = Math.max(0, baseMovementSpeed);
    this.baseDamage = Math.max(0, baseDamage);
    this.baseAttackCooldown = Math.max(MIN_ATTACK_COOLDOWN, baseAttackCooldown);
    this.movementSpeedBonus = Math.max(
      0,
      Math.min(movementSpeedBonus, MAX_MOVEMENT_SPEED_BONUS)
    );
    this.damageBonus = Math.max(0, Math.min(damageBonus, MAX_DAMAGE_BONUS));
    this.attackSpeedBonus = Math.max(
      0,
      Math.min(attackSpeedBonus, MAX_ATTACK_SPEED_BONUS)
    );
    this.healthBonus = Math.max(0, Math.min(healthBonus, MAX_HEALTH_BONUS));
    this.xpBonus = Math.max(0, Math.min(xpBonus, MAX_XP_BONUS));
    this.healUsed = healUsed;
    this.selectionsUsed = Math.max(0, selectionsUsed);
  }

  applyPassiveBonus(kind: PassiveBonusKind): PassiveBonusSnapshot {
    switch (kind) {
      case 'movementSpeed': {
        this.movementSpeedBonus = Math.min(
          MAX_MOVEMENT_SPEED_BONUS,
          this.movementSpeedBonus + PASSIVE_MOVEMENT_SPEED_STEP
        );
        break;
      }
      case 'damage': {
        this.damageBonus = Math.min(
          MAX_DAMAGE_BONUS,
          this.damageBonus + PASSIVE_DAMAGE_STEP
        );
        break;
      }
      case 'attackSpeed': {
        this.attackSpeedBonus = Math.min(
          MAX_ATTACK_SPEED_BONUS,
          this.attackSpeedBonus + PASSIVE_ATTACK_SPEED_STEP
        );
        break;
      }
      case 'maxHealth': {
        this.healthBonus = Math.min(
          MAX_HEALTH_BONUS,
          this.healthBonus + PASSIVE_HEALTH_STEP
        );
        break;
      }
      case 'xpGain': {
        this.xpBonus = Math.min(
          MAX_XP_BONUS,
          this.xpBonus + PASSIVE_XP_BONUS_STEP
        );
        break;
      }
      case 'fullHeal': {
        this.healUsed = true;
        break;
      }
      default:
        break;
    }

    this.selectionsUsed += 1;
    return this.getSnapshot();
  }

  getMovementSpeed(): number {
    return this.baseMovementSpeed + this.movementSpeedBonus;
  }

  getDamage(): number {
    return this.baseDamage + this.damageBonus;
  }

  getAttackCooldown(): number {
    const multiplier = 1 + this.attackSpeedBonus;
    const adjusted =
      multiplier <= 0
        ? this.baseAttackCooldown
        : this.baseAttackCooldown / multiplier;
    return Math.max(MIN_ATTACK_COOLDOWN, adjusted);
  }

  getMaxHealthBonus(): number {
    return this.healthBonus;
  }

  getXpMultiplier(): number {
    return 1 + this.xpBonus;
  }

  getSnapshot(): PassiveBonusSnapshot {
    return {
      baseMovementSpeed: this.baseMovementSpeed,
      baseDamage: this.baseDamage,
      baseAttackCooldown: this.baseAttackCooldown,
      movementSpeedBonus: this.movementSpeedBonus,
      damageBonus: this.damageBonus,
      attackSpeedBonus: this.attackSpeedBonus,
      healthBonus: this.healthBonus,
      xpBonus: this.xpBonus,
      healUsed: this.healUsed,
      selectionsUsed: this.selectionsUsed,
    };
  }
}

export default PassiveBonusesComponent;
