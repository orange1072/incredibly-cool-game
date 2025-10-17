import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type SpawnPointComponentState,
} from '../../types/engine.types'

const DEFAULT_SPAWN_POINT_TYPE: NonNullable<
  SpawnPointComponentState['spawnType']
> = 'enemy'
const DEFAULT_SPAWN_POINT_RADIUS = 20
const DEFAULT_SPAWN_POINT_INTERVAL = 5
const DEFAULT_SPAWN_POINT_MAX_ENTITIES = 10
const DEFAULT_SPAWN_POINT_AUTO_SPAWN = true

class SpawnPointComponent
  implements IPureDataComponent, Required<SpawnPointComponentState>
{
  type = COMPONENT_TYPES.spawnPoint
  entity!: IEntity
  _timer: number | undefined
  spawnType: NonNullable<SpawnPointComponentState['spawnType']>
  radius: number
  interval: number
  maxEntities: number
  autoSpawn: boolean

  constructor({
    spawnType = DEFAULT_SPAWN_POINT_TYPE,
    radius = DEFAULT_SPAWN_POINT_RADIUS,
    interval = DEFAULT_SPAWN_POINT_INTERVAL,
    maxEntities = DEFAULT_SPAWN_POINT_MAX_ENTITIES,
    autoSpawn = DEFAULT_SPAWN_POINT_AUTO_SPAWN,
  }: SpawnPointComponentState = {}) {
    this.spawnType = spawnType
    this.radius = radius
    this.interval = interval
    this.maxEntities = maxEntities
    this.autoSpawn = autoSpawn
  }
}

export default SpawnPointComponent
