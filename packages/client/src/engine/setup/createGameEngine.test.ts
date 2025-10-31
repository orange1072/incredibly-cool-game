import { createGameEngine } from './createGameEngine';

describe('createGameEngine', () => {
  let canvas: HTMLCanvasElement;
  // const store = useStore();

  beforeEach(() => {
    canvas = document.createElement('canvas');
  });

  it('creates world', () => {
    const engine = createGameEngine(canvas);
    engine.start();
    expect(engine.world).toBeDefined();
    engine.stop();
  });
});
