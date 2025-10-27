import { LootType } from '@/types/engine.types';
import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '../components';
import Entity from '../core/Entity';
import {
  DEFAULT_XP_BOX_HEIGHT,
  DEFAULT_XP_BOX_WIDTH,
  PROJECTILE_RADIUS,
} from '../systems/consts/player-control';
import LootComponent from '../components/LootComponent';

export function createLoot(
  targetPos: PositionComponent,
  lootType: LootType,
  amount: number
) {
  const loot = new Entity();
  loot.addComponent(new PositionComponent({ x: targetPos.x, y: targetPos.y }));
  loot.addComponent(new CollisionComponent({ radius: PROJECTILE_RADIUS }));
  loot.addComponent(
    new SpriteComponent({
      name: 'loot',
      width: DEFAULT_XP_BOX_WIDTH,
      height: DEFAULT_XP_BOX_HEIGHT,
      source: lootType,
    })
  );
  loot.addComponent(new LootComponent({ lootType, amount }));

  return loot;
}
