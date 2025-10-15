import type {
  EnemySettings,
  DamageProfile,
  HealthProfile,
} from '../../../types/settings/enemy-settings.types'

const regularZombie: EnemySettings = {
  name: 'zombie-walker',
  kind: 'zombie',
  ai: {
    startingValue: 'idle',
    aggroRange: 60,
  },
  damage: {
    baseSpeed: 10,
    baseValue: 10,
    actualDamage(this: DamageProfile, bonus: number, multiplier = 1) {
      return this.baseValue * multiplier + bonus
    },
  },
  xpReward: 20,
  sprite: {
    defaultColor: 'rgba(255, 75, 75, 0.95)',
    width: 64,
    height: 64,
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
    baseValue: 100,
    levelBonus: 10,
    health(this: HealthProfile, level: number, multiplier = 1) {
      return this.baseValue * multiplier + this.levelBonus * level
    },
  },
  movement: {
    speed: 80,
  },
}

export { regularZombie }
