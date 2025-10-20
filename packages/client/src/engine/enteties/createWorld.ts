import World from '../core/World';
import EventBus from '../infrastructure/EventBus';
import worldSettings from '../settings/world-settings/world';

export function createWorld() {
  const world = new World(EventBus.instance);
  world.setBounds(worldSettings.bounds);

  return world;
}
