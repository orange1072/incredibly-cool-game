import World from '../../core/World';
import EventBus from '../../infrastructure/EventBus';
import worldSettings from '../../settings/world-settings/world';

export class GameWorld extends World {
  constructor() {
    super(EventBus.instance);
    this.setBounds(worldSettings.bounds);
  }
}

export default GameWorld;
