import {
  COMPONENT_TYPES,
  type EnemyProfileComponentState,
  type IEntity,
  type IPureDataComponent,
} from '../../types/engine.types';

class EnemyProfileComponent
  implements IPureDataComponent, EnemyProfileComponentState
{
  type = COMPONENT_TYPES.enemyProfile;
  entity!: IEntity;
  variantId: string;
  displayName: string;
  description: string;
  tags: string[];
  abilities: string[];
  spawn: EnemyProfileComponentState['spawn'];

  constructor({
    variantId,
    displayName,
    description,
    tags,
    abilities,
    spawn,
  }: EnemyProfileComponentState) {
    this.variantId = variantId;
    this.displayName = displayName;
    this.description = description;
    this.tags = [...tags];
    this.abilities = [...abilities];
    this.spawn = { ...spawn };
  }
}

export default EnemyProfileComponent;
