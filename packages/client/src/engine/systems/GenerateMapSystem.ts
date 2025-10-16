import { ISystem } from '../../types/engine.types'
import World from '../core/World'
import {
  PositionComponent,
  ObstacleComponent,
  SpriteComponent,
  SpawnPointComponent,
  CollisionComponent,
  type ObstacleKind,
} from '../core/Components'
import Entity from '../core/Entity'
import Logger from '../infrastructure/Logger'

class GenerateMapSystem implements ISystem {
  private logger = new Logger('GenerateMapSystem', 'info')
  private mapWidth = 800
  private mapHeight = 600
  private cellSize = 64

  initialize(world: World) {
    const bounds = world.getBounds?.()
    if (bounds) {
      this.mapWidth = bounds.width
      this.mapHeight = bounds.height
    }

    this.logger.info('🗺️  Generating map...')

    this.generateWalls(world)

    this.generateObstacles(world, 10)

    this.generateSpawnPoints(world)

    this.logger.info('✅ Map generated successfully')
  }

  update() {
    return
  }

  private generateWalls(world: World) {
    const cols = Math.floor(this.mapWidth / this.cellSize)
    const rows = Math.floor(this.mapHeight / this.cellSize)

    for (let i = 0; i < cols; i++) {
      for (const j of [0, rows - 1]) {
        const wall = this.createObstacle(
          i * this.cellSize,
          j * this.cellSize,
          'wall'
        )
        world.addEntity(wall)
      }
    }

    for (let j = 0; j < rows; j++) {
      for (const i of [0, cols - 1]) {
        const wall = this.createObstacle(
          i * this.cellSize,
          j * this.cellSize,
          'wall'
        )
        world.addEntity(wall)
      }
    }
  }

  private generateObstacles(world: World, count: number) {
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (this.mapWidth - 100) + 50
      const y = Math.random() * (this.mapHeight - 100) + 50
      const rock = this.createObstacle(x, y, 'rock')
      world.addEntity(rock)
    }
  }

  private generateSpawnPoints(world: World) {
    const playerSpawn = new Entity()
    playerSpawn.addComponent(new PositionComponent({ x: 400, y: 300 }))
    playerSpawn.addComponent(
      new SpawnPointComponent({ spawnType: 'player', radius: 15 })
    )
    world.addEntity(playerSpawn)

    for (let i = 0; i < 5; i++) {
      const x = Math.random() * this.mapWidth
      const y = Math.random() * this.mapHeight
      const enemySpawn = new Entity()
      enemySpawn.addComponent(new PositionComponent({ x, y }))
      enemySpawn.addComponent(
        new SpawnPointComponent({ spawnType: 'enemy', radius: 20 })
      )
      world.addEntity(enemySpawn)
    }
  }

  private createObstacle(x: number, y: number, kind: ObstacleKind) {
    const e = new Entity()
    const width = 64
    const height = 64
    e.addComponent(new PositionComponent({ x, y }))
    e.addComponent(new ObstacleComponent({ width, height, kind }))
    e.addComponent(
      new CollisionComponent({ radius: Math.max(width, height) / 2 })
    )
    e.addComponent(
      new SpriteComponent({ name: kind, width, height, source: kind })
    )
    return e
  }
}

export default GenerateMapSystem
