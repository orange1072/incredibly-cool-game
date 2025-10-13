import { IEntity, IPureDataComponent } from '../../types/engine.types'

class PositionComponent implements IPureDataComponent {
  type = 'position'
  entity!: IEntity
  constructor(public x: number, public y: number) {}
}

class VelocityComponent implements IPureDataComponent {
  type = 'velocity'
  entity!: IEntity
  constructor(public dx: number, public dy: number) {}
}

class HealthComponent implements IPureDataComponent {
  type = 'health'
  entity!: IEntity
  constructor(public hp: number, public maxHp: number) {}
}

class AttackComponent implements IPureDataComponent {
  type = 'attack'
  entity!: IEntity
  constructor(public damage: number, public cooldown: number) {}
}

class DamageComponent implements IPureDataComponent {
  type = 'damage'
  entity!: IEntity
  constructor(public amount: number, public sourceId?: string) {}
}

class AIComponent implements IPureDataComponent {
  type = 'ai'
  entity!: IEntity
  constructor(public state: 'idle' | 'chase' | 'attack' | 'dead' = 'idle') {}
}

class PlayerControlComponent implements IPureDataComponent {
  type = 'playerControl'
  entity!: IEntity

  constructor(
    public moveX: number = 0,
    public moveY: number = 0,
    public shooting: boolean = false
  ) {}
}

class CollisionComponent implements IPureDataComponent {
  type = 'collision'
  entity!: IEntity
  constructor(public radius: number) {}
}

class EffectComponent implements IPureDataComponent {
  type = 'effect'
  entity!: IEntity

  constructor(
    public effects: Array<{
      kind: 'damageOverTime' | 'healOverTime' | 'speedBoost' | 'slow'
      value: number
      duration: number
      elapsed?: number
      tickRate?: number
      tickTimer?: number
    }>
  ) {}
}

class ProjectileComponent implements IPureDataComponent {
  type = 'projectile'
  entity!: IEntity
  constructor(
    public damage: number = 10,
    public sourceId: string = '',
    public speed: number = 300,
    public lifetime: number = 3,
    public kind: 'bullet' | 'rocket' | 'plasma' | 'shotgun' = 'bullet'
  ) {}
}

class ExperienceComponent implements IPureDataComponent {
  type = 'experience'
  entity!: IEntity

  constructor(
    public xp: number = 0,
    public level: number = 1,
    public xpToNext: number = 100 // порог для повышения уровня
  ) {}
}

class EnemyComponent implements IPureDataComponent {
  type = 'enemy'
  entity!: IEntity

  constructor(
    public kind: 'zombie' | 'runner' | 'bloater' | 'boss' = 'zombie',
    public xpReward: number = 20,
    public damage: number = 10,
    public speed: number = 60,
    public aggroRange: number = 250
  ) {}
}

class SpriteComponent implements IPureDataComponent {
  type = 'sprite'
  entity!: IEntity

  constructor(
    public name: string,
    public width: number,
    public height: number,
    public scale: number = 1,
    public frame: number = 0,
    public frameDuration: number = 100,
    public loop: boolean = true,
    public alpha: number = 1,
    public zIndex: number = 0
  ) {}
}

const OBSTACLE_PRESETS = {
  wall: { isBlocking: true, speedReducing: 0, damaging: 0 },
  rock: { isBlocking: true, speedReducing: 0, damaging: 0 },
  barricade: { isBlocking: true, speedReducing: 0, damaging: 0 },
  goo: { isBlocking: false, speedReducing: 0.5, damaging: 0 },
  barbWire: { isBlocking: false, speedReducing: 0.7, damaging: 5 },
} as const

export type ObstacleKind = keyof typeof OBSTACLE_PRESETS

class ObstacleComponent implements IPureDataComponent {
  type = 'obstacle'
  entity!: IEntity

  constructor(
    public width: number,
    public height: number,
    public kind: ObstacleKind
  ) {
    const preset = OBSTACLE_PRESETS[kind]
    this.isBlocking = preset.isBlocking
    this.speedReducing = preset.speedReducing
    this.damaging = preset.damaging
  }

  public isBlocking: boolean
  public speedReducing: number
  public damaging: number
}

class SpawnPointComponent implements IPureDataComponent {
  type = 'spawnPoint'
  entity!: IEntity
  _timer: number | undefined

  constructor(
    public spawnType: 'player' | 'enemy' | 'item' | 'boss' = 'enemy',
    public radius: number = 20,
    public interval: number = 5,
    public maxEntities: number = 10,
    public autoSpawn: boolean = true
  ) {}
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
