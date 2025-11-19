import type { AIState, EnemyKind } from '../component.types';

export type DamageProfile = {
  radius: number;
  baseSpeed: number;
  baseValue: number;
  actualDamage(this: DamageProfile, bonus: number, multiplier?: number): number;
};

export type AttackProfile = {
  range: number;
  cooldown: number;
};

export type HealthProfile = {
  baseValue: number;
  levelBonus: number;
  health(this: HealthProfile, level: number, multiplier?: number): number;
};

export type SpritePadding = {
  x?: number;
  y?: number;
};

export type SpriteProfile = {
  defaultColor: string;
  width: number;
  height: number;
  name: string;
  source?: string;
  scale?: number;
  frameDuration?: number;
  columns?: number;
  rows?: number;
  padding?: SpritePadding;
};

export type SkinProfile = {
  color: string;
  healthBarColor: string;
};

export type CollisionProfile = {
  radius: number;
};

export type MovementProfile = {
  speed: number;
};

export type AIProfile = {
  startingValue: AIState;
  aggroRange: number;
};

export interface EnemySettings {
  name: string;
  kind: EnemyKind;
  ai: AIProfile;
  damage: DamageProfile;
  xpReward: number;
  sprite: SpriteProfile;
  skin: SkinProfile;
  collision: CollisionProfile;
  health: HealthProfile;
  movement: MovementProfile;
  attack: AttackProfile;
}

export type SpawnCondition = {
  minWorldLevel?: number;
  maxWorldLevel?: number;
  minWave?: number;
  maxWave?: number;
  weight?: number;
};

export interface EnemyVariantMetadata {
  id: string;
  displayName: string;
  description: string;
  tags: string[];
  abilities: string[];
  spawn: SpawnCondition;
}

export interface EnemyVariantDefinition extends EnemyVariantMetadata {
  settings: EnemySettings;
}
