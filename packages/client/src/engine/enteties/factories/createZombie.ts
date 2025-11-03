import ZombieEntity from '../entities/ZombieEntity';

export function createZombie(x: number, y: number, level = 1) {
  return new ZombieEntity(x, y, level);
}

export default createZombie;
