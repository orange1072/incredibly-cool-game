import { COMPONENT_TYPES, ISystem } from '../../types/engine.types';
import {
  PlayerControlComponent,
  PositionComponent,
  VelocityComponent,
  AttackComponent,
  CollisionComponent,
  ProjectileComponent,
  SpriteComponent,
} from '../components';
import World from '../core/World';
import InputManager from '../infrastructure/InputManager';
import Entity from '../core/Entity';
import { getProximity, calculateUnitDirection } from './helpers/calculations';

const DEFAULT_BULLET_SPEED = 600;
const DEFAULT_AUTO_FIRE_RANGE = 100;
const DEFAULT_PLAYER_SPEED = 200;
const ZERO_DISTANCE = 0;
const ZERO_COOLDOWN = 0;
const PROJECTILE_LIFETIME = 2;
const PROJECTILE_RADIUS = 6;
const DEFAULT_BULLET_WIDTH = 4;
const DEFAULT_BULLET_HEIGHT = 4;
const MOVE_FLAG = 1;
const STOP_FLAG = 0;

class PlayerControlSystem implements ISystem {
  private bulletSpeed = DEFAULT_BULLET_SPEED;
  private autoFireRange = DEFAULT_AUTO_FIRE_RANGE;

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

      const target = this.findNearestEnemy(world, pos, this.autoFireRange);
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

    const dx = getProximity(targetPos.x, sourcePos.x);
    const dy = getProximity(targetPos.y, sourcePos.y);
    const dist = Math.hypot(dx, dy);
    if (dist === ZERO_DISTANCE) return null;

    const dirX = calculateUnitDirection(dx, dist);
    const dirY = calculateUnitDirection(dy, dist);

    const projectile = new Entity();
    projectile.addComponent(
      new PositionComponent({ x: sourcePos.x, y: sourcePos.y })
    );
    projectile.addComponent(
      new VelocityComponent({
        dx: dirX * this.bulletSpeed,
        dy: dirY * this.bulletSpeed,
      })
    );
    projectile.addComponent(
      new ProjectileComponent({
        damage: attack.damage,
        sourceId: source.id,
        speed: this.bulletSpeed,
        lifetime: PROJECTILE_LIFETIME,
      })
    );
    projectile.addComponent(
      new CollisionComponent({ radius: PROJECTILE_RADIUS })
    );
    projectile.addComponent(
      new SpriteComponent({
        name: 'bullet',
        width: DEFAULT_BULLET_WIDTH,
        height: DEFAULT_BULLET_HEIGHT,
        source: 'bullet',
      })
    );

    return projectile;
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
