import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import { ProjectileComponent } from '../components'
import World from '../core/World'

const ZERO_LIFETIME = 0

class ProjectileSystem implements ISystem {
  update(world: World, dt: number): void {
    const projectiles = world.query(COMPONENT_TYPES.projectile)

    for (const entity of projectiles) {
      const projectile = entity.getComponent<ProjectileComponent>(
        COMPONENT_TYPES.projectile
      )
      if (!projectile) continue

      projectile.lifetime -= dt
      if (projectile.lifetime <= ZERO_LIFETIME) {
        world.removeEntity(entity.id)
      }
    }
  }
}

export default ProjectileSystem
