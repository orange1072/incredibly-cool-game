import {
  COMPONENT_TYPES,
  type CollisionComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types';

class CollisionComponent
  implements IPureDataComponent, CollisionComponentState
{
  type = COMPONENT_TYPES.collision;
  entity!: IEntity;
  radius: number;
  offsetX: number;
  offsetY: number;

  constructor({ radius, offsetX = 0, offsetY = 0 }: CollisionComponentState) {
    this.radius = radius;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
}

export default CollisionComponent;
