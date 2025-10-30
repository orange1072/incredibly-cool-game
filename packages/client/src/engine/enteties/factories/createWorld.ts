import RendererSystem from '@/engine/systems/RenderSystem';
import GameWorld from '../entities/GameWorld';

export function createWorld(renderer: RendererSystem) {
  return new GameWorld(renderer);
}

export default createWorld;
