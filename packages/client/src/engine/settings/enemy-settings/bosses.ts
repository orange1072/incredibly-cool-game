const fatZombieBoss = {
  damage: {
    baseSpeed: 10,
    baseValue: 10,
    actualDamage(bonus: number, multiplier: number) {
      return this.baseValue * multiplier + bonus
    },
  },
  skin: {
    color: 'rgba(255, 75, 75, 0.95)',
    healthBarColor: '',
  },
  sprite: {
    source: '',
  },
  health: {
    baseValue: 100,
    levelBonus: 20,
    health(level: number, multiplier: number) {
      return this.baseValue * multiplier + this.levelBonus * level
    },
  },
}

export { fatZombieBoss }
