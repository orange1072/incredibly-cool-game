import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type ObstacleComponentState,
} from '../../types/engine.types';
import OBSTACLE_PRESETS from '../settings/obstacles-settings/obstacles';

export type ObstacleKind = ObstacleComponentState['kind'];

class ObstacleComponent implements IPureDataComponent, ObstacleComponentState {
  type = COMPONENT_TYPES.obstacle;
  entity!: IEntity;
  width: number;
  height: number;
  kind: ObstacleKind;
  public isBlocking: boolean = false;
  public speedReducing: number;
  public damaging: number;

  constructor({ width, height, kind }: ObstacleComponentState) {
    const fallbackPreset = {
      isBlocking: false,
      speedReducing: 0,
      damaging: 0,
      isBig: false,
    };
    const preset = OBSTACLE_PRESETS[kind];

    if (!preset) {
      console.warn(`Obstacle preset not found for kind: ${kind}`);
    }

    const obstaclePreset = preset ?? fallbackPreset;
    this.width = width;
    this.height = height;
    this.kind = kind;
    this.isBlocking = obstaclePreset.isBlocking ?? false;
    this.speedReducing = obstaclePreset.speedReducing;
    this.damaging = obstaclePreset.damaging;
  }
}

export default ObstacleComponent;
