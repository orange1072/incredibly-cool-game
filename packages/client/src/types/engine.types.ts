import World from '../engine/core/World';
import type {
  AIState,
  EffectEntry,
  EnemyKind,
  ProjectileKind,
  SpawnType,
} from './component.types';
import type { ObstaclePresetName } from '../engine/settings/obstacles-settings/obstacles';

export type ComponentType<T extends IComponent = IComponent> = new (
  ...args: unknown[]
) => T;

export const COMPONENT_TYPES = {
  position: 'position',
  velocity: 'velocity',
  health: 'health',
  attack: 'attack',
  damage: 'damage',
  ai: 'ai',
  playerControl: 'playerControl',
  collision: 'collision',
  effect: 'effect',
  projectile: 'projectile',
  experience: 'experience',
  enemy: 'enemy',
  sprite: 'sprite',
  obstacle: 'obstacle',
  spawnPoint: 'spawnPoint',
  loot: 'loot',
  passiveBonuses: 'passiveBonuses',
  enemyProfile: 'enemyProfile',
  despawnTimer: 'despawnTimer',
  enemyRangedAttack: 'enemyRangedAttack',
} as const;

export const SYSTEM_TYPES = {
  ai: 'ai',
  animation: 'animation',
  camera: 'camera',
  collision: 'collision',
  damage: 'damage',
  effect: 'effect',
  experience: 'experience',
  generateMap: 'generateMap',
  movement: 'movement',
  playerControl: 'playerControl',
  projectile: 'projectile',
  render: 'render',
  progression: 'progression',
  spriteLoader: 'spriteLoader',
  spawn: 'spawn',
  sync: 'sync',
  despawn: 'despawn',
  enemyRangedAttack: 'enemyRangedAttack',
};

export type LootType = 'xp' | 'hp' | 'gd';

export type SystemType = keyof typeof SYSTEM_TYPES;

export type ComponentDataType = keyof typeof COMPONENT_TYPES;

export interface IPureDataComponent {
  type: string;
}

export interface IComponent extends IPureDataComponent {
  entity: IEntity;
  onDestroy?(): void;
}

export interface IEntity {
  id: string;
  addComponent<T extends IComponent>(component: T): void;
  getComponent<T extends IComponent>(type: string): T | undefined;
  removeComponent(type: string): void;
}

export interface ISystem<T extends SystemType | unknown> {
  type: T;
  requiredComponents?: string[];
  initialize?(world: World): void;
  update(world: World, dt: number): void;
  onDestroy?(): void;
}

export interface PositionComponentState {
  x: number;
  y: number;
}

export interface VelocityComponentState {
  dx: number;
  dy: number;
}

export interface HealthComponentState {
  hp: number;
  maxHp: number;
}

export interface LootComponentState {
  lootType: LootType;
  amount: number;
}

export interface AttackComponentState {
  damage: number;
  cooldown: number;
}

export interface DamageComponentState {
  amount: number;
  sourceId?: string;
}

export interface AIComponentState {
  state?: AIState;
}

export interface PlayerControlComponentState {
  moveX?: number;
  moveY?: number;
  shooting?: boolean;
}

export interface CollisionComponentState {
  radius: number;
  offsetX?: number;
  offsetY?: number;
}

export interface EffectComponentState {
  effects?: EffectEntry[];
}

export interface ProjectileComponentState {
  damage?: number;
  sourceId?: string;
  speed?: number;
  lifetime?: number;
  kind?: ProjectileKind;
}

export interface ExperienceComponentState {
  xp?: number;
  level?: number;
  xpToNext?: number;
}

export interface EnemyComponentState {
  kind?: EnemyKind;
  xpReward?: number;
  damage?: number;
  speed?: number;
  aggroRange?: number;
  attackRange?: number;
  attackCooldown?: number;
}

export interface SpriteComponentState {
  name: string;
  width: number;
  height: number;
  scale?: number;
  frame?: number;
  frameDuration?: number;
  loop?: boolean;
  alpha?: number;
  zIndex?: number;
  source?: string;
  columns?: number;
  rows?: number;
  directionRow?: number;
  padding?: {
    x?: number;
    y?: number;
  };
  defaultColor?: string;
}

export interface ObstacleComponentState {
  width: number;
  height: number;
  kind: ObstaclePresetName;
}

export interface SpawnPointComponentState {
  spawnType?: SpawnType;
  radius?: number;
  interval?: number;
  maxEntities?: number;
  autoSpawn?: boolean;
}

export interface PassiveBonusesComponentState {
  baseMovementSpeed: number;
  baseDamage: number;
  baseAttackCooldown: number;
  movementSpeedBonus?: number;
  damageBonus?: number;
  attackSpeedBonus?: number;
  healthBonus?: number;
  xpBonus?: number;
  healUsed?: boolean;
  selectionsUsed?: number;
}

export interface EnemyProfileComponentState {
  variantId: string;
  displayName: string;
  description: string;
  tags: string[];
  abilities: string[];
  spawn: {
    minWorldLevel?: number;
    maxWorldLevel?: number;
    minWave?: number;
    maxWave?: number;
    weight?: number;
  };
}

export interface DespawnTimerComponentState {
  ttl: number;
}

export interface EnemyRangedAttackComponentState {
  cooldown: number;
  range: number;
  projectileDamage: number;
  projectileSpeed: number;
  timer?: number;
}

export type { PassiveBonusKind, PassiveBonusOption } from './component.types';
