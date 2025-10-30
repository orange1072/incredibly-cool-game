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
} from '../../systems/consts/player-control';
import {
  calculateUnitDirection,
  getProximity,
} from '../../systems/helpers/calculations';

class ProjectileEntity extends Entity {
  constructor(
    targetPos: PositionComponent,
    sourcePos: PositionComponent,
    sourceId: string,
    damage: number
  ) {
    super();

    const dx = getProximity(targetPos.x, sourcePos.x);
    const dy = getProximity(targetPos.y, sourcePos.y);

    const dist = Math.hypot(dx, dy);

    const dirX = calculateUnitDirection(dx, dist);
    const dirY = calculateUnitDirection(dy, dist);

    this.addComponent(new PositionComponent({ x: sourcePos.x, y: sourcePos.y }))
      .addComponent(
        new VelocityComponent({
          dx: dirX * DEFAULT_BULLET_SPEED,
          dy: dirY * DEFAULT_BULLET_SPEED,
        })
      )
      .addComponent(
        new ProjectileComponent({
          damage,
          sourceId,
          speed: DEFAULT_BULLET_SPEED,
          lifetime: PROJECTILE_LIFETIME,
        })
      )
      .addComponent(new CollisionComponent({ radius: PROJECTILE_RADIUS }))
      .addComponent(
        new SpriteComponent({
          name: 'bullet',
          width: DEFAULT_BULLET_WIDTH,
          height: DEFAULT_BULLET_HEIGHT,
          source: 'bullet',
        })
      );
  }
}

export default ProjectileEntity;
