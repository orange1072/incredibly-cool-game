import {
  COMPONENT_TYPES,
  type ISystem,
  SYSTEM_TYPES,
  type SystemType,
} from '../../types/engine.types';
import { DespawnTimerComponent } from '../components';
import World from '../core/World';

class DespawnSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.despawn as SystemType;

  update(world: World, dt: number) {
    const timedEntities = world.query(COMPONENT_TYPES.despawnTimer);

    for (const entity of timedEntities) {
      const timer = entity.getComponent<DespawnTimerComponent>(
        COMPONENT_TYPES.despawnTimer
      );
      if (!timer) continue;

      timer.ttl -= dt;
      if (timer.ttl <= 0) {
        world.removeEntity(entity.id);
      }
    }
  }
}

export default DespawnSystem;
