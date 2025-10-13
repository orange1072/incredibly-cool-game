import World from '../engine/core/World'

export type ComponentType<T extends IComponent = IComponent> = new (
  ...args: unknown[]
) => T

export interface IPureDataComponent {
  type: string
}

export interface IComponent extends IPureDataComponent {
  entity: IEntity
}

export interface IEntity {
  id: string
  addComponent<T extends IComponent>(component: T): void
  getComponent<T extends IComponent>(type: string): T | undefined
  removeComponent(type: string): void
}

export interface ISystem {
  requiredComponents?: string[]
  initialize?(world: World): void
  update(world: World, dt: number): void
}
