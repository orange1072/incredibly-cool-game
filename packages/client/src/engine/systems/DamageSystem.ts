import { ISystem } from '../../types/engine.types'
import { DamageComponent, HealthComponent } from '../core/Components'
import World from '../core/World'
import EventBus from '../infrastructure/EventBus'

const bus = EventBus.instance

class DamageSystem implements ISystem {
  update(world: World) {
    const entities = world.query('health', 'damage')

    for (const e of entities) {
      const health = e.getComponent<HealthComponent>('health')
      const damage = e.getComponent<DamageComponent>('damage')

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
