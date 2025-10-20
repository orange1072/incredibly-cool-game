import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types'
import {
  PositionComponent,
  CollisionComponent,
  DamageComponent,
  ProjectileComponent,
  ObstacleComponent,
  VelocityComponent,
} from '../components'
import Entity from '../core/Entity'
import World from '../core/World'
import Logger from '../infrastructure/Logger'
import {
  displaceAlongNormal,
  getProximity,
  calculateUnitDirection,
} from './helpers/calculations'
import {
  getProperEntity,
  checkWhoIsEnemy,
  isProperEntity,
} from './helpers/utils'
import {
  DEFAULT_PROJECTILE_DAMAGE,
  MIN_DISTANCE,
  MIN_D_X,
  MIN_D_Y,
  ZERO_DISTANCE,
} from './consts/collision'

class CollisionSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.collision as SystemType
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

        const dx = getProximity(posA.x, posB.x)
        const dy = getProximity(posA.y, posB.y)
        const dist = Math.hypot(dx, dy)
        const minDist = colA.radius + colB.radius

        if (dist <= minDist) {
          this.handleCollision(a, b, world)
        }
      }
    }
  }

  private handleCollision(a: Entity, b: Entity, world: World) {
    const aIsProjectile = isProperEntity(a, COMPONENT_TYPES.projectile)
    const bIsProjectile = isProperEntity(b, COMPONENT_TYPES.projectile)

    if (aIsProjectile) {
      this.processProjectileHit(a, b, world)
    }

    if (bIsProjectile) {
      this.processProjectileHit(b, a, world)
    }

    if (aIsProjectile || bIsProjectile) {
      return
    }

    const playerEntity = getProperEntity([a, b], COMPONENT_TYPES.playerControl)

    const { aIsEnemy, bIsEnemy, aIsPlayer, bIsPlayer } = checkWhoIsEnemy(a, b)

    if (
      (aIsPlayer && bIsEnemy) ||
      (bIsPlayer && aIsEnemy) ||
      (aIsEnemy && bIsEnemy)
    ) {
      this.resolveDynamicOverlap(a, b)
    }

    const obstacleEntity = getProperEntity([a, b], COMPONENT_TYPES.obstacle)

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

    const hitsPlayer = isProperEntity(target, COMPONENT_TYPES.playerControl)

    if (isProperEntity(target, COMPONENT_TYPES.health)) {
      const damage = projectile.damage ?? DEFAULT_PROJECTILE_DAMAGE
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

      //to-do: здесь будет проверка типа оружия. сейчас удары противника уничтожают снаряд, а игрока заставляют пролетать
      if (hitsPlayer) {
        world.removeEntity(projectileEntity.id)
      } else {
        return
      }

      return
    }

    if (isProperEntity(target, COMPONENT_TYPES.obstacle)) {
      this.logger.debug(`Projectile passed through obstacle`, {
        projectileId: projectileEntity.id,
        obstacleId: target.id,
      })
      return
    }

    if (!isProperEntity(target, COMPONENT_TYPES.projectile)) {
      world.removeEntity(projectileEntity.id)
    }
  }

  private resolvePlayerObstacle(player: Entity, obstacle: Entity) {
    const { position: playerPos, collision: playerCollision } =
      this.getCollisionComponents(player)
    const {
      position: obstaclePos,
      collision: obstacleCollision,
      obstacle: obstacleData,
    } = this.getCollisionComponents(obstacle)
    if (!playerPos || !playerCollision || !obstaclePos || !obstacleCollision) {
      return
    }

    if (obstacleData && !obstacleData.isBlocking) {
      return
    }

    let dx = getProximity(playerPos.x, obstaclePos.x)
    let dy = getProximity(playerPos.y, obstaclePos.y)
    let distance = Math.hypot(dx, dy)
    const minDistance = playerCollision.radius + obstacleCollision.radius

    if (distance === ZERO_DISTANCE) {
      dx = MIN_D_X
      dy = MIN_D_Y
      distance = MIN_DISTANCE
    }

    const overlap = minDistance - distance
    if (overlap <= ZERO_DISTANCE) {
      return
    }

    const nx = calculateUnitDirection(dx, distance)
    const ny = calculateUnitDirection(dy, distance)

    playerPos.x = displaceAlongNormal(playerPos.x, nx, overlap)
    playerPos.y = displaceAlongNormal(playerPos.y, ny, overlap)

    const velocity = player.getComponent<VelocityComponent>(
      COMPONENT_TYPES.velocity
    )

    if (velocity) {
      const pushBack = velocity.dx * nx + velocity.dy * ny
      if (pushBack < ZERO_DISTANCE) {
        velocity.dx -= pushBack * nx
        velocity.dy -= pushBack * ny
      }
    }
  }

  private getCollisionComponents(entity: Entity) {
    return {
      position: entity.getComponent<PositionComponent>(
        COMPONENT_TYPES.position
      ),
      collision: entity.getComponent<CollisionComponent>(
        COMPONENT_TYPES.collision
      ),
      obstacle: entity.getComponent<ObstacleComponent>(
        COMPONENT_TYPES.obstacle
      ),
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

    //to-do: повторяющийся код
    let dx = getProximity(posA.x, posB.x)
    let dy = getProximity(posA.y, posB.y)
    let distance = Math.hypot(dx, dy)
    const minDistance = colA.radius + colB.radius

    if (distance === ZERO_DISTANCE) {
      dx = MIN_D_X
      dy = MIN_D_Y
      distance = MIN_DISTANCE
    }

    const overlap = minDistance - distance
    if (overlap <= ZERO_DISTANCE) {
      return
    }

    const nx = calculateUnitDirection(dx, distance)
    const ny = calculateUnitDirection(dy, distance)

    const totalRadius = Math.max(colA.radius + colB.radius, MIN_DISTANCE)
    const moveA = overlap * (colB.radius / totalRadius)
    const moveB = overlap * (colA.radius / totalRadius)

    posA.x = displaceAlongNormal(posA.x, nx, moveA)
    posA.y = displaceAlongNormal(posA.y, ny, moveA)
    posB.x = displaceAlongNormal(posB.x, -nx, moveB)
    posB.y = displaceAlongNormal(posB.y, -ny, moveB)

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
