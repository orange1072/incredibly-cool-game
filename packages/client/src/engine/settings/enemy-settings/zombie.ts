import type {
  EnemySettings,
  DamageProfile,
  HealthProfile,
} from '../../../types/settings/enemy-settings.types';

import defaultZombieRunSprite from '../../../assets/enemies/default-zombie/zombie-walk-sprite.png';

const regularZombie: EnemySettings = {
  name: 'zombie-walker',
  kind: 'zombie',
  ai: {
    startingValue: 'idle',
    aggroRange: 1800,
  },
  damage: {
    radius: 5,
    baseSpeed: 40,
    baseValue: 10,
    actualDamage(this: DamageProfile, bonus: number, multiplier = 1) {
      return this.baseValue * multiplier + bonus;
    },
  },
  xpReward: 20,
  sprite: {
    defaultColor: 'rgba(255, 75, 75, 0.95)',
    width: 128,
    height: 128,
    name: 'zombie-walker',
    source: defaultZombieRunSprite,
    columns: 8,
    rows: 15,
    frameDuration: 80,
    scale: 0.5,
    padding: {
      x: 20,
      y: 20,
    },
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
    range: 45,
    cooldown: 1.2,
  },
};

export { regularZombie };
