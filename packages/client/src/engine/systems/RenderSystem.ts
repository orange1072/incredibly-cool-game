import {
  PositionComponent,
  SpriteComponent,
  EnemyComponent,
  ObstacleComponent,
  PlayerControlComponent,
  HealthComponent,
  VelocityComponent,
} from '../core/Components'
import World from '../core/World'
import { regularZombie } from '../settings/enemy-settings/zombie'
import { player } from '../settings/player-settings/player'
import worldSettings from '../settings/world-settings/world'
import { COMPONENT_TYPES } from '../../types/engine.types'

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

  private movePlayer(
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
        this.movePlayer(
          playerPos,
          maxCameraX,
          maxCameraY,
          visibleWidth,
          visibleHeight
        )
      }
    }

    this.ctx.clearRect(0, 0, width, height)

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
    const padding = 16

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
          this.ctx.fillStyle = 'rgba(120, 130, 140, 0.9)'
        } else {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        }

        const size = sprite
          ? Math.max(sprite.width * worldSettings.zoom, 12)
          : 12
        this.ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size)
        renderedWidth = size
      }

      if (health) {
        this.drawHealthBar(
          pos.x,
          pos.y - renderedWidth / 2 - 6,
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

    this.updateSpriteAnimation(sprite, velocity, deltaTime)

    const frameWidth = sprite.width
    const frameHeight = sprite.height
    const columns = Math.max(1, sprite.columns)
    const rows = Math.max(1, sprite.rows)
    const currentFrame = Math.min(
      columns - 1,
      Math.max(0, Math.floor(sprite.frame))
    )
    const currentRow = Math.min(rows - 1, Math.max(0, sprite.directionRow))
    const baseScale = sprite.scale
    const effectiveScale = baseScale
    const destWidth = frameWidth * effectiveScale
    const destHeight = frameHeight * effectiveScale
    const drawX = position.x - destWidth / 2
    const drawY = position.y - destHeight / 2

    const previousAlpha = this.ctx.globalAlpha
    this.ctx.globalAlpha = sprite.alpha

    this.ctx.drawImage(
      image,
      currentFrame * frameWidth,
      currentRow * frameHeight,
      frameWidth,
      frameHeight,
      drawX,
      drawY,
      destWidth,
      destHeight
    )
    this.ctx.globalAlpha = previousAlpha

    return destWidth
  }

  private updateSpriteAnimation(
    sprite: SpriteComponent,
    velocity: VelocityComponent | undefined,
    deltaTime: number
  ) {
    const velX = velocity?.dx ?? 0
    const velY = velocity?.dy ?? 0
    const speedSq = velX * velX + velY * velY
    const moving = speedSq > 1

    if (moving) {
      sprite.directionRow = this.calculateDirection(velX, velY)
      const frameDurationSeconds = Math.max(
        0.016,
        (sprite.frameDuration ?? 100) / 1000
      )
      sprite.animationTimer += deltaTime
      while (sprite.animationTimer >= frameDurationSeconds) {
        sprite.animationTimer -= frameDurationSeconds
        sprite.frame = sprite.loop
          ? (sprite.frame + 1) % Math.max(1, sprite.columns)
          : Math.min(sprite.columns - 1, sprite.frame + 1)
      }
    } else {
      sprite.animationTimer = 0
      sprite.frame = 0
    }
  }

  private calculateDirection(dx: number, dy: number) {
    const angle = Math.atan2(dy, dx)
    const sector = Math.round(angle / (Math.PI / 4))
    return (sector + 8) % 8
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
    return ratio > 0.5 ? '#48ff8a' : ratio > 0.25 ? '#ffe066' : '#ff4d6d'
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
    const barHeight = 4
    const ratio = Math.max(0, Math.min(1, health.hp / health.maxHp))

    this.ctx.fillStyle = 'rgba(20, 20, 20, 0.8)'

    const [fullRectX, fullRectY, fullRectWidth, fullRectHeight] =
      this.getHealthBarRect(centerX, topY, barWidth, barHeight)
    const damageRectWidth = this.getDamageRect(barWidth, ratio)

    this.ctx.fillRect(fullRectX, fullRectY, fullRectWidth, fullRectHeight)

    this.ctx.fillStyle = this.getHealthBar(ratio)

    this.ctx.fillRect(fullRectX, fullRectY, damageRectWidth, fullRectHeight)

    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)'
    // this.ctx.lineWidth = 1 / worldSettings.zoom
    this.ctx.strokeRect(fullRectX, fullRectY, fullRectWidth, fullRectHeight)
  }
}

export default Renderer
