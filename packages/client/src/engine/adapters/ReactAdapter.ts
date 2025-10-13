import { RefObject } from 'react'
import GameEngine from '../core/GameEngine'
import Renderer from '../systems/RenderSystem'

interface ReactAdapterOptions {
  canvasRef: RefObject<HTMLCanvasElement>
  engine: GameEngine
}

export class ReactAdapter {
  private engine: GameEngine
  private canvasRef: RefObject<HTMLCanvasElement>
  private rafId: number | null = null
  private isRunning = false

  constructor({ canvasRef, engine }: ReactAdapterOptions) {
    this.canvasRef = canvasRef
    this.engine = engine
  }

  start() {
    const canvas = this.canvasRef.current
    if (!canvas) throw new Error('Canvas not ready')

    const renderer = new Renderer(canvas)
    this.engine = new GameEngine(renderer)

    this.engine.start()
    this.isRunning = true

    const loop = () => {
      if (!this.isRunning) return
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  stop() {
    this.isRunning = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.engine.stop()
  }

  destroy() {
    this.stop()
  }
}
