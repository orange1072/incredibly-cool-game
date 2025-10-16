import Entity from '@/engine/core/Entity'
import { COMPONENT_TYPES, ComponentDataType } from '@/types/engine.types'

function isProperEntity(entity: Entity, type: ComponentDataType) {
  return entity.hasComponent(type)
}

function getProperEntity(entities: Entity[], type: ComponentDataType) {
  const index = entities.findIndex((item) => {
    return isProperEntity(item, type)
  })

  return index === -1 ? null : entities[index]
}

function checkWhoIsEnemy(
  a: Entity,
  b: Entity
): {
  aIsEnemy: boolean
  bIsEnemy: boolean
  aIsPlayer: boolean
  bIsPlayer: boolean
} {
  const playerEntity = getProperEntity([a, b], COMPONENT_TYPES.playerControl)
  const aIsEnemy = isProperEntity(a, COMPONENT_TYPES.enemy)
  const bIsEnemy = isProperEntity(b, COMPONENT_TYPES.enemy)
  const aIsPlayer = playerEntity === a
  const bIsPlayer = playerEntity === b

  return {
    aIsEnemy,
    bIsEnemy,
    aIsPlayer,
    bIsPlayer,
  }
}

export { checkWhoIsEnemy, getProperEntity, isProperEntity }
