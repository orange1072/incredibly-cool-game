import {
  COMPONENT_TYPES,
  type ISystem,
  SYSTEM_TYPES,
  type SystemType,
} from '../../types/engine.types';
import {
  EnemyRangedAttackComponent,
  PositionComponent,
  HealthComponent,
} from '../components';
import World from '../core/World';
import { createProjectile } from '../enteties/factories/createProjectile';

class EnemyRangedAttackSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.enemyRangedAttack as SystemType;

  update(world: World, dt: number) {
    const player = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.position,
      COMPONENT_TYPES.health
    )[0];
    if (!player) return;

    const playerPos = player.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    );
    const playerHealth = player.getComponent<HealthComponent>(
      COMPONENT_TYPES.health
    );
    if (!playerPos || !playerHealth || playerHealth.hp <= 0) return;

    const rangedEnemies = world.query(
      COMPONENT_TYPES.enemyRangedAttack,
      COMPONENT_TYPES.position,
      COMPONENT_TYPES.enemy,
      COMPONENT_TYPES.health
    );

    for (const enemy of rangedEnemies) {
      const ranged = enemy.getComponent<EnemyRangedAttackComponent>(
        COMPONENT_TYPES.enemyRangedAttack
      );
      const position = enemy.getComponent<PositionComponent>(
        COMPONENT_TYPES.position
      );
      const health = enemy.getComponent<HealthComponent>(
        COMPONENT_TYPES.health
      );
      if (!ranged || !position || !health || health.hp <= 0) {
        continue;
      }

      ranged.timer = Math.max(ranged.timer - dt, 0);

      const dx = playerPos.x - position.x;
      const dy = playerPos.y - position.y;
      const distance = Math.hypot(dx, dy);

      if (distance <= ranged.range && ranged.timer <= 0) {
        const projectile = createProjectile(
          playerPos,
          position,
          enemy.id,
          ranged.projectileDamage,
          ranged.projectileSpeed
        );
        world.addEntity(projectile);
        ranged.timer = ranged.cooldown;
      }
    }
  }
}

export default EnemyRangedAttackSystem;
