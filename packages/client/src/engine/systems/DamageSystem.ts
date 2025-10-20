import { COMPONENT_TYPES, ISystem } from '../../types/engine.types';
import {
  DamageComponent,
  HealthComponent,
  EnemyComponent,
} from '../components';
import World from '../core/World';
import EventBus from '../infrastructure/EventBus';

const bus = EventBus.instance;

const ZERO_XP_REWARD = 0;
const ZERO_HP = 0;

class DamageSystem implements ISystem {
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
