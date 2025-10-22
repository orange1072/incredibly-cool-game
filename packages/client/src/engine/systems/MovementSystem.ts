import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types'
import { PositionComponent, VelocityComponent } from '../components'
import World from '../core/World'

class MovementSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.movement as SystemType
  update(world: World, dt: number) {
    const entities = world.query(
      COMPONENT_TYPES.position,
      COMPONENT_TYPES.velocity
    )
    for (const e of entities) {
      const pos = e.getComponent<PositionComponent>(COMPONENT_TYPES.position)
      const vel = e.getComponent<VelocityComponent>(COMPONENT_TYPES.velocity)
      if (pos && vel) {
        pos.x += vel.dx * dt
        pos.y += vel.dy * dt
      }
    }
  }
}

export default MovementSystem
