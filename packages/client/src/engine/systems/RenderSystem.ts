import {
  PositionComponent,
  SpriteComponent,
  EnemyComponent,
  ObstacleComponent,
  PlayerControlComponent,
  HealthComponent,
  VelocityComponent,
} from '../components'
import World from '../core/World'
import { regularZombie } from '../settings/enemy-settings/zombie'
import { player } from '../settings/player-settings/player'
import worldSettings from '../settings/world-settings/world'
import { COMPONENT_TYPES } from '../../types/engine.types'
import { resetCanvas } from './helpers/canvas'

const CAMERA_PADDING = 16
const MIN_RENDER_SIZE = 12
const HEALTH_BAR_OFFSET = 6
const DEFAULT_SCALE = 1
const MIN_FRAME_DURATION = 0.016
const DEFAULT_FRAME_DURATION_MS = 100
const MILLISECONDS_IN_SECOND = 1000
const ZERO_FRAMES = 0
const MIN_COLUMNS = 1
const MIN_ROWS = 1
const ZERO_ANIMATION_TIMER = 0
const ZERO_DELTA = 0
const MOVING_THRESHOLD = 1
const MIN_SOURCE_SIZE = 1
const OCTANTS = 8
const OCTANT_RADIANS = Math.PI / 4
const OBSTACLE_FILL_COLOR = 'rgba(120, 130, 140, 0.9)'
const DEFAULT_ENTITY_FILL_COLOR = 'rgba(255, 255, 255, 0.6)'
const HEALTH_HIGH_THRESHOLD = 0.5
const HEALTH_MEDIUM_THRESHOLD = 0.25
const HEALTH_COLOR_HIGH = '#48ff8a'
const HEALTH_COLOR_MEDIUM = '#ffe066'
const HEALTH_COLOR_LOW = '#ff4d6d'
const HEALTH_BAR_BACKGROUND = 'rgba(20, 20, 20, 0.8)'
const HEALTH_BAR_HEIGHT = 4
const HEALTH_BAR_STROKE = 'rgba(0, 0, 0, 0.6)'

class Renderer {
  private ctx: CanvasRenderingContext2D
  private cameraX = 0
  private cameraY = 0
  private imageCache = new Map<string, HTMLImageElement>()
  private lastRenderTime = performance.now()

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not supported')
    this.ctx = ctx
    this.ctx.imageSmoothingEnabled = true
    if ('imageSmoothingQuality' in this.ctx) {
      this.ctx.imageSmoothingQuality = 'high'
    }
  }

  private moveCamera(
    position: PositionComponent,
    maxCameraX: number,
    maxCameraY: number,
    visibleWidth: number,
    visibleHeight: number
  ) {
    const targetX = Math.min(
      Math.max(position.x - visibleWidth / 2, 0),
      maxCameraX
    )
    const targetY = Math.min(
      Math.max(position.y - visibleHeight / 2, 0),
      maxCameraY
    )
    this.cameraX = this.screenFollows(
      this.cameraX,
      targetX,
      worldSettings.smoothing
    )
    this.cameraY = this.screenFollows(
      this.cameraY,
      targetY,
      worldSettings.smoothing
    )
  }

  render(world: World) {
    const { width, height } = this.ctx.canvas
    const bounds = world.getBounds ? world.getBounds() : { width, height }
    const visibleWidth = width / worldSettings.zoom
    const visibleHeight = height / worldSettings.zoom
    const maxCameraX = Math.max(0, bounds.width - visibleWidth)
    const maxCameraY = Math.max(0, bounds.height - visibleHeight)
    const now = performance.now()
    const deltaTime = (now - this.lastRenderTime) / 1000
    this.lastRenderTime = now

    const player = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.position
    )[0]
    if (player) {
      const playerPos = player.getComponent<PositionComponent>(
        COMPONENT_TYPES.position
      )
      if (playerPos) {
        this.moveCamera(
          playerPos,
          maxCameraX,
          maxCameraY,
          visibleWidth,
          visibleHeight
        )
      }
    }

    resetCanvas(this.ctx)

    this.ctx.fillStyle = worldSettings.tileGrid.bg
    this.ctx.fillRect(0, 0, width, height)

    this.ctx.save()
    this.ctx.scale(worldSettings.zoom, worldSettings.zoom)
    this.ctx.translate(-this.cameraX, -this.cameraY)
    this.drawEntities(world, visibleWidth, visibleHeight, deltaTime)

    this.ctx.restore()
  }

  private screenFollows(start: number, end: number, t: number) {
    return start + (end - start) * t
  }

  private drawEntities(
    world: World,
    visibleWidth: number,
    visibleHeight: number,
    deltaTime: number
  ) {
    const padding = CAMERA_PADDING

    const minX = this.cameraX - padding
    const maxX = this.cameraX + visibleWidth + padding
    const minY = this.cameraY - padding
    const maxY = this.cameraY + visibleHeight + padding

    for (const e of world.getEntities()) {
      const pos = e.getComponent<PositionComponent>(COMPONENT_TYPES.position)
      if (!pos) continue
      if (pos.x < minX || pos.x > maxX || pos.y < minY || pos.y > maxY) {
        continue
      }

      const sprite = e.getComponent<SpriteComponent>(COMPONENT_TYPES.sprite)
      const velocity = e.getComponent<VelocityComponent>(
        COMPONENT_TYPES.velocity
      )
      const isEnemy = e.getComponent<EnemyComponent>(COMPONENT_TYPES.enemy)
      const isPlayer = e.getComponent<PlayerControlComponent>(
        COMPONENT_TYPES.playerControl
      )
      const obstacle = e.getComponent<ObstacleComponent>(
        COMPONENT_TYPES.obstacle
      )
      const health = e.getComponent<HealthComponent>(COMPONENT_TYPES.health)

      let renderedWidth =
        sprite && sprite.source
          ? this.drawSprite(sprite, pos, velocity, deltaTime)
          : 0

      if (renderedWidth === 0) {
        if (isPlayer) {
          this.ctx.fillStyle = player.skin.color
        } else if (isEnemy) {
          this.ctx.fillStyle = regularZombie.skin.color
        } else if (obstacle) {
          this.ctx.fillStyle = OBSTACLE_FILL_COLOR
        } else {
          this.ctx.fillStyle = DEFAULT_ENTITY_FILL_COLOR
        }

        const size = sprite
          ? Math.max(sprite.width * worldSettings.zoom, MIN_RENDER_SIZE)
          : MIN_RENDER_SIZE
        this.ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size)
        renderedWidth = size
      }

      if (health) {
        this.drawHealthBar(
          pos.x,
          pos.y - renderedWidth / 2 - HEALTH_BAR_OFFSET,
          renderedWidth,
          health
        )
      }
    }
  }

  private drawSprite(
    sprite: SpriteComponent,
    position: PositionComponent,
    velocity: VelocityComponent | undefined,
    deltaTime: number
  ): number {
    const source = sprite.source
    if (!source) return 0

    const image = this.getImage(source)
    if (
      !image ||
      !image.complete ||
      image.naturalWidth === 0 ||
      image.naturalHeight === 0
    ) {
      return 0
    }

    return this.animateSprite(image, sprite, position, velocity, deltaTime)
  }

  private updateSpriteAnimation(
    sprite: SpriteComponent,
    velocity: VelocityComponent | undefined,
    deltaTime: number
  ) {
    const velX = velocity?.dx ?? ZERO_DELTA
    const velY = velocity?.dy ?? ZERO_DELTA
    const speedSq = velX * velX + velY * velY
    const moving = speedSq > MOVING_THRESHOLD

    if (moving) {
      sprite.directionRow = this.calculateDirection(velX, velY)
      const frameDurationSeconds = Math.max(
        MIN_FRAME_DURATION,
        (sprite.frameDuration ?? DEFAULT_FRAME_DURATION_MS) /
          MILLISECONDS_IN_SECOND
      )
      sprite.animationTimer += deltaTime
      while (sprite.animationTimer >= frameDurationSeconds) {
        sprite.animationTimer -= frameDurationSeconds
        sprite.frame = sprite.loop
          ? (sprite.frame + 1) % Math.max(MIN_COLUMNS, sprite.columns)
          : Math.min(sprite.columns - 1, sprite.frame + 1)
      }
    } else {
      sprite.animationTimer = ZERO_ANIMATION_TIMER
      sprite.frame = ZERO_FRAMES
    }
  }

  private animateSprite(
    image: HTMLImageElement,
    sprite: SpriteComponent,
    position: PositionComponent,
    velocity: VelocityComponent | undefined,
    deltaTime: number
  ): number {
    this.updateSpriteAnimation(sprite, velocity, deltaTime)

    const frameWidth = sprite.width
    const frameHeight = sprite.height
    const columns = Math.max(MIN_COLUMNS, sprite.columns)
    const rows = Math.max(MIN_ROWS, sprite.rows)
    const currentFrame = Math.min(
      columns - 1,
      Math.max(ZERO_FRAMES, Math.floor(sprite.frame))
    )
    const currentRow = Math.min(
      rows - 1,
      Math.max(ZERO_FRAMES, sprite.directionRow)
    )
    const baseScale = sprite.scale ?? DEFAULT_SCALE
    const paddingX = Math.min(sprite.padding.x, frameWidth / 2)
    const paddingY = Math.min(sprite.padding.y, frameHeight / 2)
    const sourceX = currentFrame * frameWidth + paddingX
    const sourceY = currentRow * frameHeight + paddingY
    const sourceWidth = Math.max(MIN_SOURCE_SIZE, frameWidth - paddingX * 2)
    const sourceHeight = Math.max(MIN_SOURCE_SIZE, frameHeight - paddingY * 2)
    const destWidth = sourceWidth * baseScale
    const destHeight = sourceHeight * baseScale
    const drawX = position.x - destWidth / 2
    const drawY = position.y - destHeight / 2

    const previousAlpha = this.ctx.globalAlpha
    this.ctx.globalAlpha = sprite.alpha

    this.ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      drawX,
      drawY,
      destWidth,
      destHeight
    )

    this.ctx.globalAlpha = previousAlpha

    return destWidth
  }

  private calculateDirection(dx: number, dy: number) {
    const angle = Math.atan2(dy, dx)
    const sector = Math.round(angle / OCTANT_RADIANS)
    return (sector + OCTANTS) % OCTANTS
  }

  private getImage(source: string) {
    let image = this.imageCache.get(source)
    if (!image) {
      image = new Image()
      image.src = source
      this.imageCache.set(source, image)
    }
    return image
  }

  private getHealthBar(ratio: number) {
    if (ratio > HEALTH_HIGH_THRESHOLD) return HEALTH_COLOR_HIGH
    if (ratio > HEALTH_MEDIUM_THRESHOLD) return HEALTH_COLOR_MEDIUM
    return HEALTH_COLOR_LOW
  }

  private getHealthBarRect(
    centerX: number,
    topY: number,
    barWidth: number,
    barHeight: number
  ): [number, number, number, number] {
    return [centerX - barWidth / 2, topY - barHeight, barWidth, barHeight]
  }

  private getDamageRect(barWidth: number, ratio: number) {
    return barWidth * ratio
  }

  private drawHealthBar(
    centerX: number,
    topY: number,
    width: number,
    health: HealthComponent
  ) {
    const barWidth = Math.max(width, 18)
    const barHeight = HEALTH_BAR_HEIGHT
    const ratio = Math.max(0, Math.min(1, health.hp / health.maxHp))

    this.ctx.fillStyle = HEALTH_BAR_BACKGROUND

    const [fullRectX, fullRectY, fullRectWidth, fullRectHeight] =
      this.getHealthBarRect(centerX, topY, barWidth, barHeight)
    const damageRectWidth = this.getDamageRect(barWidth, ratio)

    this.ctx.fillRect(fullRectX, fullRectY, fullRectWidth, fullRectHeight)

    this.ctx.fillStyle = this.getHealthBar(ratio)

    this.ctx.fillRect(fullRectX, fullRectY, damageRectWidth, fullRectHeight)

    this.ctx.strokeStyle = HEALTH_BAR_STROKE
    // this.ctx.lineWidth = 1 / worldSettings.zoom
    this.ctx.strokeRect(fullRectX, fullRectY, fullRectWidth, fullRectHeight)
  }
}

export default Renderer
