import { getZombieVariantForLevel } from '../../settings/enemy-settings/zombie';
import ZombieEntity from '../entities/ZombieEntity';

export function createZombie(x: number, y: number, level = 1) {
  const variant = getZombieVariantForLevel(level);
  return new ZombieEntity(x, y, level, variant);
}

export default createZombie;
