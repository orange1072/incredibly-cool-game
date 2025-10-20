import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types'
import {
  EffectComponent,
  HealthComponent,
  VelocityComponent,
} from '../components'
import World from '../core/World'
import {
  ONE_TICK,
  SLOW_BOOST_MULTIPLIER,
  SPEED_BOOST_MULTIPLIER,
  ZERO_EFFECTS,
  ZERO_EFFECT_TIME,
  ZERO_HEALTH,
  ZERO_TICK_TIMER,
} from './consts/effect'

class EffectSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.effect as SystemType
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
