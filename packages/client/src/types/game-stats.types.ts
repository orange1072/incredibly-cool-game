import { ProjectileKind } from './component.types'

export type inventoryItem = 'gun' | 'rocketLauncher' | 'shotgun' | 'knife'

interface GameStats {
  worldStats: {
    level: number
    enemiesKilled: number
    bossesKilled: number
  }
  player: {
    level: number
    hp: number
    xp: number
    money: number
    ammo: Record<ProjectileKind, number>
    inventory: inventoryItem[]
  }
  missionProgress: {
    wave: number
    amountOfBosses: number
    amountOfEnemiesInWave: number
  }
  modifiers: {
    damage: number
    attackSpeed: number
    movementSpeed: number
  }
}

export default GameStats
