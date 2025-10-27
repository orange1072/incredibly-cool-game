import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import {
  DamageComponent,
  EnemyComponent,
  HealthComponent,
  PositionComponent,
} from '../components';
import World from '../core/World';
import { createLoot } from '../enteties/createLoot';
import EventBus from '../infrastructure/EventBus';
import Logger from '../infrastructure/Logger';
import { ZERO_HP, ZERO_XP_REWARD } from './consts/damage';

const bus = EventBus.instance;

class DamageSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.damage as SystemType;
  private logger = new Logger('XP count');
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
        const isEnemy = e.hasComponent(COMPONENT_TYPES.enemy);
        const enemyPosition = e.getComponent<PositionComponent>(
          COMPONENT_TYPES.position
        );

        const isPlayer = e.hasComponent(COMPONENT_TYPES.playerControl);
        const killerId = damage.sourceId;
        const xpReward = enemy?.xpReward ?? ZERO_XP_REWARD;

        world.removeEntity(e.id);

        if (isPlayer) {
          this.getKilled();
        }

        if (isEnemy && killerId && xpReward > 0 && enemyPosition) {
          this.getLoot(killerId, enemyPosition, xpReward, world);
        }
      }

      e.removeComponent(COMPONENT_TYPES.damage);
    }
  }

  getKilled() {
    bus.emit('playerKilled');
  }

  getLoot(
    killerId: string,
    enemyPosition: PositionComponent,
    xpReward: number,
    world: World
  ) {
    bus.emit('enemyKilled', {
      killerId,
    });

    this.logger.info('xp loot', {
      enemy: enemyPosition.type,
      pos: enemyPosition,
    });
    const loot = createLoot(enemyPosition, 'xp', xpReward);
    world.addEntity(loot);
  }
}

export default DamageSystem;
