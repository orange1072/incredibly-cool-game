import { PositionComponent } from '../core/Components'
import World from '../core/World'

class Renderer {
  private ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not supported')
    this.ctx = ctx
  }

  render(world: World) {
    const { width, height } = this.ctx.canvas
    this.ctx.clearRect(0, 0, width, height)
    for (const e of world.getEntities()) {
      const pos = e.getComponent<PositionComponent>('position')
      if (!pos) continue

      this.ctx.fillStyle = 'red'
      this.ctx.fillRect(pos.x, pos.y, 10, 10)
    }
  }
}

export default Renderer
