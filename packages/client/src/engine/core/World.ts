import EventBus from '../infrastructure/EventBus';
import Entity from './Entity';
import type RendererSystem from '../systems/RenderSystem';

class World {
  private entities = new Map<string, Entity>();
  private eventBus: EventBus;
  private _bounds = { width: 1600, height: 1200 };
  private renderer: RendererSystem;

  constructor(eventBus: EventBus, render: RendererSystem) {
    this.eventBus = eventBus;
    this.renderer = render;
  }

  setBounds(bounds: { width: number; height: number }) {
    this._bounds = { ...bounds };
  }

  get bounds() {
    return this._bounds;
  }

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity);
    this.eventBus.emit('entityAdded', entity);
  }

  getEntity(id: string) {
    return this.entities.get(id);
  }

  removeEntity(id: string) {
    const entity = this.entities.get(id);
    if (!entity) return;
    this.entities.delete(id);
    this.eventBus.emit('entityRemoved', entity);
  }

  getEntities(): IterableIterator<Entity> {
    return this.entities.values();
  }

  query(...componentTypes: string[]) {
    return Array.from(this.entities.values()).filter((e) =>
      componentTypes.every((t) => e.hasComponent(t))
    );
  }

  render(dt: number) {
    this.renderer.update(this, dt);
    this.renderer.render(this);
  }
}

export default World;
