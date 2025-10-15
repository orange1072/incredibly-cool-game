import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import {
  AIComponent,
  PositionComponent,
  VelocityComponent,
  HealthComponent,
} from '../core/Components'
import World from '../core/World'
import Logger from '../infrastructure/Logger'

class AISystem implements ISystem {
  private logger = new Logger('AISystem', 'warn')
  private chaseDistance = 600
  private attackDistance = 40
  private moveSpeed = 50

  update(world: World, dt: number): void {
    const player = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.position
    )[0]
    if (!player) return

    console.log(dt)

    const playerPos = player.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    )
    if (!playerPos) return

    const enemies = world.query(
      COMPONENT_TYPES.ai,
      COMPONENT_TYPES.position,
      COMPONENT_TYPES.velocity
    )

    for (const e of enemies) {
      const ai = e.getComponent<AIComponent>(COMPONENT_TYPES.ai)
      const pos = e.getComponent<PositionComponent>(COMPONENT_TYPES.position)
      const vel = e.getComponent<VelocityComponent>(COMPONENT_TYPES.velocity)
      const health = e.getComponent<HealthComponent>(COMPONENT_TYPES.health)

      if (!ai || !pos || !vel || !health) continue

      if (health.hp <= 0) {
        vel.dx = vel.dy = 0
        ai.state = 'dead'
        continue
      }

      const dx = playerPos.x - pos.x
      const dy = playerPos.y - pos.y
      const dist = Math.hypot(dx, dy)

      if (dist > this.chaseDistance) {
        ai.state = 'idle'
        vel.dx = vel.dy = 0
      } else if (dist > this.attackDistance) {
        ai.state = 'chase'
        const normX = dx / dist
        const normY = dy / dist
        vel.dx = normX * this.moveSpeed
        vel.dy = normY * this.moveSpeed
      } else {
        ai.state = 'attack'
        vel.dx = vel.dy = 0
      }

      // опционально логируем смену состояния
      // this.logger.debug(`${e.id} → ${ai.state}`, { dist })
    }
  }
}

export default AISystem
