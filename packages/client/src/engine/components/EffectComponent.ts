import {
  COMPONENT_TYPES,
  type EffectComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types'
import type { EffectEntry } from '../../types/component.types'

const DEFAULT_EFFECTS: EffectEntry[] = []

class EffectComponent implements IPureDataComponent {
  type = COMPONENT_TYPES.effect
  entity!: IEntity
  effects: EffectEntry[]

  constructor({ effects }: EffectComponentState = {}) {
    const resolvedEffects = effects ?? DEFAULT_EFFECTS
    this.effects =
      resolvedEffects === DEFAULT_EFFECTS
        ? [...DEFAULT_EFFECTS]
        : resolvedEffects
  }
}

export default EffectComponent
