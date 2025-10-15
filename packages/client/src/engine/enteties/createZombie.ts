import {
  PositionComponent,
  VelocityComponent,
  HealthComponent,
  CollisionComponent,
  EnemyComponent,
  SpriteComponent,
  AIComponent,
} from '../core/Components'
import Entity from '../core/Entity'

import { regularZombie } from '../settings/enemy-settings/zombie'

export function createZombie(x: number, y: number, level = 1) {
  const zombie = new Entity()

  const zombieHealth = regularZombie.health.health(level)
  const movementSpeed = regularZombie.movement.speed
  const collisionRadius = regularZombie.collision.radius
  const aiState = regularZombie.ai.startingValue
  const aggroRange = regularZombie.ai.aggroRange
  const attackDamage = regularZombie.damage.baseValue
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
    })
  )
  zombie.addComponent(new AIComponent({ state: aiState }))
  zombie.addComponent(
    new SpriteComponent({
      name: sprite.name,
      width: sprite.width,
      height: sprite.height,
      source: sprite.source,
      scale: sprite.scale,
      frameDuration: sprite.frameDuration,
      columns: sprite.columns,
      rows: sprite.rows,
    })
  )

  return zombie
}
