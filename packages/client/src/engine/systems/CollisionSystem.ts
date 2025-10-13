import { ISystem } from '../../types/engine.types'
import {
  PositionComponent,
  CollisionComponent,
  DamageComponent,
  ProjectileComponent,
} from '../core/Components'
import Entity from '../core/Entity'
import World from '../core/World'
import Logger from '../infrastructure/Logger'

class CollisionSystem implements ISystem {
  private logger = new Logger('CollisionSystem', 'warn')

  update(world: World): void {
    const colliders = world.query('collision', 'position')

    for (let i = 0; i < colliders.length; i++) {
      const a = colliders[i]
      const posA = a.getComponent<PositionComponent>('position')
      const colA = a.getComponent<CollisionComponent>('collision')
      if (!posA || !colA) continue

      for (let j = i + 1; j < colliders.length; j++) {
        const b = colliders[j]
        const posB = b.getComponent<PositionComponent>('position')
        const colB = b.getComponent<CollisionComponent>('collision')
        if (!posB || !colB) continue

        const dx = posA.x - posB.x
        const dy = posA.y - posB.y
        const dist = Math.hypot(dx, dy)
        const minDist = colA.radius + colB.radius

        if (dist <= minDist) {
          this.handleCollision(a, b, world)
        }
      }
    }
  }

  private handleCollision(a: Entity, b: Entity, world: World) {
    const aIsProjectile = a.hasComponent('projectile')
    const bIsProjectile = b.hasComponent('projectile')

    if (aIsProjectile && b.hasComponent('health')) {
      const projectile = a.getComponent<ProjectileComponent>('projectile')
      const damage = projectile?.damage ?? 10
      b.addComponent(new DamageComponent(damage, a.id))
      this.logger.debug(`Projectile hit enemy`, { id: b.id, damage })
    }

    if (bIsProjectile && a.hasComponent('health')) {
      const projectile = b.getComponent<ProjectileComponent>('projectile')
      const damage = projectile?.damage ?? 10
      a.addComponent(new DamageComponent(damage, b.id))
      world.removeEntity(b.id)
      this.logger.debug(`Projectile hit enemy`, { id: a.id, damage })
    }
  }
}

export default CollisionSystem
