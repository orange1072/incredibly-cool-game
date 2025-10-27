import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import {
  PlayerControlComponent,
  PositionComponent,
  VelocityComponent,
  AttackComponent,
} from '../components';
import World from '../core/World';
import InputManager from '../infrastructure/InputManager';
import Entity from '../core/Entity';
import { getProximity } from './helpers/calculations';
import {
  DEFAULT_AUTO_FIRE_RANGE,
  DEFAULT_PLAYER_SPEED,
  MOVE_FLAG,
  STOP_FLAG,
  ZERO_COOLDOWN,
} from './consts/player-control';
import { createProjectile } from '../enteties/createProjectile';

class PlayerControlSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.playerControl as SystemType;

  constructor(
    private input: InputManager,
    private speed = DEFAULT_PLAYER_SPEED
  ) {}

  update(world: World, dt: number): void {
    const entities = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.position,
      COMPONENT_TYPES.velocity
    );

    for (const e of entities) {
      const pos = e.getComponent<PositionComponent>(COMPONENT_TYPES.position);
      const vel = e.getComponent<VelocityComponent>(COMPONENT_TYPES.velocity);
      const control = e.getComponent<PlayerControlComponent>(
        COMPONENT_TYPES.playerControl
      );
      const attack = e.getComponent<AttackComponent>(COMPONENT_TYPES.attack);

      if (!pos || !vel || !control) continue;

      if (attack) {
        attack.cooldownTimer = Math.max(
          ZERO_COOLDOWN,
          attack.cooldownTimer - dt
        );
      }

      const horizontal =
        (this.input.isPressed('d') || this.input.isPressed('в')
          ? MOVE_FLAG
          : STOP_FLAG) -
        (this.input.isPressed('a') || this.input.isPressed('ф')
          ? MOVE_FLAG
          : STOP_FLAG);

      const vertical =
        (this.input.isPressed('s') || this.input.isPressed('ы')
          ? MOVE_FLAG
          : STOP_FLAG) -
        (this.input.isPressed('w') || this.input.isPressed('ц')
          ? MOVE_FLAG
          : STOP_FLAG);

      vel.dx = horizontal * this.speed;
      vel.dy = vertical * this.speed;

      const target = this.findNearestEnemy(world, pos, DEFAULT_AUTO_FIRE_RANGE);
      control.shooting = Boolean(target);

      if (target && attack && attack.cooldownTimer <= ZERO_COOLDOWN) {
        const projectile = this.spawnProjectile(e, pos, target, attack);
        if (projectile) {
          world.addEntity(projectile);
          attack.cooldownTimer = attack.cooldown;
        }
      }
    }
  }

  private spawnProjectile(
    source: Entity,
    sourcePos: PositionComponent,
    target: Entity,
    attack: AttackComponent
  ) {
    const targetPos = target.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    );
    if (!targetPos) return null;

    return createProjectile(targetPos, sourcePos, source.id, attack.damage);
  }

  private findNearestEnemy(
    world: World,
    origin: PositionComponent,
    maxDistance = Infinity
  ) {
    const enemies = world.query(
      COMPONENT_TYPES.enemy,
      COMPONENT_TYPES.position
    );
    let nearest: Entity | null = null;
    let nearestDist = Infinity;

    for (const enemy of enemies) {
      const enemyPos = enemy.getComponent<PositionComponent>(
        COMPONENT_TYPES.position
      );
      if (!enemyPos) continue;
      const dist = Math.hypot(
        getProximity(enemyPos.x, origin.x),
        getProximity(enemyPos.y, origin.y)
      );
      if (dist < nearestDist && dist <= maxDistance) {
        nearestDist = dist;
        nearest = enemy;
      }
    }

    return nearest;
  }
}

export default PlayerControlSystem;
