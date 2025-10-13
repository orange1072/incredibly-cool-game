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

export function createZombie(x: number, y: number, level = 1) {
  const zombie = new Entity()

  const baseHp = 30 + level * 10
  const baseSpeed = 50 + level * 5

  zombie.addComponent(new PositionComponent(x, y))
  zombie.addComponent(new VelocityComponent(0, 0))
  zombie.addComponent(new HealthComponent(baseHp, baseHp))
  zombie.addComponent(new CollisionComponent(12))
  zombie.addComponent(new EnemyComponent('zombie', 20, 10, baseSpeed, 200))
  zombie.addComponent(new AIComponent('idle'))
  zombie.addComponent(new SpriteComponent('zombie-walker', 32, 32))

  return zombie
}
