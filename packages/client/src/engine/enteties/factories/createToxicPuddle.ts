import ToxicPuddleEntity from '../entities/ToxicPuddleEntity';

export function createToxicPuddle(x: number, y: number, ttl = 5) {
  return new ToxicPuddleEntity(x, y, ttl);
}

export default createToxicPuddle;
