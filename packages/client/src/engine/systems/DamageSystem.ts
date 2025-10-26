import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import {
  DamageComponent,
  HealthComponent,
  EnemyComponent,
} from '../components';
import World from '../core/World';
import EventBus from '../infrastructure/EventBus';
import { ZERO_HP, ZERO_XP_REWARD } from './consts/damage';

const bus = EventBus.instance;

class DamageSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.damage as SystemType;
  update(world: World) {
    const entities = world.query(
      COMPONENT_TYPES.health,
      COMPONENT_TYPES.damage
    );

    for (const e of entities) {
      const health = e.getComponent<HealthComponent>(COMPONENT_TYPES.health);
      const damage = e.getComponent<DamageComponent>(COMPONENT_TYPES.damage);

      if (!health || !damage) continue;

      health.hp -= damage.amount;

      if (health.hp <= ZERO_HP) {
        const enemy = e.getComponent<EnemyComponent>(COMPONENT_TYPES.enemy);
        const killerId = damage.sourceId;
        const xpReward = enemy?.xpReward ?? ZERO_XP_REWARD;

        world.removeEntity(e.id);

        //to-do: смерть игрока

        //здесь ниже реализована только смерть противника и события по этому поводу.
        if (killerId && xpReward > 0) {
          bus.emit('enemyKilled', {
            killerId,
            xpReward,
          });
        }
      }

      e.removeComponent(COMPONENT_TYPES.damage);
    }
  }
}

export default DamageSystem;
