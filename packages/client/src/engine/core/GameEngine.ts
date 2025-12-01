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
  private paused = false;
  private hardPaused = false;
  private animationFrameId: number | null = null;

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.togglePause();
    }
  };

  private handlePlayerKilled = () => {
    this.hardPause();
  };

  constructor(world: World) {
    this._world = world;
    this.destroyed = false;
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
    }
    this.eventBus.on('playerKilled', this.handlePlayerKilled);
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

    return this;
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
    this.paused = false;
    this.hardPaused = false;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy() {
    if (this.destroyed) return;
    this.stop();
    for (const system of this.systems.values()) {
      if (typeof (system as ISystem<SystemType>).onDestroy === 'function') {
        if (system.onDestroy) {
          system.onDestroy();
        }
      }
    }
    this._input.onDestroy();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
    this.eventBus.off('playerKilled', this.handlePlayerKilled);
    this.isRunning = false;
    this.systems.clear();
    this.destroyed = true;
  }

  pause() {
    if (this.paused) return;
    this.paused = true;
  }

  resume() {
    if (!this.paused || this.hardPaused) return;
    this.paused = false;
    this.lastTime = performance.now();
  }

  togglePause() {
    if (this.hardPaused) return;
    if (this.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  private hardPause() {
    this.paused = true;
    this.hardPaused = true;
  }

  private loop = (timestamp: number) => {
    if (!this.isRunning) return;

    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (this.paused) {
      if (this.isRunning) {
        this.animationFrameId = requestAnimationFrame(this.loop);
      }
      return;
    }

    this._input.update(dt);

    for (const system of this.systems.values()) {
      system.update(this.world, dt);
    }

    this.world.render(dt);

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    }
  };
}

export default GameEngine;
