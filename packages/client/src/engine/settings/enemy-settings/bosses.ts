import type {
  EnemySettings,
  DamageProfile,
  HealthProfile,
} from '../../../types/settings/enemy-settings.types';

const fatZombieBoss: EnemySettings = {
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
    source: 'zombie-boss',
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

export { fatZombieBoss };
