import { IComponent } from '../../types/engine.types'

class Entity {
  private destroyed: boolean
  id: string
  private components = new Map<string, IComponent>()

  constructor(id?: string) {
    this.id = id ?? crypto.randomUUID()
    this.destroyed = false
  }

  addComponent(component: IComponent) {
    this.components.set(component.type, component)
  }

  getComponent<T extends IComponent>(type: string): T | undefined {
    return this.components.get(type) as T | undefined
  }

  hasComponent(type: string): boolean {
    return this.components.has(type)
  }

  removeComponent(type: string): boolean {
    return this.components.delete(type)
  }

  destroy() {
    if (this.destroyed) return
    for (const comp of this.components.values()) {
      if (
        typeof (comp as unknown as Record<string, unknown>).onDestroy ===
        'function'
      ) {
        if (comp.onDestroy) {
          comp.onDestroy()
        }
      }
    }
    this.components.clear()
    this.destroyed = true
  }
}

export default Entity
