import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type HealthComponentState,
} from '../../types/engine.types';

class HealthComponent implements IPureDataComponent, HealthComponentState {
  type = COMPONENT_TYPES.health;
  entity!: IEntity;
  hp: number;
  maxHp: number;

  constructor({ hp, maxHp }: HealthComponentState) {
    this.hp = hp;
    this.maxHp = maxHp;
  }
}

export default HealthComponent;
