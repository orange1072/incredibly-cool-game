import {
  COMPONENT_TYPES,
  type AIComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types'
import { AI_STATES, type AIState } from '../../types/component.types'

const DEFAULT_AI_STATE = AI_STATES.idle

class AIComponent implements IPureDataComponent {
  type = COMPONENT_TYPES.ai
  entity!: IEntity
  state: AIState

  constructor({ state = DEFAULT_AI_STATE }: AIComponentState = {}) {
    this.state = state
  }
}

export default AIComponent
