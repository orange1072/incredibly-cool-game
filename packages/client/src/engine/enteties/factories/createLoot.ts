import { LootType } from '@/types/engine.types';
import { PositionComponent } from '../../components';
import LootEntity from '../entities/LootEntity';

export function createLoot(
  targetPos: PositionComponent,
  lootType: LootType,
  amount: number
) {
  return new LootEntity(targetPos, lootType, amount);
}

export default createLoot;
