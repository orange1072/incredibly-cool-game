import {
  PositionComponent,
  VelocityComponent,
  HealthComponent,
  CollisionComponent,
  EnemyComponent,
  SpriteComponent,
  AIComponent,
  AttackComponent,
} from '../core/Components'
import Entity from '../core/Entity'

import { regularZombie } from '../settings/enemy-settings/zombie'

export function createZombie(x: number, y: number, level = 1) {
  const zombie = new Entity()

  const damageProfile = regularZombie.damage
  const attackProfile = regularZombie.attack
  const zombieHealth = regularZombie.health.health(level)
  const movementSpeed = regularZombie.movement.speed
  const collisionRadius = regularZombie.collision.radius
  const aiState = regularZombie.ai.startingValue
  const aggroRange = regularZombie.ai.aggroRange
  const attackDamage = damageProfile.actualDamage.call(damageProfile, 0, 1)
  const xpReward = regularZombie.xpReward
  const sprite = regularZombie.sprite

  zombie.addComponent(new PositionComponent({ x, y }))
  zombie.addComponent(new VelocityComponent({ dx: 0, dy: 0 }))
  zombie.addComponent(
    new HealthComponent({ hp: zombieHealth, maxHp: zombieHealth })
  )
  zombie.addComponent(new CollisionComponent({ radius: collisionRadius }))
  zombie.addComponent(
    new EnemyComponent({
      kind: regularZombie.kind,
      xpReward,
      damage: attackDamage,
      speed: movementSpeed,
      aggroRange,
      attackRange: attackProfile.range,
      attackCooldown: attackProfile.cooldown,
    })
  )
  zombie.addComponent(new AIComponent({ state: aiState }))
  zombie.addComponent(
    new AttackComponent({
      damage: attackDamage,
      cooldown: attackProfile.cooldown,
    })
  )
  zombie.addComponent(
    new SpriteComponent({
      name: sprite.name,
      width: sprite.width,
      height: sprite.height,
      source: sprite.source,
      scale: sprite.scale ?? 1,
      frameDuration: sprite.frameDuration ?? 100,
      columns: sprite.columns ?? 1,
      rows: sprite.rows ?? 1,
      padding: sprite.padding,
    })
  )

  return zombie
}
