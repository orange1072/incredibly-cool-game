import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  LootType,
  LootComponentState,
} from '../../types/engine.types';

class LootComponent implements IPureDataComponent, LootComponentState {
  type = COMPONENT_TYPES.loot;
  entity!: IEntity;
  lootType: LootType;
  amount: number;

  constructor({ lootType, amount }: LootComponentState) {
    this.lootType = lootType;
    this.amount = amount;
  }
}

export default LootComponent;
