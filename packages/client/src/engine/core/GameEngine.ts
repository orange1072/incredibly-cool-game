import { ISystem, SystemType } from '../../types/engine.types';
import EventBus from '../infrastructure/EventBus';
import InputManager from '../infrastructure/InputManager';
import World from './World';

class GameEngine {
  private destroyed: boolean;
  private readonly _world: World;
  private systems = new Map<SystemType, ISystem<SystemType>>();
  private readonly _eventBus = EventBus.instance;
  private readonly _input = new InputManager();
  private lastTime = 0;
  private isRunning = false;

  constructor(world: World) {
    this._world = world;
    this.destroyed = false;
  }

  get world() {
    return this._world;
  }

  get eventBus() {
    return this._eventBus;
  }

  get inputManager() {
    return this._input;
  }

  addSystem(system: ISystem<SystemType>, type: SystemType) {
    this.systems.set(type, system);
    if (system.initialize) {
      system.initialize(this.world);
    }
    this.eventBus.emit('systemAdded', system);
  }

  getSystem(type: SystemType) {
    return this.systems.get(type);
  }

  removeSystem(type: SystemType) {
    const system = this.systems.get(type);
    if (!system) return;
    this.systems.delete(type);
    this.eventBus.emit('systemRemoved', system);
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
  }

  destroy() {
    if (this.destroyed) return;
    for (const system of this.systems.values()) {
      if (typeof (system as ISystem<SystemType>).onDestroy === 'function') {
        if (system.onDestroy) {
          system.onDestroy();
        }
      }
    }
    this._input.onDestroy();
    this.systems.clear();
    this.destroyed = true;
  }

  private loop = (timestamp: number) => {
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this._input.update(dt);

    for (const system of this.systems.values()) {
      system.update(this.world, dt);
    }

    this.world.render(dt);

    if (this.isRunning) requestAnimationFrame(this.loop);
  };
}

export default GameEngine;
