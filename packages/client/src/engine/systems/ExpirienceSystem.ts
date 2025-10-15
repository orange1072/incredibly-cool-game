import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import { ExperienceComponent } from '../core/Components'
import World from '../core/World'
import EventBus from '../infrastructure/EventBus'
import Logger from '../infrastructure/Logger'

interface ExperienceSystemOptions {
  eventBus: EventBus
}

class ExperienceSystem implements ISystem {
  private eventBus: EventBus
  private world: World | null = null
  private pendingRewards: EnemyKilledPayload[] = []
  private logger = new Logger('ExperienceSystem', 'info')

  private handleEnemyKilled = (rawData: unknown) => {
    const data = rawData as Partial<EnemyKilledPayload> | undefined
    if (!data?.killerId) return

    const xpReward = Number(data.xpReward ?? 0)
    if (!Number.isFinite(xpReward) || xpReward <= 0) {
      this.logger.debug('Ignoring non-positive XP reward', data)
      return
    }

    if (!this.world) {
      this.pendingRewards.push({ killerId: data.killerId, xpReward })
      return
    }

    this.grantExperience(data.killerId, xpReward)
  }

  constructor({ eventBus }: ExperienceSystemOptions) {
    this.eventBus = eventBus
    this.eventBus.on('enemyKilled', this.handleEnemyKilled)
  }

  initialize(world: World): void {
    this.world = world
    this.flushPendingRewards()
  }

  update(world: World, dt: number): void {
    this.world = world
    this.flushPendingRewards()

    const players = world.query(COMPONENT_TYPES.experience)
    for (const player of players) {
      const exp = player.getComponent<ExperienceComponent>(
        COMPONENT_TYPES.experience
      )
      if (!exp) continue

      this.processLevelUps(player.id, exp)
    }
    console.log({ dt })
  }

  private grantExperience(killerId: string, xpReward: number) {
    if (!this.world) return
    const killer = this.world.getEntity(killerId)
    const exp = killer?.getComponent<ExperienceComponent>(
      COMPONENT_TYPES.experience
    )
    if (!exp) {
      this.logger.debug('Entity without experience component received XP', {
        killerId,
      })
      return
    }

    exp.xp += xpReward

    this.logger.debug('Experience awarded', {
      killerId,
      xpReward,
      total: exp.xp,
    })
  }

  private flushPendingRewards() {
    if (!this.world || this.pendingRewards.length === 0) return

    const rewards = this.pendingRewards.splice(0)
    for (const reward of rewards) {
      this.grantExperience(reward.killerId, reward.xpReward)
    }
  }

  private processLevelUps(entityId: string, exp: ExperienceComponent) {
    let leveledUp = false

    while (exp.xp >= exp.xpToNext && exp.xpToNext > 0) {
      exp.xp -= exp.xpToNext
      exp.level += 1
      exp.xpToNext = Math.max(1, Math.floor(exp.xpToNext * 1.25))
      leveledUp = true

      this.eventBus.emit('playerLevelUp', {
        id: entityId,
        newLevel: exp.level,
      })
    }

    if (leveledUp) {
      this.logger.info('Player level up', {
        id: entityId,
        level: exp.level,
        remainingXp: exp.xp,
        nextThreshold: exp.xpToNext,
      })
    }
  }
}

interface EnemyKilledPayload {
  killerId: string
  xpReward: number
}

export default ExperienceSystem
