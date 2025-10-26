import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import World from '../core/World';
import EventBus from '../infrastructure/EventBus';
import { PositionComponent, SpawnPointComponent } from '../components';
import Logger from '../infrastructure/Logger';
import { createZombie } from '../enteties/createZombie';
import { createBoss } from '../enteties/createBoss';
import { setEnemyCount, setWave } from '../../slices/game';
import type { StoreLike } from '../adapters/ReduxAdapter';
import type { RootState } from '../../store';
import {
  BOSS_WAVE_INTERVAL,
  DEFAULT_AREA_WIDTH,
  DEFAULT_BASE_WAVE_SIZE,
  DEFAULT_SPAWN_BATCH_SIZE,
  DEFAULT_WAVE_GROWTH_FACTOR,
} from './consts/spawn';

interface SpawnSystemOptions {
  eventBus: EventBus;
  store?: StoreLike<RootState>;
}

class SpawnSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.spawn as SystemType;
  private eventBus: EventBus;
  private logger = new Logger('SpawnSystem', 'info');
  private bossSpawned = false;
  private waveNumber = 0;
  private areaWidth = DEFAULT_AREA_WIDTH;
  private store?: StoreLike<RootState>;
  private enemiesSpawnedThisWave = 0;
  private enemiesKilledThisWave = 0;
  private waveTarget = 0;
  private waveComplete = false;
  private readonly spawnBatchSize = DEFAULT_SPAWN_BATCH_SIZE;
  private readonly baseWaveSize = DEFAULT_BASE_WAVE_SIZE;
  private readonly waveGrowthFactor = DEFAULT_WAVE_GROWTH_FACTOR;

  constructor({ eventBus, store }: SpawnSystemOptions) {
    this.eventBus = eventBus;
    this.store = store;

    this.eventBus.on('enemyKilled', this.handleEnemyKilledEvent);
  }

  private handleEnemyKilledEvent = () => {
    if (this.waveTarget === 0) {
      return;
    }

    this.enemiesKilledThisWave = Math.min(
      this.waveTarget,
      this.enemiesKilledThisWave + 1
    );
    const remaining = Math.max(this.waveTarget - this.enemiesKilledThisWave, 0);

    this.store?.dispatch(
      setEnemyCount({
        total: this.waveTarget,
        remaining,
      })
    );

    if (remaining === 0) {
      this.waveComplete = true;
    }
  };

  private calculateWaveSize(wave: number) {
    return Math.max(
      this.baseWaveSize,
      Math.round(this.baseWaveSize * Math.pow(this.waveGrowthFactor, wave - 1))
    );
  }

  private startNextWave() {
    this.waveNumber += 1;
    this.enemiesSpawnedThisWave = 0;
    this.enemiesKilledThisWave = 0;
    this.waveTarget = this.calculateWaveSize(this.waveNumber);
    this.waveComplete = false;
    this.bossSpawned = false;

    this.logger.info('Starting wave', {
      wave: this.waveNumber,
      target: this.waveTarget,
    });

    this.store?.dispatch(
      setWave({ wave: this.waveNumber, size: this.waveTarget })
    );
    this.store?.dispatch(
      setEnemyCount({
        total: this.waveTarget,
        remaining: this.waveTarget,
      })
    );
  }

  update(world: World, dt: number) {
    const bounds = world.getBounds?.();
    if (bounds) {
      this.areaWidth = bounds.width;
    }

    if (this.waveTarget === 0) {
      this.startNextWave();
    } else if (this.waveComplete) {
      const remainingEnemies = world.query(COMPONENT_TYPES.enemy).length;
      if (remainingEnemies === 0) {
        this.startNextWave();
      }
    }

    const spawns = world.query(
      COMPONENT_TYPES.spawnPoint,
      COMPONENT_TYPES.position
    );

    let currentEnemyCount = world.query(
      COMPONENT_TYPES.enemy,
      COMPONENT_TYPES.health
    ).length;

    for (const sp of spawns) {
      const spawn = sp.getComponent<SpawnPointComponent>(
        COMPONENT_TYPES.spawnPoint
      );
      const pos = sp.getComponent<PositionComponent>(COMPONENT_TYPES.position);
      if (!spawn || !pos) continue;

      if (!spawn.autoSpawn) continue;
      spawn._timer = (spawn._timer ?? 0) + dt;

      if (this.enemiesSpawnedThisWave >= this.waveTarget) {
        continue;
      }

      const populationCap = (spawn.maxEntities ?? 10) * 2;
      if (currentEnemyCount >= populationCap) continue;

      if (spawn._timer < spawn.interval) continue;
      spawn._timer = 0;

      const remainingToSpawn = this.waveTarget - this.enemiesSpawnedThisWave;
      if (remainingToSpawn <= 0) continue;

      const availableSlots = populationCap - currentEnemyCount;
      if (availableSlots <= 0) continue;

      const batchCount = Math.min(
        this.spawnBatchSize,
        remainingToSpawn,
        availableSlots
      );
      if (batchCount <= 0) continue;

      for (let i = 0; i < batchCount; i += 1) {
        if (this.enemiesSpawnedThisWave >= this.waveTarget) break;
        const spawnX = pos.x + (Math.random() - 0.5) * spawn.radius * 2;
        const spawnY = pos.y + (Math.random() - 0.5) * spawn.radius * 2;
        const zombie = createZombie(spawnX, spawnY);
        world.addEntity(zombie);
        this.enemiesSpawnedThisWave += 1;
        currentEnemyCount += 1;

        this.logger.debug(
          `Spawned enemy at (${spawnX.toFixed(1)}, ${spawnY.toFixed(1)})`
        );
        this.eventBus.emit('enemySpawned', {
          id: zombie.id,
          x: spawnX,
          y: spawnY,
        });
      }

      if (this.waveNumber % BOSS_WAVE_INTERVAL === 0 && !this.bossSpawned) {
        const bossX = bounds ? bounds.width / 2 : this.areaWidth / 2;
        const boss = createBoss(bossX, 100);
        world.addEntity(boss);
        this.eventBus.emit('bossSpawned', { id: boss.id });
        this.bossSpawned = true;
      }
    }
  }
}

export default SpawnSystem;
