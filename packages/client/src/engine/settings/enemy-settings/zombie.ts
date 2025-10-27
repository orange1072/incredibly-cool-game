import type {
  EnemySettings,
  DamageProfile,
  HealthProfile,
} from '../../../types/settings/enemy-settings.types';

const regularZombie: EnemySettings = {
  name: 'zombie-walker',
  kind: 'zombie',
  ai: {
    startingValue: 'idle',
    aggroRange: 700,
  },
  damage: {
    radius: 5,
    baseSpeed: 30,
    baseValue: 10,
    actualDamage(this: DamageProfile, bonus: number, multiplier = 1) {
      return this.baseValue * multiplier + bonus;
    },
  },
  xpReward: 20,
  sprite: {
    defaultColor: 'rgba(255, 75, 75, 0.95)',
    width: 32,
    height: 32,
    name: 'zombie-walker',
    source: '',
  },
  skin: {
    color: 'rgba(255, 75, 75, 0.95)',
    healthBarColor: '#ff4d6d',
  },
  collision: {
    radius: 12,
  },
  health: {
    baseValue: 300,
    levelBonus: 10,
    health(this: HealthProfile, level: number, multiplier = 1) {
      return this.baseValue * multiplier + this.levelBonus * level;
    },
  },
  movement: {
    speed: 60,
  },
  attack: {
    range: 28,
    cooldown: 1.5,
  },
};

export { regularZombie };
