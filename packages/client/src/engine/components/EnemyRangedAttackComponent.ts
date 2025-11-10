import {
  COMPONENT_TYPES,
  type EnemyRangedAttackComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types';

class EnemyRangedAttackComponent
  implements IPureDataComponent, EnemyRangedAttackComponentState
{
  type = COMPONENT_TYPES.enemyRangedAttack;
  entity!: IEntity;
  cooldown: number;
  range: number;
  projectileDamage: number;
  projectileSpeed: number;
  timer: number;

  constructor({
    cooldown,
    range,
    projectileDamage,
    projectileSpeed,
    timer = 0,
  }: EnemyRangedAttackComponentState) {
    this.cooldown = cooldown;
    this.range = range;
    this.projectileDamage = projectileDamage;
    this.projectileSpeed = projectileSpeed;
    this.timer = timer;
  }
}

export default EnemyRangedAttackComponent;
