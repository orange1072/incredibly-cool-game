import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type PlayerControlComponentState,
} from '../../types/engine.types';

const DEFAULT_PLAYER_MOVE_X = 0;
const DEFAULT_PLAYER_MOVE_Y = 0;
const DEFAULT_PLAYER_SHOOTING = false;

class PlayerControlComponent
  implements IPureDataComponent, Required<PlayerControlComponentState>
{
  type = COMPONENT_TYPES.playerControl;
  entity!: IEntity;
  moveX: number;
  moveY: number;
  shooting: boolean;

  constructor({
    moveX = DEFAULT_PLAYER_MOVE_X,
    moveY = DEFAULT_PLAYER_MOVE_Y,
    shooting = DEFAULT_PLAYER_SHOOTING,
  }: PlayerControlComponentState = {}) {
    this.moveX = moveX;
    this.moveY = moveY;
    this.shooting = shooting;
  }
}

export default PlayerControlComponent;
