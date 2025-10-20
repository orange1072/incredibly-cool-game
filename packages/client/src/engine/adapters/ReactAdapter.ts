import { RefObject } from 'react';
import GameEngine from '../core/GameEngine';
interface ReactAdapterOptions {
  canvasRef: RefObject<HTMLCanvasElement>;
  engine: GameEngine;
}

export class ReactAdapter {
  private engine: GameEngine;
  private canvasRef: RefObject<HTMLCanvasElement>;
  private isRunning = false;

  constructor({ canvasRef, engine }: ReactAdapterOptions) {
    this.canvasRef = canvasRef;
    this.engine = engine;
  }

  start() {
    if (this.isRunning) return;
    const canvas = this.canvasRef.current;
    if (!canvas) throw new Error('Canvas not ready');

    this.engine.start();
    this.isRunning = true;
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.engine.stop();
  }

  destroy() {
    this.stop();
  }
}
