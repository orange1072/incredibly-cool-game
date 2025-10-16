import GameEngine from '../core/GameEngine'
import Renderer from '../systems/RenderSystem'
import GenerateMapSystem from '../systems/GenerateMapSystem'
import SpawnSystem from '../systems/SpawnSystem'
import PlayerControlSystem from '../systems/PlayerControlSystem'
import MovementSystem from '../systems/MovementSystem'
import AISystem from '../systems/AISystem'
import CollisionSystem from '../systems/CollisionSystem'
import DamageSystem from '../systems/DamageSystem'
import ExperienceSystem from '../systems/ExpirienceSystem'
import EffectSystem from '../systems/EffectSystem'
import ProjectileSystem from '../systems/ProjectileSystem'
import { createPlayer } from '../enteties/createPlayer'
import { createWorld } from '../enteties/createWorld'
import type { StoreLike } from '../adapters/ReduxAdapter'
import type { RootState } from '../../store'

export function createGameEngine(
  canvas: HTMLCanvasElement,
  opts?: { store?: StoreLike<RootState> }
) {
  if (canvas.width === 0 || canvas.height === 0) {
    const baseWidth = canvas.clientWidth
    const baseHeight = canvas.clientHeight

    canvas.width = Math.round(baseWidth)
    canvas.height = Math.round(baseHeight)
  }

  const renderer = new Renderer(canvas)
  const world = createWorld()
  const engine = new GameEngine(renderer, world)

  const eventBus = engine.getEventBus()
  const input = engine.getInputManager()
  const worldBounds = world.getBounds()

  engine.addSystem(new GenerateMapSystem())
  engine.addSystem(new SpawnSystem({ eventBus, store: opts?.store }))
  engine.addSystem(new PlayerControlSystem(input))
  engine.addSystem(new MovementSystem())
  engine.addSystem(new ProjectileSystem())
  engine.addSystem(new AISystem())
  engine.addSystem(new CollisionSystem())
  engine.addSystem(new DamageSystem())
  engine.addSystem(new ExperienceSystem({ eventBus }))
  engine.addSystem(new EffectSystem())

  const player = createPlayer(worldBounds.width, worldBounds.height)

  world.addEntity(player)

  return engine
}
