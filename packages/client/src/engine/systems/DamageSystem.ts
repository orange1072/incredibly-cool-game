import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import { DamageComponent, HealthComponent } from '../core/Components'
import World from '../core/World'
import EventBus from '../infrastructure/EventBus'

const bus = EventBus.instance

class DamageSystem implements ISystem {
  update(world: World) {
    const entities = world.query(COMPONENT_TYPES.health, COMPONENT_TYPES.damage)

    for (const e of entities) {
      const health = e.getComponent<HealthComponent>(COMPONENT_TYPES.health)
      const damage = e.getComponent<DamageComponent>(COMPONENT_TYPES.damage)

      if (!health || !damage) continue

      health.hp -= damage.amount

      if (health.hp <= 0) {
        world.removeEntity(e.id)

        world.removeEntity(e.id)
        bus.emit('enemyKilled', {
          killerId: damage.sourceId,
          xpReward: 20,
        })
      }
    }
  }
}

export default DamageSystem
