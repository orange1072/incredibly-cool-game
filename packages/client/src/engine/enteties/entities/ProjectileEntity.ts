import {
  CollisionComponent,
  PositionComponent,
  ProjectileComponent,
  SpriteComponent,
  VelocityComponent,
} from '../../components';
import Entity from '../../core/Entity';
import {
  DEFAULT_BULLET_HEIGHT,
  DEFAULT_BULLET_SPEED,
  DEFAULT_BULLET_WIDTH,
  PROJECTILE_LIFETIME,
  PROJECTILE_RADIUS,
  ZERO_DISTANCE,
} from '../../systems/consts/player-control';
import {
  calculateUnitDirection,
  getProximity,
} from '../../systems/helpers/calculations';

export class ProjectileEntity extends Entity {
  private constructor() {
    super();
  }

  static create(
    targetPos: PositionComponent,
    sourcePos: PositionComponent,
    sourceId: string,
    damage: number
  ): ProjectileEntity | null {
    const dx = getProximity(targetPos.x, sourcePos.x);
    const dy = getProximity(targetPos.y, sourcePos.y);

    const dist = Math.hypot(dx, dy);
    if (dist === ZERO_DISTANCE) return null;

    const dirX = calculateUnitDirection(dx, dist);
    const dirY = calculateUnitDirection(dy, dist);

    const projectile = new ProjectileEntity();
    projectile.addComponent(
      new PositionComponent({ x: sourcePos.x, y: sourcePos.y })
    );
    projectile.addComponent(
      new VelocityComponent({
        dx: dirX * DEFAULT_BULLET_SPEED,
        dy: dirY * DEFAULT_BULLET_SPEED,
      })
    );
    projectile.addComponent(
      new ProjectileComponent({
        damage,
        sourceId,
        speed: DEFAULT_BULLET_SPEED,
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
}

export default ProjectileEntity;
