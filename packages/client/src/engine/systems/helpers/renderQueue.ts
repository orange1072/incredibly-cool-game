import Entity from '../../core/Entity'
import World from '../../core/World'
import { PositionComponent, SpriteComponent } from '../../components'
import { COMPONENT_TYPES } from '../../../types/engine.types'
import { pointInFrustum, type RenderFrustum } from './frustum'

//queue for rendering sprites

export function buildRenderQueue(
  world: World,
  frustum: RenderFrustum
): Entity[] {
  const entities: Entity[] = []
  for (const entity of world.getEntities()) {
    const pos = entity.getComponent<PositionComponent>(COMPONENT_TYPES.position)
    if (!pos) continue
    if (!pointInFrustum(frustum, pos.x, pos.y)) continue
    entities.push(entity)
  }

  return entities.sort((a, b) => getEntityZIndex(a) - getEntityZIndex(b))
}

function getEntityZIndex(entity: Entity) {
  const sprite = entity.getComponent<SpriteComponent>(COMPONENT_TYPES.sprite)
  return sprite?.zIndex ?? 0
}
