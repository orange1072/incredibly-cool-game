import Entity from '@/engine/core/Entity';
import { COMPONENT_TYPES, ComponentDataType } from '@/types/engine.types';

// check if entity has specific component, for example is it Player, or Enemy, or Obstacle

function isProperEntity(entity: Entity, type: ComponentDataType) {
  return entity.hasComponent(type);
}

// takes array of entities and check if any of them has specific property. for example we pass some enemies and player, and return player.
//  we also can return first index of enemy, or specific enemy with specific component

function getProperEntity(entities: Entity[], type: ComponentDataType) {
  const index = entities.findIndex((item) => {
    return isProperEntity(item, type);
  });

  return index === -1 ? null : entities[index];
}

// this is specific case when we take two entities and return checks for each entity, should be refactored later

function checkWhoIsEnemy(
  a: Entity,
  b: Entity
): {
  aIsEnemy: boolean;
  bIsEnemy: boolean;
  aIsPlayer: boolean;
  bIsPlayer: boolean;
} {
  const playerEntity = getProperEntity([a, b], COMPONENT_TYPES.playerControl);
  const aIsEnemy = isProperEntity(a, COMPONENT_TYPES.enemy);
  const bIsEnemy = isProperEntity(b, COMPONENT_TYPES.enemy);
  const aIsPlayer = playerEntity === a;
  const bIsPlayer = playerEntity === b;

  return {
    aIsEnemy,
    bIsEnemy,
    aIsPlayer,
    bIsPlayer,
  };
}

export { checkWhoIsEnemy, getProperEntity, isProperEntity };
