import {
  COMPONENT_TYPES,
  type DespawnTimerComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types';

class DespawnTimerComponent
  implements IPureDataComponent, DespawnTimerComponentState
{
  type = COMPONENT_TYPES.despawnTimer;
  entity!: IEntity;
  ttl: number;

  constructor({ ttl }: DespawnTimerComponentState) {
    this.ttl = ttl;
  }
}

export default DespawnTimerComponent;
