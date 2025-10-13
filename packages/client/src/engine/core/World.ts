import EventBus from '../infrastructure/EventBus'
import Entity from './Entity'

class World {
  private entities = new Map<string, Entity>()
  private eventBus: EventBus

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity)
    this.eventBus.emit('entityAdded', entity)
  }

  getEntity(id: string) {
    return this.entities.get(id)
  }

  removeEntity(id: string) {
    const entity = this.entities.get(id)
    if (!entity) return
    this.entities.delete(id)
    this.eventBus.emit('entityRemoved', entity)
  }

  getEntities(): IterableIterator<Entity> {
    return this.entities.values()
  }

  query(...componentTypes: string[]) {
    return Array.from(this.entities.values()).filter((e) =>
      componentTypes.every((t) => e.hasComponent(t))
    )
  }
}

export default World
