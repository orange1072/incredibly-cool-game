import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type SpriteComponentState,
} from '../../types/engine.types'

const DEFAULT_SPRITE_SCALE = 1
const DEFAULT_SPRITE_FRAME = 0
const DEFAULT_SPRITE_FRAME_DURATION = 100
const DEFAULT_SPRITE_LOOP = true
const DEFAULT_SPRITE_ALPHA = 1
const DEFAULT_SPRITE_Z_INDEX = 0
const DEFAULT_SPRITE_COLUMNS = 1
const DEFAULT_SPRITE_ROWS = 1
const DEFAULT_SPRITE_DIRECTION_ROW = 2
const DEFAULT_SPRITE_ANIMATION_TIMER = 0
const DEFAULT_SPRITE_PADDING_X = 0
const DEFAULT_SPRITE_PADDING_Y = 0

class SpriteComponent implements IPureDataComponent, SpriteComponentState {
  type = COMPONENT_TYPES.sprite
  entity!: IEntity
  name: string
  width: number
  height: number
  scale: number
  frame: number
  frameDuration: number
  loop: boolean
  alpha: number
  zIndex: number
  source?: string
  columns: number
  rows: number
  directionRow: number
  animationTimer: number
  padding: { x: number; y: number }

  constructor({
    name,
    width,
    height,
    scale = DEFAULT_SPRITE_SCALE,
    frame = DEFAULT_SPRITE_FRAME,
    frameDuration = DEFAULT_SPRITE_FRAME_DURATION,
    loop = DEFAULT_SPRITE_LOOP,
    alpha = DEFAULT_SPRITE_ALPHA,
    zIndex = DEFAULT_SPRITE_Z_INDEX,
    source,
    columns = DEFAULT_SPRITE_COLUMNS,
    rows = DEFAULT_SPRITE_ROWS,
    directionRow = DEFAULT_SPRITE_DIRECTION_ROW,
    padding,
  }: SpriteComponentState) {
    this.name = name
    this.width = width
    this.height = height
    this.scale = scale ?? DEFAULT_SPRITE_SCALE
    this.frame = frame
    this.frameDuration = frameDuration
    this.loop = loop
    this.alpha = alpha
    this.zIndex = zIndex
    this.source = source
    this.columns = Math.max(1, columns)
    this.rows = Math.max(1, rows)
    this.directionRow = Math.min(this.rows - 1, Math.max(0, directionRow))
    this.animationTimer = DEFAULT_SPRITE_ANIMATION_TIMER
    this.padding = {
      x: padding?.x ?? DEFAULT_SPRITE_PADDING_X,
      y: padding?.y ?? DEFAULT_SPRITE_PADDING_Y,
    }
  }
}

export default SpriteComponent
