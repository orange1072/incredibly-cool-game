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

export function createBoss(x: number, y: number, level = 1) {
  const boss = new Entity()

  const baseHp = 500 + level * 150
  const baseSpeed = 40 + level * 3

  boss.addComponent(new PositionComponent(x, y))
  boss.addComponent(new VelocityComponent(0, 0))
  boss.addComponent(new HealthComponent(baseHp, baseHp))
  boss.addComponent(new CollisionComponent(50))
  boss.addComponent(new EnemyComponent('boss', 500, 40, baseSpeed, 500))
  boss.addComponent(new AIComponent('idle'))
  boss.addComponent(new SpriteComponent('zombie-boss', 128, 128))

  return boss
}
