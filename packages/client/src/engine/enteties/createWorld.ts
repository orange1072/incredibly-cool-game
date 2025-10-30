import World from '../core/World';
import EventBus from '../infrastructure/EventBus';
import worldSettings from '../settings/world-settings/world';
import RendererSystem from '../systems/RenderSystem';

export function createWorld(renderer: RendererSystem) {
  const world = new World(EventBus.instance, renderer);
  world.setBounds(worldSettings.bounds);

  return world;
}
