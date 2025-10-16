import { COMPONENT_TYPES, ISystem } from '../../types/engine.types'
import {
  EffectComponent,
  HealthComponent,
  VelocityComponent,
} from '../core/Components'
import World from '../core/World'

const ZERO_EFFECT_TIME = 0
const ZERO_TICK_TIMER = 0
const ONE_TICK = 1
const SPEED_BOOST_MULTIPLIER = 1.1
const SLOW_BOOST_MULTIPLIER = 0.9
const ZERO_EFFECTS = 0
const ZERO_HEALTH = 0

class EffectSystem implements ISystem {
  update(world: World, dt: number): void {
    const entities = world.query(COMPONENT_TYPES.effect)

    for (const e of entities) {
      const effectComp = e.getComponent<EffectComponent>(COMPONENT_TYPES.effect)
      if (!effectComp) continue

      for (const effect of effectComp.effects) {
        effect.elapsed = (effect.elapsed ?? ZERO_EFFECT_TIME) + dt
        effect.tickTimer = (effect.tickTimer ?? ZERO_TICK_TIMER) + dt

        if (effect.kind === 'damageOverTime') {
          if (effect.tickTimer >= (effect.tickRate ?? ONE_TICK)) {
            const health = e.getComponent<HealthComponent>(
              COMPONENT_TYPES.health
            )
            if (health)
              health.hp = Math.max(ZERO_HEALTH, health.hp - effect.value)
            effect.tickTimer = ZERO_TICK_TIMER
          }
        }

        if (effect.kind === 'healOverTime') {
          if (effect.tickTimer >= (effect.tickRate ?? ONE_TICK)) {
            const health = e.getComponent<HealthComponent>(
              COMPONENT_TYPES.health
            )
            if (health)
              health.hp = Math.min(health.maxHp, health.hp + effect.value)
            effect.tickTimer = ZERO_TICK_TIMER
          }
        }

        if (effect.kind === 'speedBoost') {
          const vel = e.getComponent<VelocityComponent>(
            COMPONENT_TYPES.velocity
          )
          if (vel) {
            vel.dx *= SPEED_BOOST_MULTIPLIER
            vel.dy *= SPEED_BOOST_MULTIPLIER
          }
        }

        if (effect.kind === 'slow') {
          const vel = e.getComponent<VelocityComponent>(
            COMPONENT_TYPES.velocity
          )
          if (vel) {
            vel.dx *= SLOW_BOOST_MULTIPLIER
            vel.dy *= SLOW_BOOST_MULTIPLIER
          }
        }
      }

      effectComp.effects = effectComp.effects.filter(
        (ef) => (ef.elapsed ?? ZERO_EFFECT_TIME) < ef.duration
      )

      if (effectComp.effects.length === ZERO_EFFECTS) {
        e.removeComponent(COMPONENT_TYPES.effect)
      }
    }
  }
}

export default EffectSystem
