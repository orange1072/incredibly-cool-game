import {
  COMPONENT_TYPES,
  type ExperienceComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types'

const DEFAULT_EXPERIENCE_XP = 0
const DEFAULT_EXPERIENCE_LEVEL = 1
const DEFAULT_EXPERIENCE_XP_TO_NEXT = 100

class ExperienceComponent
  implements IPureDataComponent, Required<ExperienceComponentState>
{
  type = COMPONENT_TYPES.experience
  entity!: IEntity
  xp: number
  level: number
  xpToNext: number

  constructor({
    xp = DEFAULT_EXPERIENCE_XP,
    level = DEFAULT_EXPERIENCE_LEVEL,
    xpToNext = DEFAULT_EXPERIENCE_XP_TO_NEXT,
  }: ExperienceComponentState = {}) {
    this.xp = xp
    this.level = level
    this.xpToNext = xpToNext
  }
}

export default ExperienceComponent
