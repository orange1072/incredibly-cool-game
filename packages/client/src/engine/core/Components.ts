import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type PositionComponentState,
  type VelocityComponentState,
  type HealthComponentState,
  type AttackComponentState,
  type DamageComponentState,
  type AIComponentState,
  type PlayerControlComponentState,
  type CollisionComponentState,
  type EffectComponentState,
  type ProjectileComponentState,
  type ExperienceComponentState,
  type EnemyComponentState,
  type SpriteComponentState,
  type ObstacleComponentState,
  type SpawnPointComponentState,
} from '../../types/engine.types'
import {
  AI_STATES,
  type AIState,
  type EffectEntry,
} from '../../types/component.types'
import OBSTACLE_PRESETS from '../settings/obstacles-settings/obstacles'

class PositionComponent implements IPureDataComponent, PositionComponentState {
  type = COMPONENT_TYPES.position
  entity!: IEntity
  x: number
  y: number

  constructor({ x, y }: PositionComponentState) {
    this.x = x
    this.y = y
  }
}

class VelocityComponent implements IPureDataComponent, VelocityComponentState {
  type = COMPONENT_TYPES.velocity
  entity!: IEntity
  dx: number
  dy: number

  constructor({ dx, dy }: VelocityComponentState) {
    this.dx = dx
    this.dy = dy
  }
}

class HealthComponent implements IPureDataComponent, HealthComponentState {
  type = COMPONENT_TYPES.health
  entity!: IEntity
  hp: number
  maxHp: number

  constructor({ hp, maxHp }: HealthComponentState) {
    this.hp = hp
    this.maxHp = maxHp
  }
}

class AttackComponent implements IPureDataComponent, AttackComponentState {
  type = COMPONENT_TYPES.attack
  entity!: IEntity
  cooldownTimer = 0
  damage: number
  cooldown: number

  constructor({ damage, cooldown }: AttackComponentState) {
    this.damage = damage
    this.cooldown = cooldown
  }
}

class DamageComponent implements IPureDataComponent, DamageComponentState {
  type = COMPONENT_TYPES.damage
  entity!: IEntity
  amount: number
  sourceId?: string

  constructor({ amount, sourceId }: DamageComponentState) {
    this.amount = amount
    this.sourceId = sourceId
  }
}

class AIComponent implements IPureDataComponent {
  type = COMPONENT_TYPES.ai
  entity!: IEntity
  state: AIState

  constructor({ state = AI_STATES.idle }: AIComponentState = {}) {
    this.state = state
  }
}

class PlayerControlComponent
  implements IPureDataComponent, Required<PlayerControlComponentState>
{
  type = COMPONENT_TYPES.playerControl
  entity!: IEntity
  moveX: number
  moveY: number
  shooting: boolean

  constructor({
    moveX = 0,
    moveY = 0,
    shooting = false,
  }: PlayerControlComponentState = {}) {
    this.moveX = moveX
    this.moveY = moveY
    this.shooting = shooting
  }
}

class CollisionComponent
  implements IPureDataComponent, CollisionComponentState
{
  type = COMPONENT_TYPES.collision
  entity!: IEntity
  radius: number

  constructor({ radius }: CollisionComponentState) {
    this.radius = radius
  }
}

class EffectComponent implements IPureDataComponent {
  type = COMPONENT_TYPES.effect
  entity!: IEntity
  effects: EffectEntry[]

  constructor({ effects = [] }: EffectComponentState = {}) {
    this.effects = effects ?? []
  }
}

class ProjectileComponent
  implements IPureDataComponent, Required<ProjectileComponentState>
{
  type = COMPONENT_TYPES.projectile
  entity!: IEntity
  damage: number
  sourceId: string
  speed: number
  lifetime: number
  kind: NonNullable<ProjectileComponentState['kind']>

  constructor({
    damage = 10,
    sourceId = '',
    speed = 300,
    lifetime = 3,
    kind = 'bullet',
  }: ProjectileComponentState = {}) {
    this.damage = damage
    this.sourceId = sourceId
    this.speed = speed
    this.lifetime = lifetime
    this.kind = kind
  }
}

class ExperienceComponent
  implements IPureDataComponent, Required<ExperienceComponentState>
{
  type = COMPONENT_TYPES.experience
  entity!: IEntity
  xp: number
  level: number
  xpToNext: number

  constructor({
    xp = 0,
    level = 1,
    xpToNext = 100,
  }: ExperienceComponentState = {}) {
    this.xp = xp
    this.level = level
    this.xpToNext = xpToNext
  }
}

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
    kind = 'zombie',
    xpReward = 20,
    damage = 10,
    speed = 60,
    aggroRange = 250,
    attackRange = 40,
    attackCooldown = 1.5,
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

class SpriteComponent implements IPureDataComponent, SpriteComponentState {
  type = COMPONENT_TYPES.sprite
  entity!: IEntity
  name: string
  width: number
  height: number
  scale: number
  frame: number
  frameDuration: number
  loop: boolean
  alpha: number
  zIndex: number
  source?: string
  columns: number
  rows: number
  directionRow: number
  animationTimer: number
  padding: { x: number; y: number }

  constructor({
    name,
    width,
    height,
    scale = 1,
    frame = 0,
    frameDuration = 100,
    loop = true,
    alpha = 1,
    zIndex = 0,
    source,
    columns = 1,
    rows = 1,
    directionRow = 2,
    padding,
  }: SpriteComponentState) {
    this.name = name
    this.width = width
    this.height = height
    this.scale = scale ?? 1
    this.frame = frame
    this.frameDuration = frameDuration
    this.loop = loop
    this.alpha = alpha
    this.zIndex = zIndex
    this.source = source
    this.columns = Math.max(1, columns)
    this.rows = Math.max(1, rows)
    this.directionRow = Math.min(this.rows - 1, Math.max(0, directionRow))
    this.animationTimer = 0
    this.padding = {
      x: padding?.x ?? 0,
      y: padding?.y ?? 0,
    }
  }
}

export type ObstacleKind = ObstacleComponentState['kind']

class ObstacleComponent implements IPureDataComponent, ObstacleComponentState {
  type = COMPONENT_TYPES.obstacle
  entity!: IEntity
  width: number
  height: number
  kind: ObstacleKind
  public isBlocking: boolean
  public speedReducing: number
  public damaging: number

  constructor({ width, height, kind }: ObstacleComponentState) {
    const preset = OBSTACLE_PRESETS[kind]
    this.width = width
    this.height = height
    this.kind = kind
    this.isBlocking = preset.isBlocking
    this.speedReducing = preset.speedReducing
    this.damaging = preset.damaging
  }
}

class SpawnPointComponent
  implements IPureDataComponent, Required<SpawnPointComponentState>
{
  type = COMPONENT_TYPES.spawnPoint
  entity!: IEntity
  _timer: number | undefined
  spawnType: NonNullable<SpawnPointComponentState['spawnType']>
  radius: number
  interval: number
  maxEntities: number
  autoSpawn: boolean

  constructor({
    spawnType = 'enemy',
    radius = 20,
    interval = 5,
    maxEntities = 10,
    autoSpawn = true,
  }: SpawnPointComponentState = {}) {
    this.spawnType = spawnType
    this.radius = radius
    this.interval = interval
    this.maxEntities = maxEntities
    this.autoSpawn = autoSpawn
  }
}

export {
  PositionComponent,
  VelocityComponent,
  HealthComponent,
  AttackComponent,
  AIComponent,
  PlayerControlComponent,
  CollisionComponent,
  DamageComponent,
  EffectComponent,
  ProjectileComponent,
  ExperienceComponent,
  EnemyComponent,
  SpriteComponent,
  ObstacleComponent,
  SpawnPointComponent,
}
