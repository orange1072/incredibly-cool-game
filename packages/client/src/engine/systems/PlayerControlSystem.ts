import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import {
  PlayerControlComponent,
  PositionComponent,
  VelocityComponent,
  AttackComponent,
  CollisionComponent,
  ProjectileComponent,
  SpriteComponent,
} from '../core/Components'
import World from '../core/World'
import InputManager from '../infrastructure/InputManager'
import Entity from '../core/Entity'

class PlayerControlSystem implements ISystem {
  private bulletSpeed = 600
  private autoFireRange = 100

  constructor(private input: InputManager, private speed = 200) {}

  update(world: World, dt: number): void {
    const entities = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.position,
      COMPONENT_TYPES.velocity
    )

    for (const e of entities) {
      const pos = e.getComponent<PositionComponent>(COMPONENT_TYPES.position)
      const vel = e.getComponent<VelocityComponent>(COMPONENT_TYPES.velocity)
      const control = e.getComponent<PlayerControlComponent>(
        COMPONENT_TYPES.playerControl
      )
      const attack = e.getComponent<AttackComponent>(COMPONENT_TYPES.attack)

      if (!pos || !vel || !control) continue

      if (attack) {
        attack.cooldownTimer = Math.max(0, attack.cooldownTimer - dt)
      }

      const horizontal =
        (this.input.isPressed('d') || this.input.isPressed('в') ? 1 : 0) -
        (this.input.isPressed('a') || this.input.isPressed('ф') ? 1 : 0)
      const vertical =
        (this.input.isPressed('s') || this.input.isPressed('ы') ? 1 : 0) -
        (this.input.isPressed('w') || this.input.isPressed('ц') ? 1 : 0)

      vel.dx = horizontal * this.speed
      vel.dy = vertical * this.speed

      const target = this.findNearestEnemy(world, pos, this.autoFireRange)
      control.shooting = Boolean(target)

      if (target && attack && attack.cooldownTimer <= 0) {
        const projectile = this.spawnProjectile(e, pos, target, attack)
        if (projectile) {
          world.addEntity(projectile)
          attack.cooldownTimer = attack.cooldown
        }
      }
    }
  }

  private spawnProjectile(
    source: Entity,
    sourcePos: PositionComponent,
    target: Entity,
    attack: AttackComponent
  ) {
    const targetPos = target.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    )
    if (!targetPos) return null

    const dx = targetPos.x - sourcePos.x
    const dy = targetPos.y - sourcePos.y
    const dist = Math.hypot(dx, dy)
    if (dist === 0) return null

    const dirX = dx / dist
    const dirY = dy / dist

    const projectile = new Entity()
    projectile.addComponent(
      new PositionComponent({ x: sourcePos.x, y: sourcePos.y })
    )
    projectile.addComponent(
      new VelocityComponent({
        dx: dirX * this.bulletSpeed,
        dy: dirY * this.bulletSpeed,
      })
    )
    projectile.addComponent(
      new ProjectileComponent({
        damage: attack.damage,
        sourceId: source.id,
        speed: this.bulletSpeed,
        lifetime: 2,
      })
    )
    projectile.addComponent(new CollisionComponent({ radius: 6 }))
    projectile.addComponent(
      new SpriteComponent({
        name: 'bullet',
        width: 4,
        height: 4,
        source: 'bullet',
      })
    )

    return projectile
  }

  private findNearestEnemy(
    world: World,
    origin: PositionComponent,
    maxDistance = Infinity
  ) {
    const enemies = world.query(COMPONENT_TYPES.enemy, COMPONENT_TYPES.position)
    let nearest: Entity | null = null
    let nearestDist = Infinity

    for (const enemy of enemies) {
      const enemyPos = enemy.getComponent<PositionComponent>(
        COMPONENT_TYPES.position
      )
      if (!enemyPos) continue
      const dist = Math.hypot(enemyPos.x - origin.x, enemyPos.y - origin.y)
      if (dist < nearestDist && dist <= maxDistance) {
        nearestDist = dist
        nearest = enemy
      }
    }

    return nearest
  }
}

export default PlayerControlSystem
