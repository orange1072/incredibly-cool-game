import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import {
  AIComponent,
  PositionComponent,
  VelocityComponent,
  HealthComponent,
  AttackComponent,
  EnemyComponent,
  DamageComponent,
} from '../core/Components'
import World from '../core/World'
import Entity from '../core/Entity'
import Logger from '../infrastructure/Logger'

class AISystem implements ISystem {
  private logger = new Logger('AISystem', 'warn')
  private chaseDistance = 600
  private attackDistance = 40
  private moveSpeed = 50

  update(world: World, dt: number): void {
    const player = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.position
    )[0]
    if (!player) return

    const playerPos = player.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    )
    const playerHealth = player.getComponent<HealthComponent>(
      COMPONENT_TYPES.health
    )
    if (!playerPos || !playerHealth || playerHealth.hp <= 0) return

    const enemies = world.query(
      COMPONENT_TYPES.ai,
      COMPONENT_TYPES.position,
      COMPONENT_TYPES.velocity,
      COMPONENT_TYPES.enemy
    )

    for (const e of enemies) {
      const ai = e.getComponent<AIComponent>(COMPONENT_TYPES.ai)
      const pos = e.getComponent<PositionComponent>(COMPONENT_TYPES.position)
      const vel = e.getComponent<VelocityComponent>(COMPONENT_TYPES.velocity)
      const health = e.getComponent<HealthComponent>(COMPONENT_TYPES.health)
      const attack = e.getComponent<AttackComponent>(COMPONENT_TYPES.attack)
      const enemy = e.getComponent<EnemyComponent>(COMPONENT_TYPES.enemy)

      if (!ai || !pos || !vel || !health || !enemy) continue

      if (health.hp <= 0) {
        vel.dx = vel.dy = 0
        ai.state = 'dead'
        continue
      }

      const dx = playerPos.x - pos.x
      const dy = playerPos.y - pos.y
      const dist = Math.hypot(dx, dy)
      const chaseDistance = enemy.aggroRange ?? this.chaseDistance
      const attackDistance = enemy.attackRange ?? this.attackDistance
      const moveSpeed = enemy.speed ?? this.moveSpeed

      if (attack) {
        attack.cooldownTimer = Math.max(attack.cooldownTimer - dt, 0)
      }

      if (dist > chaseDistance) {
        ai.state = 'idle'
        vel.dx = vel.dy = 0
      } else if (dist > attackDistance) {
        ai.state = 'chase'
        const normX = dx / dist
        const normY = dy / dist
        vel.dx = normX * moveSpeed
        vel.dy = normY * moveSpeed
      } else {
        ai.state = 'attack'
        vel.dx = vel.dy = 0
        if (attack && attack.cooldownTimer <= 0) {
          this.applyDamage(player, enemy.damage ?? attack.damage, e.id, attack)
        }
      }

      // опционально логируем смену состояния
      // this.logger.debug(`${e.id} → ${ai.state}`, { dist })
    }
  }

  private applyDamage(
    target: Entity,
    amount: number,
    sourceId: string,
    attack: AttackComponent
  ) {
    const existing = target.getComponent<DamageComponent>(
      COMPONENT_TYPES.damage
    )
    if (existing) {
      existing.amount += amount
      existing.sourceId = sourceId
    } else {
      target.addComponent(new DamageComponent({ amount, sourceId }))
    }

    attack.cooldownTimer = attack.cooldown
  }
}

export default AISystem
