import { getBossVariantForLevel } from '../../settings/enemy-settings/bosses';
import BossEntity from '../entities/BossEntity';

export function createBoss(x: number, y: number, level = 1) {
  const variant = getBossVariantForLevel(level);
  return new BossEntity(x, y, level, variant);
}

export default createBoss;
