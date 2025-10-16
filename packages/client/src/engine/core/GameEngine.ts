import { ISystem } from '../../types/engine.types'
import EventBus from '../infrastructure/EventBus'
import InputManager from '../infrastructure/InputManager'
import Renderer from '../systems/RenderSystem'
import World from './World'

class GameEngine {
  private world: World
  private systems: ISystem[] = []
  private eventBus = EventBus.instance
  private input = new InputManager()
  private renderer: Renderer
  private lastTime = 0
  private isRunning = false

  constructor(renderer: Renderer, world?: World) {
    this.world = world ?? new World(this.eventBus)
    this.renderer = renderer
  }

  getWorld() {
    return this.world
  }

  getEventBus() {
    return this.eventBus
  }

  getInputManager() {
    return this.input
  }

  addSystem(system: ISystem) {
    this.systems.push(system)
    if (system.initialize) {
      system.initialize(this.world)
    }
  }

  start() {
    this.isRunning = true
    this.lastTime = performance.now()
    requestAnimationFrame(this.loop)
  }

  stop() {
    this.isRunning = false
  }

  private loop = (timestamp: number) => {
    const dt = (timestamp - this.lastTime) / 1000
    this.lastTime = timestamp

    this.input.update(dt)

    for (const system of this.systems) {
      system.update(this.world, dt)
    }

    this.renderer.render(this.world)

    if (this.isRunning) requestAnimationFrame(this.loop)
  }
}

export default GameEngine
