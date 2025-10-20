import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type VelocityComponentState,
} from '../../types/engine.types';

class VelocityComponent implements IPureDataComponent, VelocityComponentState {
  type = COMPONENT_TYPES.velocity;
  entity!: IEntity;
  dx: number;
  dy: number;

  constructor({ dx, dy }: VelocityComponentState) {
    this.dx = dx;
    this.dy = dy;
  }
}

export default VelocityComponent;
