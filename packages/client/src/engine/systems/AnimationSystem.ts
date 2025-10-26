import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import { SpriteComponent, VelocityComponent } from '../components';
import World from '../core/World';
import {
  DEFAULT_FRAME_DURATION_MS,
  MILLISECONDS_IN_SECOND,
  MIN_COLUMNS,
  MIN_FRAME_DURATION,
  MOVING_THRESHOLD,
  OCTANTS,
  OCTANT_RADIANS,
  ZERO_ANIMATION_TIMER,
  ZERO_DELTA,
  ZERO_FRAMES,
} from './consts/animation';

class AnimationSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.animation as SystemType;

  update(world: World, dt: number) {
    const deltaTime = Math.max(0, dt);
    const entities = world.query(COMPONENT_TYPES.sprite);

    for (const entity of entities) {
      const sprite = entity.getComponent<SpriteComponent>(
        COMPONENT_TYPES.sprite
      );
      if (!sprite) continue;

      const velocity = entity.getComponent<VelocityComponent>(
        COMPONENT_TYPES.velocity
      );
      this.updateSpriteAnimation(sprite, velocity, deltaTime);
    }
  }

  private updateSpriteAnimation(
    sprite: SpriteComponent,
    velocity: VelocityComponent | undefined,
    deltaTime: number
  ) {
    const velX = velocity?.dx ?? ZERO_DELTA;
    const velY = velocity?.dy ?? ZERO_DELTA;
    const speedSq = velX * velX + velY * velY;
    const moving = speedSq > MOVING_THRESHOLD;

    if (moving) {
      sprite.directionRow = this.calculateDirection(velX, velY);
      const frameDurationSeconds = Math.max(
        MIN_FRAME_DURATION,
        (sprite.frameDuration ?? DEFAULT_FRAME_DURATION_MS) /
          MILLISECONDS_IN_SECOND
      );
      sprite.animationTimer += deltaTime;
      while (sprite.animationTimer >= frameDurationSeconds) {
        sprite.animationTimer -= frameDurationSeconds;
        sprite.frame = sprite.loop
          ? (sprite.frame + 1) % Math.max(MIN_COLUMNS, sprite.columns)
          : Math.min(sprite.columns - 1, sprite.frame + 1);
      }
    } else {
      sprite.animationTimer = ZERO_ANIMATION_TIMER;
      sprite.frame = ZERO_FRAMES;
    }
  }

  private calculateDirection(dx: number, dy: number) {
    const angle = Math.atan2(dy, dx);
    const sector = Math.round(angle / OCTANT_RADIANS);
    return (sector + OCTANTS) % OCTANTS;
  }
}

export default AnimationSystem;
