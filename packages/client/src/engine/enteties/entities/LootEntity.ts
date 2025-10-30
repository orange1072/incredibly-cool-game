import { LootType } from '@/types/engine.types';
import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '../../components';
import LootComponent from '../../components/LootComponent';
import Entity from '../../core/Entity';
import {
  DEFAULT_XP_BOX_HEIGHT,
  DEFAULT_XP_BOX_WIDTH,
  PROJECTILE_RADIUS,
} from '../../systems/consts/player-control';

class LootEntity extends Entity {
  constructor(
    targetPos: PositionComponent,
    lootType: LootType,
    amount: number
  ) {
    super();

    this.addComponent(new PositionComponent({ x: targetPos.x, y: targetPos.y }))
      .addComponent(new CollisionComponent({ radius: PROJECTILE_RADIUS }))
      .addComponent(
        new SpriteComponent({
          name: 'loot',
          width: DEFAULT_XP_BOX_WIDTH,
          height: DEFAULT_XP_BOX_HEIGHT,
          source: lootType,
        })
      )
      .addComponent(new LootComponent({ lootType, amount }));
  }
}

export default LootEntity;
