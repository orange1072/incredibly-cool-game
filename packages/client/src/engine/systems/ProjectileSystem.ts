import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import { ProjectileComponent } from '../components';
import World from '../core/World';
import { ZERO_LIFETIME } from './consts/projectile';

class ProjectileSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.projectile as SystemType;
  update(world: World, dt: number): void {
    const projectiles = world.query(COMPONENT_TYPES.projectile);

    for (const entity of projectiles) {
      const projectile = entity.getComponent<ProjectileComponent>(
        COMPONENT_TYPES.projectile
      );
      if (!projectile) continue;

      projectile.lifetime -= dt;
      if (projectile.lifetime <= ZERO_LIFETIME) {
        world.removeEntity(entity.id);
      }
    }
  }
}

export default ProjectileSystem;
