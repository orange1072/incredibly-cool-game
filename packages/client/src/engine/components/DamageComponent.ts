import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type DamageComponentState,
} from '../../types/engine.types';

class DamageComponent implements IPureDataComponent, DamageComponentState {
  type = COMPONENT_TYPES.damage;
  entity!: IEntity;
  amount: number;
  sourceId?: string;

  constructor({ amount, sourceId }: DamageComponentState) {
    this.amount = amount;
    this.sourceId = sourceId;
  }
}

export default DamageComponent;
