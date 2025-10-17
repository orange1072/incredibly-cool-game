import {
  COMPONENT_TYPES,
  type EnemyComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types'

const DEFAULT_ENEMY_KIND: NonNullable<EnemyComponentState['kind']> = 'zombie'
const DEFAULT_ENEMY_XP_REWARD = 20
const DEFAULT_ENEMY_DAMAGE = 10
const DEFAULT_ENEMY_SPEED = 60
const DEFAULT_ENEMY_AGGRO_RANGE = 250
const DEFAULT_ENEMY_ATTACK_RANGE = 40
const DEFAULT_ENEMY_ATTACK_COOLDOWN = 1.5

class EnemyComponent
  implements IPureDataComponent, Required<EnemyComponentState>
{
  type = COMPONENT_TYPES.enemy
  entity!: IEntity
  kind: NonNullable<EnemyComponentState['kind']>
  xpReward: number
  damage: number
  speed: number
  aggroRange: number
  attackRange: number
  attackCooldown: number

  constructor({
    kind = DEFAULT_ENEMY_KIND,
    xpReward = DEFAULT_ENEMY_XP_REWARD,
    damage = DEFAULT_ENEMY_DAMAGE,
    speed = DEFAULT_ENEMY_SPEED,
    aggroRange = DEFAULT_ENEMY_AGGRO_RANGE,
    attackRange = DEFAULT_ENEMY_ATTACK_RANGE,
    attackCooldown = DEFAULT_ENEMY_ATTACK_COOLDOWN,
  }: EnemyComponentState = {}) {
    this.kind = kind
    this.xpReward = xpReward
    this.damage = damage
    this.speed = speed
    this.aggroRange = aggroRange
    this.attackRange = attackRange
    this.attackCooldown = attackCooldown
  }
}

export default EnemyComponent
