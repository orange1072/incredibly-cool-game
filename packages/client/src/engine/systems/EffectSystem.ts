import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import {
  EffectComponent,
  HealthComponent,
  VelocityComponent,
} from '../core/Components'
import World from '../core/World'

class EffectSystem implements ISystem {
  update(world: World, dt: number): void {
    const entities = world.query(COMPONENT_TYPES.effect)

    for (const e of entities) {
      const effectComp = e.getComponent<EffectComponent>(COMPONENT_TYPES.effect)
      if (!effectComp) continue

      for (const effect of effectComp.effects) {
        effect.elapsed = (effect.elapsed ?? 0) + dt
        effect.tickTimer = (effect.tickTimer ?? 0) + dt

        if (effect.kind === 'damageOverTime') {
          if (effect.tickTimer >= (effect.tickRate ?? 1)) {
            const health = e.getComponent<HealthComponent>(
              COMPONENT_TYPES.health
            )
            if (health) health.hp = Math.max(0, health.hp - effect.value)
            effect.tickTimer = 0
          }
        }

        if (effect.kind === 'healOverTime') {
          if (effect.tickTimer >= (effect.tickRate ?? 1)) {
            const health = e.getComponent<HealthComponent>(
              COMPONENT_TYPES.health
            )
            if (health)
              health.hp = Math.min(health.maxHp, health.hp + effect.value)
            effect.tickTimer = 0
          }
        }

        if (effect.kind === 'speedBoost') {
          const vel = e.getComponent<VelocityComponent>(
            COMPONENT_TYPES.velocity
          )
          if (vel) {
            vel.dx *= 1.1
            vel.dy *= 1.1
          }
        }

        if (effect.kind === 'slow') {
          const vel = e.getComponent<VelocityComponent>(
            COMPONENT_TYPES.velocity
          )
          if (vel) {
            vel.dx *= 0.9
            vel.dy *= 0.9
          }
        }
      }

      effectComp.effects = effectComp.effects.filter(
        (ef) => (ef.elapsed ?? 0) < ef.duration
      )

      if (effectComp.effects.length === 0) {
        e.removeComponent(COMPONENT_TYPES.effect)
      }
    }
  }
}

export default EffectSystem
