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
  public isBlocking: boolean;
  public speedReducing: number;
  public damaging: number;

  constructor({ width, height, kind }: ObstacleComponentState) {
    const preset = OBSTACLE_PRESETS[kind];
    this.width = width;
    this.height = height;
    this.kind = kind;
    this.isBlocking = preset.isBlocking;
    this.speedReducing = preset.speedReducing;
    this.damaging = preset.damaging;
  }
}

export default ObstacleComponent;
