import {
  COMPONENT_TYPES,
  type CollisionComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types'

class CollisionComponent
  implements IPureDataComponent, CollisionComponentState
{
  type = COMPONENT_TYPES.collision
  entity!: IEntity
  radius: number

  constructor({ radius }: CollisionComponentState) {
    this.radius = radius
  }
}

export default CollisionComponent
