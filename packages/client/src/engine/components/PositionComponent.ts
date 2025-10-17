import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type PositionComponentState,
} from '../../types/engine.types'

class PositionComponent implements IPureDataComponent, PositionComponentState {
  type = COMPONENT_TYPES.position
  entity!: IEntity
  x: number
  y: number

  constructor({ x, y }: PositionComponentState) {
    this.x = x
    this.y = y
  }
}

export default PositionComponent
