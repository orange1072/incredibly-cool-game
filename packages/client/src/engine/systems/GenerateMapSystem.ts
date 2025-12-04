import { ISystem, SYSTEM_TYPES, SystemType } from '../../types/engine.types';
import World from '../core/World';
import {
  PositionComponent,
  ObstacleComponent,
  SpriteComponent,
  SpawnPointComponent,
  CollisionComponent,
} from '../components';
import Entity from '../core/Entity';
import Logger from '../infrastructure/Logger';
import {
  BORDER_INDEX,
  DEFAULT_CELL_SIZE,
  DEFAULT_MAP_HEIGHT,
  DEFAULT_MAP_WIDTH,
  ENEMY_SPAWN_COUNT,
  ENEMY_SPAWN_RADIUS,
  OBSTACLE_COUNT,
  OBSTACLE_PADDING,
  OBSTACLE_SIZE,
  PLAYER_SPAWN_RADIUS,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y,
  SPAWN_PADDING,
} from './consts/generate-map';
import OBSTACLE_PRESETS, {
  ObstaclePreset,
  ObstaclePresetName,
  OBSTACLES,
} from '../settings/obstacles-settings/obstacles';

class GenerateMapSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.generateMap as SystemType;
  private logger = new Logger('GenerateMapSystem', 'info');
  private mapWidth = DEFAULT_MAP_WIDTH;
  private mapHeight = DEFAULT_MAP_HEIGHT;
  private cellSize = DEFAULT_CELL_SIZE;

  initialize(world: World) {
    const bounds = world.bounds;
    if (bounds) {
      this.mapWidth = bounds.width;
      this.mapHeight = bounds.height;
    }

    this.logger.info('🗺️  Generating map...');

    this.generateBorderWallsForMap(world);

    this.generateObstacles(world, OBSTACLE_COUNT);

    this.generateSpawnPoints(world);

    this.logger.info('✅ Map generated successfully');
  }

  update() {
    return;
  }

  private generateBorderWallsForMap(world: World) {
    const cols = Math.floor(this.mapWidth / this.cellSize);
    const rows = Math.floor(this.mapHeight / this.cellSize);

    for (let i = 0; i < cols; i++) {
      for (const j of [BORDER_INDEX, rows - 1]) {
        const wall = this.createObstacle(
          i * this.cellSize,
          j * this.cellSize,
          'worldBorder',
          OBSTACLE_PRESETS['worldBorder']
        );
        world.addEntity(wall);
      }
    }

    for (let j = 0; j < rows; j++) {
      for (const i of [BORDER_INDEX, cols - 1]) {
        const wall = this.createObstacle(
          i * this.cellSize,
          j * this.cellSize,
          'worldBorder',
          OBSTACLE_PRESETS['worldBorder']
        );
        world.addEntity(wall);
      }
    }
  }

  private generateObstacles(world: World, count: number) {
    for (let i = 0; i < count; i++) {
      const x =
        Math.random() * (this.mapWidth - SPAWN_PADDING) + OBSTACLE_PADDING;
      const y =
        Math.random() * (this.mapHeight - SPAWN_PADDING) + OBSTACLE_PADDING;
      const obstacle = this.createRandomObstacle(x, y);
      world.addEntity(obstacle);
    }
  }

  private generateSpawnPoints(world: World) {
    const playerSpawn = new Entity();
    playerSpawn
      .addComponent(
        new PositionComponent({ x: PLAYER_SPAWN_X, y: PLAYER_SPAWN_Y })
      )
      .addComponent(
        new SpawnPointComponent({
          spawnType: 'player',
          radius: PLAYER_SPAWN_RADIUS,
        })
      );
    world.addEntity(playerSpawn);

    for (let i = 0; i < ENEMY_SPAWN_COUNT; i++) {
      const x = Math.random() * this.mapWidth;
      const y = Math.random() * this.mapHeight;
      const enemySpawn = new Entity();
      enemySpawn.addComponent(new PositionComponent({ x, y })).addComponent(
        new SpawnPointComponent({
          spawnType: 'enemy',
          radius: ENEMY_SPAWN_RADIUS,
        })
      );
      world.addEntity(enemySpawn);
    }
  }

  private createRandomObstacle(x: number, y: number) {
    const kind = OBSTACLES[
      Math.floor(Math.random() * OBSTACLES.length)
    ] as ObstaclePresetName;
    const obstacle = OBSTACLE_PRESETS[kind];
    return this.createObstacle(x, y, kind, obstacle);
  }

  private createObstacle(
    x: number,
    y: number,
    kind: ObstaclePresetName,
    obstacle: ObstaclePreset
  ) {
    const e = new Entity();
    const width = obstacle.isBig ? OBSTACLE_SIZE : OBSTACLE_SIZE / 2;
    const height = obstacle.isBig ? OBSTACLE_SIZE * 2 : OBSTACLE_SIZE;
    const spriteOptions =
      kind === 'worldBorder'
        ? {
            name: kind,
            width,
            height,
            source: undefined,
            defaultColor: 'rgba(0,0,0,0)',
          }
        : { name: kind, width, height, source: obstacle.sprite ?? kind };

    e.addComponent(new PositionComponent({ x, y }))
      .addComponent(new ObstacleComponent({ width, height, kind }))
      .addComponent(
        new CollisionComponent({
          radius: Math.max(width, height) / 7.5,
          offsetY: height / 4,
        })
      )
      .addComponent(new SpriteComponent(spriteOptions));
    return e;
  }
}

export default GenerateMapSystem;
