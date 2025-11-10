import {
  CollisionComponent,
  DespawnTimerComponent,
  ObstacleComponent,
  PositionComponent,
  SpriteComponent,
} from '../../components';
import Entity from '../../core/Entity';

const DEFAULT_PUDDLE_RADIUS = 28;
const DEFAULT_PUDDLE_TTL = 5;

class ToxicPuddleEntity extends Entity {
  constructor(x: number, y: number, ttl = DEFAULT_PUDDLE_TTL) {
    super();

    this.addComponent(new PositionComponent({ x, y }))
      .addComponent(
        new CollisionComponent({
          radius: DEFAULT_PUDDLE_RADIUS,
        })
      )
      .addComponent(
        new ObstacleComponent({
          width: DEFAULT_PUDDLE_RADIUS * 2,
          height: DEFAULT_PUDDLE_RADIUS * 2,
          kind: 'toxicPuddle',
        })
      )
      .addComponent(new DespawnTimerComponent({ ttl }))
      .addComponent(
        new SpriteComponent({
          name: 'toxic-puddle',
          width: DEFAULT_PUDDLE_RADIUS * 2,
          height: DEFAULT_PUDDLE_RADIUS * 2,
          defaultColor: 'rgba(88, 199, 120, 0.75)',
          source: undefined,
          scale: 1,
        })
      );
  }
}

export default ToxicPuddleEntity;
