import GameEngine from '../core/GameEngine';
import Renderer from '../systems/RenderSystem';
import GenerateMapSystem from '../systems/GenerateMapSystem';
import SpawnSystem from '../systems/SpawnSystem';
import PlayerControlSystem from '../systems/PlayerControlSystem';
import MovementSystem from '../systems/MovementSystem';
import AnimationSystem from '../systems/AnimationSystem';
import CameraSystem from '../systems/CameraSystem';
import SpriteLoaderSystem from '../systems/SpriteLoaderSystem';
import AISystem from '../systems/AISystem';
import CollisionSystem from '../systems/CollisionSystem';
import DamageSystem from '../systems/DamageSystem';
import ExperienceSystem from '../systems/ExpirienceSystem';
import PlayerProgressionSystem from '../systems/PlayerProgressionSystem';
import EffectSystem from '../systems/EffectSystem';
import ProjectileSystem from '../systems/ProjectileSystem';
import DespawnSystem from '../systems/DespawnSystem';
import EnemyRangedAttackSystem from '../systems/EnemyRangedAttackSystem';
import { createPlayer } from '../enteties/factories/createPlayer';
import { createWorld } from '../enteties/factories/createWorld';
import type { StoreLike } from '../adapters/ReduxAdapter';
import type { RootState } from '@/store/store';
import { SYSTEM_TYPES, SystemType } from '@/types/engine.types';

export function createGameEngine(
  canvas: HTMLCanvasElement,
  opts?: { store?: StoreLike<RootState> }
) {
  if (canvas.width === 0 || canvas.height === 0) {
    const baseWidth = canvas.clientWidth;
    const baseHeight = canvas.clientHeight;

    canvas.width = Math.round(baseWidth);
    canvas.height = Math.round(baseHeight);
  }

  const cameraSystem = new CameraSystem(canvas);
  const spriteLoaderSystem = new SpriteLoaderSystem();
  const renderer = new Renderer(canvas, cameraSystem, spriteLoaderSystem);
  const world = createWorld(renderer);
  const engine = new GameEngine(world);

  const eventBus = engine.eventBus;
  const input = engine.inputManager;
  const worldBounds = world.bounds;

  engine
    .addSystem(new GenerateMapSystem(), SYSTEM_TYPES.generateMap as SystemType)
    .addSystem(
      new SpawnSystem({ eventBus, store: opts?.store }),
      SYSTEM_TYPES.spawn as SystemType
    )
    .addSystem(
      new PlayerControlSystem(input),
      SYSTEM_TYPES.playerControl as SystemType
    )
    .addSystem(new MovementSystem(), SYSTEM_TYPES.movement as SystemType)
    .addSystem(new AnimationSystem(), SYSTEM_TYPES.animation as SystemType)
    .addSystem(new ProjectileSystem(), SYSTEM_TYPES.projectile as SystemType)
    .addSystem(new AISystem(), SYSTEM_TYPES.ai as SystemType)
    .addSystem(
      new EnemyRangedAttackSystem(),
      SYSTEM_TYPES.enemyRangedAttack as SystemType
    )
    .addSystem(new CollisionSystem(), SYSTEM_TYPES.collision as SystemType)
    .addSystem(new DamageSystem(), SYSTEM_TYPES.damage as SystemType)
    .addSystem(
      new ExperienceSystem({ eventBus }),
      SYSTEM_TYPES.experience as SystemType
    )
    .addSystem(
      new PlayerProgressionSystem({ eventBus }),
      SYSTEM_TYPES.progression as SystemType
    )
    .addSystem(new EffectSystem(), SYSTEM_TYPES.effect as SystemType)
    .addSystem(new DespawnSystem(), SYSTEM_TYPES.despawn as SystemType)
    .addSystem(cameraSystem, SYSTEM_TYPES.camera as SystemType)
    .addSystem(spriteLoaderSystem, SYSTEM_TYPES.spriteLoader as SystemType);

  const player = createPlayer(worldBounds.width, worldBounds.height);

  world.addEntity(player);

  return engine;
}
