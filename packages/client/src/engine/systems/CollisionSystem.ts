import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
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
    const colliders = world.query(
      COMPONENT_TYPES.projectile,
      COMPONENT_TYPES.collision
    )

    for (let i = 0; i < colliders.length; i++) {
      const a = colliders[i]
      const posA = a.getComponent<PositionComponent>(COMPONENT_TYPES.position)
      const colA = a.getComponent<CollisionComponent>(COMPONENT_TYPES.collision)
      if (!posA || !colA) continue

      for (let j = i + 1; j < colliders.length; j++) {
        const b = colliders[j]
        const posB = b.getComponent<PositionComponent>(COMPONENT_TYPES.position)
        const colB = b.getComponent<CollisionComponent>(
          COMPONENT_TYPES.collision
        )
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
    const aIsProjectile = a.hasComponent(COMPONENT_TYPES.projectile)
    const bIsProjectile = b.hasComponent(COMPONENT_TYPES.projectile)

    if (aIsProjectile) {
      this.processProjectileHit(a, b, world)
    }

    if (bIsProjectile) {
      this.processProjectileHit(b, a, world)
    }
  }

  private processProjectileHit(
    projectileEntity: Entity,
    target: Entity,
    world: World
  ) {
    const projectile = projectileEntity.getComponent<ProjectileComponent>(
      COMPONENT_TYPES.projectile
    )
    if (!projectile) return

    if (projectile.sourceId === target.id) {
      return
    }

    if (target.hasComponent(COMPONENT_TYPES.health)) {
      const damage = projectile.damage ?? 10
      target.addComponent(
        new DamageComponent({ amount: damage, sourceId: projectileEntity.id })
      )
      world.removeEntity(projectileEntity.id)
      this.logger.debug(`Projectile hit entity`, { id: target.id, damage })
      return
    }

    if (target.hasComponent(COMPONENT_TYPES.obstacle)) {
      world.removeEntity(projectileEntity.id)
      return
    }

    if (!target.hasComponent(COMPONENT_TYPES.projectile)) {
      world.removeEntity(projectileEntity.id)
    }
  }
}

export default CollisionSystem
