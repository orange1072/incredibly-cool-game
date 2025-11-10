import {
  COMPONENT_TYPES,
  type PassiveBonusesComponentState,
  type PassiveBonusKind,
  type PassiveBonusOption,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types';

export const PASSIVE_MOVEMENT_SPEED_STEP = 40;
export const PASSIVE_DAMAGE_STEP = 25;
export const PASSIVE_ATTACK_SPEED_STEP = 0.1;
export const MIN_ATTACK_COOLDOWN = 0.1;
export const MAX_ATTACK_SPEED_BONUS = 3;

export const PASSIVE_BONUS_OPTIONS: PassiveBonusOption[] = [
  {
    kind: 'movementSpeed',
    label: 'movementSpeed',
    description: 'Increase movement speed by 40 units per second',
  },
  {
    kind: 'damage',
    label: 'damage',
    description: 'Increase projectile damage by 25 points',
  },
  {
    kind: 'attackSpeed',
    label: 'attackSpeed',
    description: 'Reduce attack cooldown by roughly 10%',
  },
];

export interface PassiveBonusSnapshot {
  baseMovementSpeed: number;
  baseDamage: number;
  baseAttackCooldown: number;
  movementSpeedBonus: number;
  damageBonus: number;
  attackSpeedBonus: number;
  selectionsUsed: number;
}

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
  selectionsUsed: number;

  constructor({
    baseMovementSpeed,
    baseDamage,
    baseAttackCooldown,
    movementSpeedBonus = 0,
    damageBonus = 0,
    attackSpeedBonus = 0,
    selectionsUsed = 0,
  }: PassiveBonusesComponentState) {
    this.baseMovementSpeed = Math.max(0, baseMovementSpeed);
    this.baseDamage = Math.max(0, baseDamage);
    this.baseAttackCooldown = Math.max(MIN_ATTACK_COOLDOWN, baseAttackCooldown);
    this.movementSpeedBonus = Math.max(0, movementSpeedBonus);
    this.damageBonus = Math.max(0, damageBonus);
    this.attackSpeedBonus = Math.max(
      0,
      Math.min(attackSpeedBonus, MAX_ATTACK_SPEED_BONUS)
    );
    this.selectionsUsed = Math.max(0, selectionsUsed);
  }

  applyPassiveBonus(kind: PassiveBonusKind): PassiveBonusSnapshot {
    switch (kind) {
      case 'movementSpeed': {
        this.movementSpeedBonus += PASSIVE_MOVEMENT_SPEED_STEP;
        break;
      }
      case 'damage': {
        this.damageBonus += PASSIVE_DAMAGE_STEP;
        break;
      }
      case 'attackSpeed': {
        this.attackSpeedBonus = Math.min(
          MAX_ATTACK_SPEED_BONUS,
          this.attackSpeedBonus + PASSIVE_ATTACK_SPEED_STEP
        );
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

  getSnapshot(): PassiveBonusSnapshot {
    return {
      baseMovementSpeed: this.baseMovementSpeed,
      baseDamage: this.baseDamage,
      baseAttackCooldown: this.baseAttackCooldown,
      movementSpeedBonus: this.movementSpeedBonus,
      damageBonus: this.damageBonus,
      attackSpeedBonus: this.attackSpeedBonus,
      selectionsUsed: this.selectionsUsed,
    };
  }
}

export default PassiveBonusesComponent;
