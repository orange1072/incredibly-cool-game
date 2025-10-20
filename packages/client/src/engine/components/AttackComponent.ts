import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type AttackComponentState,
} from '../../types/engine.types'

const DEFAULT_ATTACK_COOLDOWN_TIMER = 0

class AttackComponent implements IPureDataComponent, AttackComponentState {
  type = COMPONENT_TYPES.attack
  entity!: IEntity
  cooldownTimer = DEFAULT_ATTACK_COOLDOWN_TIMER
  damage: number
  cooldown: number

  constructor({ damage, cooldown }: AttackComponentState) {
    this.damage = damage
    this.cooldown = cooldown
  }
}

export default AttackComponent
