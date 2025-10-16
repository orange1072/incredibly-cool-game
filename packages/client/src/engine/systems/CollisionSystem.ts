import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import {
  PositionComponent,
  CollisionComponent,
  DamageComponent,
  ProjectileComponent,
  ObstacleComponent,
  VelocityComponent,
} from '../core/Components'
import Entity from '../core/Entity'
import World from '../core/World'
import Logger from '../infrastructure/Logger'

class CollisionSystem implements ISystem {
  private logger = new Logger('CollisionSystem', 'warn')

  update(world: World): void {
    const colliders = world.query(
      COMPONENT_TYPES.collision,
      COMPONENT_TYPES.position
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

    if (aIsProjectile || bIsProjectile) {
      return
    }

    const playerEntity = a.hasComponent(COMPONENT_TYPES.playerControl)
      ? a
      : b.hasComponent(COMPONENT_TYPES.playerControl)
      ? b
      : null

    const aIsEnemy = a.hasComponent(COMPONENT_TYPES.enemy)
    const bIsEnemy = b.hasComponent(COMPONENT_TYPES.enemy)
    const aIsPlayer = playerEntity === a
    const bIsPlayer = playerEntity === b

    if (
      (aIsPlayer && bIsEnemy) ||
      (bIsPlayer && aIsEnemy) ||
      (aIsEnemy && bIsEnemy)
    ) {
      this.resolveDynamicOverlap(a, b)
    }

    const obstacleEntity = a.hasComponent(COMPONENT_TYPES.obstacle)
      ? a
      : b.hasComponent(COMPONENT_TYPES.obstacle)
      ? b
      : null

    if (playerEntity && obstacleEntity && playerEntity !== obstacleEntity) {
      this.resolvePlayerObstacle(playerEntity, obstacleEntity)
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

    const hitsPlayer = target.hasComponent(COMPONENT_TYPES.playerControl)

    if (target.hasComponent(COMPONENT_TYPES.health)) {
      const damage = projectile.damage ?? 10
      target.addComponent(
        new DamageComponent({
          amount: damage,
          sourceId: projectile.sourceId ?? projectileEntity.id,
        })
      )
      this.logger.debug(`Projectile hit entity`, {
        id: target.id,
        damage,
        sourceId: projectile.sourceId,
        passthrough: !hitsPlayer,
      })

      // if (hitsPlayer) {
      world.removeEntity(projectileEntity.id)
      // }
      return
    }

    if (target.hasComponent(COMPONENT_TYPES.obstacle)) {
      this.logger.debug(`Projectile passed through obstacle`, {
        projectileId: projectileEntity.id,
        obstacleId: target.id,
      })
      return
    }

    if (!target.hasComponent(COMPONENT_TYPES.projectile)) {
      world.removeEntity(projectileEntity.id)
    }
  }

  private resolvePlayerObstacle(player: Entity, obstacle: Entity) {
    const playerPos = player.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    )
    const playerCollision = player.getComponent<CollisionComponent>(
      COMPONENT_TYPES.collision
    )
    const obstaclePos = obstacle.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    )
    const obstacleCollision = obstacle.getComponent<CollisionComponent>(
      COMPONENT_TYPES.collision
    )
    const obstacleData = obstacle.getComponent<ObstacleComponent>(
      COMPONENT_TYPES.obstacle
    )
    if (!playerPos || !playerCollision || !obstaclePos || !obstacleCollision) {
      return
    }

    if (obstacleData && !obstacleData.isBlocking) {
      return
    }

    let dx = playerPos.x - obstaclePos.x
    let dy = playerPos.y - obstaclePos.y
    let distance = Math.hypot(dx, dy)
    const minDistance = playerCollision.radius + obstacleCollision.radius

    if (distance === 0) {
      dx = 1
      dy = 0
      distance = 0.0001
    }

    const overlap = minDistance - distance
    if (overlap <= 0) {
      return
    }

    const nx = dx / distance
    const ny = dy / distance

    playerPos.x += nx * overlap
    playerPos.y += ny * overlap

    const velocity = player.getComponent<VelocityComponent>(
      COMPONENT_TYPES.velocity
    )

    if (velocity) {
      const pushBack = velocity.dx * nx + velocity.dy * ny
      if (pushBack < 0) {
        velocity.dx -= pushBack * nx
        velocity.dy -= pushBack * ny
      }
    }
  }

  private resolveDynamicOverlap(entityA: Entity, entityB: Entity) {
    const posA = entityA.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    )
    const posB = entityB.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    )
    const colA = entityA.getComponent<CollisionComponent>(
      COMPONENT_TYPES.collision
    )
    const colB = entityB.getComponent<CollisionComponent>(
      COMPONENT_TYPES.collision
    )

    if (!posA || !posB || !colA || !colB) {
      return
    }

    let dx = posA.x - posB.x
    let dy = posA.y - posB.y
    let distance = Math.hypot(dx, dy)
    const minDistance = colA.radius + colB.radius

    if (distance === 0) {
      dx = 1
      dy = 0
      distance = 0.0001
    }

    const overlap = minDistance - distance
    if (overlap <= 0) {
      return
    }

    const nx = dx / distance
    const ny = dy / distance

    const totalRadius = Math.max(colA.radius + colB.radius, 0.0001)
    const moveA = overlap * (colB.radius / totalRadius)
    const moveB = overlap * (colA.radius / totalRadius)

    posA.x += nx * moveA
    posA.y += ny * moveA
    posB.x -= nx * moveB
    posB.y -= ny * moveB

    const velA = entityA.getComponent<VelocityComponent>(
      COMPONENT_TYPES.velocity
    )
    if (velA) {
      const relA = velA.dx * nx + velA.dy * ny
      if (relA < 0) {
        velA.dx -= relA * nx
        velA.dy -= relA * ny
      }
    }

    const velB = entityB.getComponent<VelocityComponent>(
      COMPONENT_TYPES.velocity
    )
    if (velB) {
      const relB = velB.dx * -nx + velB.dy * -ny
      if (relB < 0) {
        velB.dx -= relB * -nx
        velB.dy -= relB * -ny
      }
    }
  }
}

export default CollisionSystem
