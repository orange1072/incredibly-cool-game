import World from '../../core/World';
import EventBus from '../../infrastructure/EventBus';
import worldSettings from '../../settings/world-settings/world';
import RendererSystem from '@/engine/systems/RenderSystem';

class GameWorld extends World {
  constructor(renderer: RendererSystem) {
    super(EventBus.instance, renderer);
    this.setBounds(worldSettings.bounds);
  }
}

export default GameWorld;
