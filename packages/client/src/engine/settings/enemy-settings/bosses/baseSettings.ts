import type {
  DamageProfile,
  EnemySettings,
  HealthProfile,
  SpawnCondition,
} from '../../../../types/settings/enemy-settings.types';

import defaultBossRunSprite from '../../.././../assets/enemies/bosses/default-boss/run.png';

export const baseBossSpawn: SpawnCondition = {
  minWorldLevel: 1,
  weight: 1,
};

export const fatZombieBossSettings: EnemySettings = {
  name: 'zombie-boss',
  kind: 'boss',
  ai: {
    startingValue: 'idle',
    aggroRange: 500,
  },
  damage: {
    radius: 10,
    baseSpeed: 10,
    baseValue: 40,
    actualDamage(this: DamageProfile, bonus: number, multiplier = 1) {
      return this.baseValue * multiplier + bonus;
    },
  },
  xpReward: 500,
  sprite: {
    defaultColor: 'rgba(210, 45, 45, 0.95)',
    width: 128,
    height: 128,
    name: 'zombie-boss',
    source: defaultBossRunSprite,
  },
  skin: {
    color: 'rgba(255, 75, 75, 0.95)',
    healthBarColor: '#ff1f3d',
  },
  collision: {
    radius: 50,
  },
  health: {
    baseValue: 500,
    levelBonus: 150,
    health(this: HealthProfile, level: number, multiplier = 1) {
      return this.baseValue * multiplier + this.levelBonus * level;
    },
  },
  movement: {
    speed: 30,
  },
  attack: {
    range: 64,
    cooldown: 2.5,
  },
};

export type BossSettingsOverride = Partial<
  Pick<
    EnemySettings,
    | 'ai'
    | 'damage'
    | 'xpReward'
    | 'sprite'
    | 'skin'
    | 'collision'
    | 'health'
    | 'movement'
    | 'attack'
  >
>;

export function createBossSettings(
  overrides: BossSettingsOverride
): EnemySettings {
  return {
    ...fatZombieBossSettings,
    ai: { ...fatZombieBossSettings.ai, ...overrides.ai },
    damage: { ...fatZombieBossSettings.damage, ...overrides.damage },
    xpReward: overrides.xpReward ?? fatZombieBossSettings.xpReward,
    sprite: { ...fatZombieBossSettings.sprite, ...overrides.sprite },
    skin: { ...fatZombieBossSettings.skin, ...overrides.skin },
    collision: {
      ...fatZombieBossSettings.collision,
      ...overrides.collision,
    },
    health: {
      ...fatZombieBossSettings.health,
      ...overrides.health,
      health: overrides.health?.health ?? fatZombieBossSettings.health.health,
    },
    movement: {
      ...fatZombieBossSettings.movement,
      ...overrides.movement,
    },
    attack: { ...fatZombieBossSettings.attack, ...overrides.attack },
  };
}
