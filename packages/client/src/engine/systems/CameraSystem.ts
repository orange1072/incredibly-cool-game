import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import World from '../core/World';
import worldSettings from '../settings/world-settings/world';
import { clamp, computeCameraSmoothing, screenFollows } from './helpers/camera';
import { createFrustum, type RenderFrustum } from './helpers/frustum';
import { PositionComponent } from '../components';
import { CAMERA_PADDING } from './consts/camera';

export interface CameraState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  visibleWidth: number;
  visibleHeight: number;
  frustum: RenderFrustum;
}

class CameraSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.camera as SystemType;
  private state: CameraState;

  constructor(private canvas: HTMLCanvasElement) {
    const visibleWidth = canvas.width / worldSettings.zoom;
    const visibleHeight = canvas.height / worldSettings.zoom;
    this.state = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      visibleWidth,
      visibleHeight,
      frustum: createFrustum(0, 0, visibleWidth, visibleHeight, CAMERA_PADDING),
    };
  }

  update(world: World, dt: number) {
    const { width, height } = this.canvas;
    const bounds =
      typeof world.bounds === 'function' ? world.bounds : { width, height };

    const visibleWidth = width / worldSettings.zoom;
    const visibleHeight = height / worldSettings.zoom;

    const maxCameraX = Math.max(0, bounds.width - visibleWidth);
    const maxCameraY = Math.max(0, bounds.height - visibleHeight);
    const smoothing = computeCameraSmoothing(
      worldSettings.smoothing,
      Math.max(0, dt)
    );

    let { x: cameraX, y: cameraY } = this.state;
    let cameraTargetX = this.state.targetX;
    let cameraTargetY = this.state.targetY;

    const player = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.position
    )[0];

    if (player) {
      const playerPos = player.getComponent<PositionComponent>(
        COMPONENT_TYPES.position
      );
      if (playerPos) {
        cameraTargetX = clamp(playerPos.x - visibleWidth / 2, 0, maxCameraX);
        cameraTargetY = clamp(playerPos.y - visibleHeight / 2, 0, maxCameraY);
        cameraX = screenFollows(cameraX, cameraTargetX, smoothing);
        cameraY = screenFollows(cameraY, cameraTargetY, smoothing);
      }
    } else {
      cameraX = clamp(cameraX, 0, maxCameraX);
      cameraY = clamp(cameraY, 0, maxCameraY);
      cameraTargetX = cameraX;
      cameraTargetY = cameraY;
    }

    this.state = {
      x: cameraX,
      y: cameraY,
      targetX: cameraTargetX,
      targetY: cameraTargetY,
      visibleWidth,
      visibleHeight,
      frustum: createFrustum(
        cameraX,
        cameraY,
        visibleWidth,
        visibleHeight,
        CAMERA_PADDING
      ),
    };
  }

  getState(): CameraState {
    return this.state;
  }
}

export default CameraSystem;
