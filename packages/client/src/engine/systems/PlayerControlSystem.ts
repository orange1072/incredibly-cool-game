import { ISystem } from '../../types/engine.types'
import {
  PlayerControlComponent,
  PositionComponent,
  VelocityComponent,
} from '../core/Components'
import World from '../core/World'
import InputManager from '../infrastructure/InputManager'

class PlayerControlSystem implements ISystem {
  constructor(private input: InputManager, private speed = 200) {}

  update(world: World, dt: number): void {
    console.log(dt)
    const entities = world.query('playerControl', 'position', 'velocity')

    for (const e of entities) {
      const pos = e.getComponent<PositionComponent>('position')
      const vel = e.getComponent<VelocityComponent>('velocity')
      const control = e.getComponent<PlayerControlComponent>('playerControl')

      if (!pos || !vel || !control) continue

      const horizontal =
        (this.input.isPressed('ArrowRight') ? 1 : 0) -
        (this.input.isPressed('ArrowLeft') ? 1 : 0)
      const vertical =
        (this.input.isPressed('ArrowDown') ? 1 : 0) -
        (this.input.isPressed('ArrowUp') ? 1 : 0)

      vel.dx = horizontal * this.speed
      vel.dy = vertical * this.speed

      control.shooting = this.input.isPressed('Space')
    }
  }
}

export default PlayerControlSystem
