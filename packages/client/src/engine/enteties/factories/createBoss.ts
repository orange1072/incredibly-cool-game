import BossEntity from '../entities/BossEntity';

export function createBoss(x: number, y: number, level = 1) {
  return new BossEntity(x, y, level);
}

export default createBoss;
