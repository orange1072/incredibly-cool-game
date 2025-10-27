import { ISystem, SystemType } from '../../types/engine.types';
import EventBus from '../infrastructure/EventBus';
import InputManager from '../infrastructure/InputManager';
import RendererSystem from '../systems/RenderSystem';
import World from './World';

class GameEngine {
  private destroyed: boolean;
  private world: World;
  private systems = new Map<SystemType, ISystem<SystemType>>();
  private eventBus = EventBus.instance;
  private input = new InputManager();
  private renderer: RendererSystem;
  private lastTime = 0;
  private isRunning = false;
  private paused = false;
  private hardPaused = false;

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.togglePause();
    }
  };

  private handlePlayerKilled = () => {
    this.hardPause();
  };

  constructor(renderer: RendererSystem, world?: World) {
    this.world = world ?? new World(this.eventBus);
    this.renderer = renderer;
    this.destroyed = false;
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
    }
    this.eventBus.on('playerKilled', this.handlePlayerKilled);
  }

  getWorld() {
    return this.world;
  }

  getEventBus() {
    return this.eventBus;
  }

  getInputManager() {
    return this.input;
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
    this.paused = false;
    this.hardPaused = false;
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
    this.input.onDestroy();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
    this.eventBus.off('playerKilled', this.handlePlayerKilled);
    this.isRunning = false;
    this.systems.clear();
    this.destroyed = true;
  }

  private pause() {
    if (this.paused) return;
    this.paused = true;
  }

  private resume() {
    if (!this.paused || this.hardPaused) return;
    this.paused = false;
    this.lastTime = performance.now();
  }

  private togglePause() {
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
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (this.paused) {
      if (this.isRunning) requestAnimationFrame(this.loop);
      return;
    }

    this.input.update(dt);

    for (const system of this.systems.values()) {
      system.update(this.world, dt);
    }

    this.renderer.update(this.world, dt);
    this.renderer.render(this.world);

    if (this.isRunning) requestAnimationFrame(this.loop);
  };
}

export default GameEngine;
