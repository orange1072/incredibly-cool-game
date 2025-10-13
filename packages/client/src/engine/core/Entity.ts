import { IComponent } from '../../types/engine.types'

class Entity {
  id: string
  private components = new Map<string, IComponent>()

  constructor(id?: string) {
    this.id = id ?? crypto.randomUUID()
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
}

export default Entity
