import GameEngine from '../core/GameEngine';
import { createGameEngine } from './createGameEngine';
import {
  COMPONENT_TYPES,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import { VelocityComponent } from '../components';

describe('createGameEngine', () => {
  let canvas: HTMLCanvasElement;
  let engine: GameEngine;

  beforeAll(() => {
    canvas = document.createElement('canvas');
    engine = createGameEngine(canvas);
  });

  afterAll(() => {
    engine.destroy();
  });

  it('generates world', () => {
    expect(engine.world).toBeDefined();
  });

  it('creates one player', () => {
    const playerType = COMPONENT_TYPES.playerControl;
    const playerArr = engine.world.query(playerType);
    expect(playerArr).toHaveLength(1);
  });

  it('creates obstacles', () => {
    const obstacleType = COMPONENT_TYPES.obstacle;
    const obstacles = engine.world.query(obstacleType);
    expect(obstacles).not.toHaveLength(0);
  });

  describe('animation logic', () => {
    let requestAnimationFrameSpy: jest.SpyInstance<
      number,
      [callback: FrameRequestCallback]
    >;

    beforeEach(() => {
      jest.useFakeTimers();
      let count = 0;
      requestAnimationFrameSpy = jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((callback: FrameRequestCallback) => {
          setTimeout(() => callback(100 * ++count), 1000);
          return 0;
        });

      engine.start();
    });

    afterEach(() => {
      engine.stop();
      requestAnimationFrameSpy.mockRestore();
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('updates spawn system', () => {
      const mockCallback = jest.fn();
      const spawnSystem = engine.getSystem(SYSTEM_TYPES.spawn as SystemType);
      if (spawnSystem) {
        spawnSystem.update = mockCallback;
        jest.advanceTimersByTime(1000);
        expect(mockCallback).toHaveBeenCalled();
      } else {
        expect(spawnSystem).toBeDefined();
      }
    });

    it('moves player horizontally by pressing key "a"', () => {
      const playerType = COMPONENT_TYPES.playerControl;
      let player = engine.world.query(playerType)[0];
      const keyEvent = new KeyboardEvent('keydown', { key: 'a' });
      window.dispatchEvent(keyEvent);
      jest.advanceTimersByTime(1000);
      player = engine.world.query(playerType)[0];
      const vel = player.getComponent<VelocityComponent>(
        COMPONENT_TYPES.velocity
      );
      if (vel) {
        expect(vel.dx).not.toBe(0);
      }
    });
  });
});
