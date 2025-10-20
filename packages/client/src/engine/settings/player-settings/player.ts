import playerRunSprite from '../../../assets/player/Run.png';
import type {
  PlayerSettings,
  DamageSettings,
  HealthSettings,
} from '../../../types/settings/player-settings.types';

const player: PlayerSettings = {
  name: 'stalker',
  baseLevel: 1,
  baseSpeed: 300,
  damage: {
    baseSpeed: 30,
    baseValue: 100,
    actualDamage(this: DamageSettings, bonus: number, multiplier = 1) {
      return this.baseValue * multiplier + bonus;
    },
  },
  health: {
    baseValue: 200,
    levelBonus: 20,
    health(this: HealthSettings, level: number, multiplier = 1) {
      return this.baseValue * multiplier + this.levelBonus * level;
    },
  },
  skin: {
    color: 'rgba(76, 201, 240, 0.95)',
    healthBarColor: '#48ff8a',
  },
  sprite: {
    name: 'player-run',
    width: 64,
    height: 64,
    source: playerRunSprite,
    columns: 8,
    rows: 8,
    frameDuration: 80,
    scale: 1.5,
    padding: {
      x: 20,
      y: 20,
    },
  },
  abilities: [],
};

export { player };
