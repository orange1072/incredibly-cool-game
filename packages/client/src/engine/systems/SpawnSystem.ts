import { ISystem } from '../../types/engine.types'
import World from '../core/World'
import EventBus from '../infrastructure/EventBus'
import { PositionComponent, SpawnPointComponent } from '../core/Components'
import Logger from '../infrastructure/Logger'
import { createZombie } from '../enteties/createZombie'
import { createBoss } from '../enteties/createBoss'

interface SpawnSystemOptions {
  eventBus: EventBus
}

class SpawnSystem implements ISystem {
  private eventBus: EventBus
  private logger = new Logger('SpawnSystem', 'info')
  private bossSpawned = false
  private waveNumber = 0
  private areaWidth = 400

  constructor({ eventBus }: SpawnSystemOptions) {
    this.eventBus = eventBus
  }

  update(world: World, dt: number) {
    const bounds = world.getBounds?.()
    if (bounds) {
      this.areaWidth = bounds.width
    }

    const spawns = world.query('spawnPoint', 'position')

    for (const sp of spawns) {
      const spawn = sp.getComponent<SpawnPointComponent>('spawnPoint')
      const pos = sp.getComponent<PositionComponent>('position')
      if (!spawn || !pos) continue

      if (!spawn.autoSpawn) continue
      spawn._timer = (spawn._timer ?? 0) + dt

      const enemies = world.query('enemy', 'health')
      if (enemies.length >= spawn.maxEntities) continue

      if (spawn._timer < spawn.interval) continue
      spawn._timer = 0

      const x = pos.x + (Math.random() - 0.5) * spawn.radius * 2
      const y = pos.y + (Math.random() - 0.5) * spawn.radius * 2

      const zombie = createZombie(x, y)
      world.addEntity(zombie)

      if (this.waveNumber % 5 === 0 && !this.bossSpawned) {
        const bossX = bounds ? bounds.width / 2 : this.areaWidth / 2
        const boss = createBoss(bossX, 100)
        world.addEntity(boss)
        this.eventBus.emit('bossSpawned', { id: boss.id })
        this.bossSpawned = true
      }

      this.logger.debug(`Spawned enemy at (${x.toFixed(1)}, ${y.toFixed(1)})`)
      this.eventBus.emit('enemySpawned', { id: zombie.id, x, y })
    }
  }
}

export default SpawnSystem
