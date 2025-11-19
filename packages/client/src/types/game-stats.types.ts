import { ProjectileKind, type PassiveBonusOption } from './component.types';

export type inventoryItem = 'gun' | 'rocketLauncher' | 'shotgun' | 'knife';

interface GameStats {
  worldStats: {
    level: number;
    enemiesKilled: number;
    bossesKilled: number;
    killProgress: number;
    nextLevelThreshold: number;
  };
  player: {
    level: number;
    hp: number;
    xp: number;
    xpToNext: number;
    money: number;
    ammo: Record<ProjectileKind, number>;
    inventory: inventoryItem[];
  };
  missionProgress: {
    wave: number;
    waveSize: number;
    amountOfBosses: number;
    amountOfEnemiesInWave: number;
  };
  modifiers: {
    damage: number;
    attackSpeed: number;
    movementSpeed: number;
  };
  levelRewards: {
    entityId: string | null;
    pending: number;
    options: PassiveBonusOption[];
    visible: boolean;
  };
}

export default GameStats;
