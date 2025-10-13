import { ISystem } from '../../types/engine.types'
import { ExperienceComponent } from '../core/Components'
import World from '../core/World'
import EventBus from '../infrastructure/EventBus'
import Logger from '../infrastructure/Logger'

interface ExperienceSystemOptions {
  eventBus: EventBus
}

class ExperienceSystem implements ISystem {
  private eventBus: EventBus
  private logger = new Logger('ExperienceSystem', 'info')

  constructor({ eventBus }: ExperienceSystemOptions) {
    this.eventBus = eventBus

    this.eventBus.on('enemyKilled', (data) => {
      this.onEnemyKilled(data as { killerId: string; xpReward: number })
    })
  }

  update(world: World, dt: number): void {
    console.log(dt)
    const players = world.query('experience')
    for (const player of players) {
      const exp = player.getComponent<ExperienceComponent>('experience')
      if (!exp) continue

      if (exp.xp >= exp.xpToNext) {
        exp.xp -= exp.xpToNext
        exp.level += 1
        exp.xpToNext = Math.floor(exp.xpToNext * 1.25)

        this.eventBus.emit('playerLevelUp', {
          id: player.id,
          newLevel: exp.level,
        })
        this.logger.info(`Level up! ${exp.level}`)
      }
    }
  }

  private onEnemyKilled({
    killerId,
    xpReward,
  }: {
    killerId: string
    xpReward: number
  }) {
    console.log({ killerId }, { xpReward })
    // const world = (globalThis as any).engineWorld as World
    // const killer = world.getEntity(killerId)
    // const exp = killer?.getComponent<ExperienceComponent>('experience')
    // if (!exp) return
    // exp.xp += xpReward
  }
}

export default ExperienceSystem
