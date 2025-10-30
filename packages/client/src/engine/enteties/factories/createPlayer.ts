import PlayerEntity from '../entities/PlayerEntity';

export function createPlayer(
  worldBoundsWidth: number,
  worldBoundsHeight: number
) {
  return new PlayerEntity(worldBoundsWidth, worldBoundsHeight);
}

export default createPlayer;
