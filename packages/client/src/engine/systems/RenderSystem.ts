/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PositionComponent,
  SpriteComponent,
  EnemyComponent,
  ObstacleComponent,
  PlayerControlComponent,
  HealthComponent,
  ProjectileComponent,
} from '../components';
import Entity from '../core/Entity';
import World from '../core/World';
import { regularZombie } from '../settings/enemy-settings/zombie';
import { player } from '../settings/player-settings/player';
import worldSettings from '../settings/world-settings/world';
import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import { resetCanvas } from './helpers/canvas';
import { buildRenderQueue } from './helpers/renderQueue';
import { getDamageRect, getHealthBarRect } from './helpers/healthBar';
import CameraSystem from './CameraSystem';
import SpriteLoaderSystem from './SpriteLoaderSystem';
import {
  DEFAULT_ENTITY_FILL_COLOR,
  DEFAULT_SCALE,
  HEALTH_BAR_BACKGROUND,
  HEALTH_BAR_HEIGHT,
  HEALTH_BAR_OFFSET,
  HEALTH_BAR_STROKE,
  HEALTH_COLOR_HIGH,
  HEALTH_COLOR_LOW,
  HEALTH_COLOR_MEDIUM,
  HEALTH_HIGH_THRESHOLD,
  HEALTH_MEDIUM_THRESHOLD,
  MIN_COLUMNS,
  MIN_RENDER_SIZE,
  MIN_ROWS,
  MIN_SOURCE_SIZE,
  OBSTACLE_FILL_COLOR,
  ZERO_FRAMES,
} from './consts/render';
import LootComponent from '../components/LootComponent';
import { PROJECTILE_RADIUS } from './consts/player-control';

class RendererSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.render as SystemType;
  private ctx: CanvasRenderingContext2D;
  private elapsedTime = 0;

  constructor(
    canvas: HTMLCanvasElement,
    private cameraSystem: CameraSystem,
    private spriteLoader: SpriteLoaderSystem
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not supported');
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in this.ctx) {
      this.ctx.imageSmoothingQuality = 'high';
    }
  }

  update(_world: World, dt: number) {
    this.elapsedTime = (this.elapsedTime + dt) % 1000;
  }

  render(world: World) {
    const cameraState = this.cameraSystem.getState();
    const renderQueue = buildRenderQueue(world, cameraState.frustum);
    const { width, height } = this.ctx.canvas;

    resetCanvas(this.ctx);

    this.ctx.fillStyle = worldSettings.tileGrid.bg;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.save();
    this.ctx.scale(worldSettings.zoom, worldSettings.zoom);
    this.ctx.translate(-cameraState.x, -cameraState.y);
    this.drawEntities(renderQueue);

    this.ctx.restore();
  }

  private drawEntities(entities: Entity[]) {
    for (const e of entities) {
      const pos = e.getComponent<PositionComponent>(COMPONENT_TYPES.position);
      if (!pos) continue;

      const sprite = e.getComponent<SpriteComponent>(COMPONENT_TYPES.sprite);
      const isEnemy = e.getComponent<EnemyComponent>(COMPONENT_TYPES.enemy);
      const isLoot = e.getComponent<LootComponent>(COMPONENT_TYPES.loot);
      const isPlayer = e.getComponent<PlayerControlComponent>(
        COMPONENT_TYPES.playerControl
      );
      const obstacle = e.getComponent<ObstacleComponent>(
        COMPONENT_TYPES.obstacle
      );
      const health = e.getComponent<HealthComponent>(COMPONENT_TYPES.health);
      const projectile = e.getComponent<ProjectileComponent>(
        COMPONENT_TYPES.projectile
      );

      if (projectile) {
        this.drawProjectile(pos);
        continue;
      }

      if (isLoot) {
        this.drawLoot(pos);
        continue;
      }

      let renderedWidth =
        sprite && sprite.source ? this.drawSprite(sprite, pos) : 0;

      if (renderedWidth === 0) {
        if (sprite?.defaultColor) {
          this.ctx.fillStyle = sprite.defaultColor;
        } else if (isPlayer) {
          this.ctx.fillStyle = player.skin.color;
        } else if (isEnemy) {
          this.ctx.fillStyle = regularZombie.skin.color;
        } else if (obstacle) {
          this.ctx.fillStyle = OBSTACLE_FILL_COLOR;
        } else {
          this.ctx.fillStyle = DEFAULT_ENTITY_FILL_COLOR;
        }

        const size = sprite
          ? Math.max(sprite.width * worldSettings.zoom, MIN_RENDER_SIZE)
          : MIN_RENDER_SIZE;
        this.ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
        renderedWidth = size;
      }

      if (health) {
        this.drawHealthBar(
          pos.x,
          pos.y - renderedWidth / 2 - HEALTH_BAR_OFFSET,
          renderedWidth,
          health
        );
      }
    }
  }

  private drawProjectile(position: PositionComponent) {
    this.ctx.fillStyle = '#e6eb8cff';
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, PROJECTILE_RADIUS, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawLoot(position: PositionComponent) {
    const baseRadius = PROJECTILE_RADIUS * 1.15;
    const pulseAmplitude = PROJECTILE_RADIUS * 0.85;
    const pulse = (Math.sin(this.elapsedTime * 4) + 1) * 0.5;
    const radius = baseRadius + pulseAmplitude * pulse;
    const glowRadius = radius * 1.75;

    const glow = this.ctx.createRadialGradient(
      position.x,
      position.y,
      Math.max(radius * 0.3, 1),
      position.x,
      position.y,
      glowRadius
    );

    glow.addColorStop(0, 'rgba(210, 200, 255, 0.9)');
    glow.addColorStop(0.55, 'rgba(168, 147, 255, 0.55)');
    glow.addColorStop(1, 'rgba(129, 107, 239, 0)');

    this.ctx.fillStyle = glow;
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, glowRadius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(190, 173, 255, 0.95)';
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius * 0.45, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawSprite(
    sprite: SpriteComponent,
    position: PositionComponent
  ): number {
    const source = sprite.source;
    if (!source) return 0;

    const image = this.spriteLoader.getImage(source);
    if (
      !image ||
      !image.complete ||
      image.naturalWidth === 0 ||
      image.naturalHeight === 0
    ) {
      return 0;
    }

    return this.drawSpriteFrame(image, sprite, position);
  }

  private drawSpriteFrame(
    image: HTMLImageElement,
    sprite: SpriteComponent,
    position: PositionComponent
  ): number {
    const frameWidth = sprite.width;
    const frameHeight = sprite.height;
    const columns = Math.max(MIN_COLUMNS, sprite.columns);
    const rows = Math.max(MIN_ROWS, sprite.rows);
    const currentFrame = Math.min(
      columns - 1,
      Math.max(ZERO_FRAMES, Math.floor(sprite.frame))
    );
    const currentRow = Math.min(
      rows - 1,
      Math.max(ZERO_FRAMES, sprite.directionRow)
    );
    const baseScale = sprite.scale ?? DEFAULT_SCALE;
    const paddingX = Math.min(sprite.padding.x, frameWidth / 2);
    const paddingY = Math.min(sprite.padding.y, frameHeight / 2);
    const sourceX = currentFrame * frameWidth + paddingX;
    const sourceY = currentRow * frameHeight + paddingY;
    const sourceWidth = Math.max(MIN_SOURCE_SIZE, frameWidth - paddingX * 2);
    const sourceHeight = Math.max(MIN_SOURCE_SIZE, frameHeight - paddingY * 2);
    const destWidth = sourceWidth * baseScale;
    const destHeight = sourceHeight * baseScale;
    const drawX = position.x - destWidth / 2;
    const drawY = position.y - destHeight / 2;

    const previousAlpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = sprite.alpha;

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
    );

    this.ctx.globalAlpha = previousAlpha;

    return destWidth;
  }

  private getHealthBar(ratio: number) {
    if (ratio > HEALTH_HIGH_THRESHOLD) return HEALTH_COLOR_HIGH;
    if (ratio > HEALTH_MEDIUM_THRESHOLD) return HEALTH_COLOR_MEDIUM;
    return HEALTH_COLOR_LOW;
  }

  private drawHealthBar(
    centerX: number,
    topY: number,
    width: number,
    health: HealthComponent
  ) {
    const barWidth = Math.max(width, 18);
    const barHeight = HEALTH_BAR_HEIGHT;
    const ratio = Math.max(0, Math.min(1, health.hp / health.maxHp));

    this.ctx.fillStyle = HEALTH_BAR_BACKGROUND;

    const [fullRectX, fullRectY, fullRectWidth, fullRectHeight] =
      getHealthBarRect(centerX, topY, barWidth, barHeight);
    const damageRectWidth = getDamageRect(barWidth, ratio);

    this.ctx.fillRect(fullRectX, fullRectY, fullRectWidth, fullRectHeight);

    this.ctx.fillStyle = this.getHealthBar(ratio);

    this.ctx.fillRect(fullRectX, fullRectY, damageRectWidth, fullRectHeight);

    this.ctx.strokeStyle = HEALTH_BAR_STROKE;
    // this.ctx.lineWidth = 1 / worldSettings.zoom
    this.ctx.strokeRect(fullRectX, fullRectY, fullRectWidth, fullRectHeight);
  }
}

export default RendererSystem;
