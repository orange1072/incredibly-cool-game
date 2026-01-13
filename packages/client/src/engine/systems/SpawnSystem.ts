import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '@/types/engine.types';
import World from '../core/World';
import EventBus from '../infrastructure/EventBus';
import { PositionComponent, SpawnPointComponent } from '../components';
import Logger from '../infrastructure/Logger';
import { createZombie } from '../enteties/factories/createZombie';
import { createBoss } from '../enteties/factories/createBoss';
import type { StoreLike } from '../adapters/ReduxAdapter';
import {
  BOSS_WAVE_INTERVAL,
  DEFAULT_AREA_WIDTH,
  DEFAULT_BASE_WAVE_SIZE,
  DEFAULT_SPAWN_BATCH_SIZE,
  DEFAULT_WAVE_GROWTH_FACTOR,
  DEFAULT_SPAWN_BURST_INTERVAL,
  DEFAULT_SPAWN_BURST_SIZE,
} from './consts/spawn';
import Entity from '../core/Entity';
import { type RootState } from '@/store/store';
import { setEnemyCount, setWave } from '@/store/slices/game';
import CameraSystem from './CameraSystem';

interface SpawnSystemOptions {
  eventBus: EventBus;
  store?: StoreLike<RootState>;
  camera?: CameraSystem;
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
  private extraBatchTimer = 0;
  private readonly extraBatchInterval = DEFAULT_SPAWN_BURST_INTERVAL;
  private readonly extraBatchSize = DEFAULT_SPAWN_BURST_SIZE;
  private readonly camera?: CameraSystem;

  constructor({ eventBus, store, camera }: SpawnSystemOptions) {
    this.eventBus = eventBus;
    this.store = store;
    this.camera = camera;
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
    const progressedRatio =
      this.waveTarget === 0 ? 0 : this.enemiesKilledThisWave / this.waveTarget;

    this.store?.dispatch(
      setEnemyCount({
        total: this.waveTarget,
        remaining,
      })
    );

    if (remaining === 0) {
      this.waveComplete = true;
    } else if (progressedRatio >= 1 / 3 && !this.waveComplete) {
      const remainingEnemies = this.waveTarget - this.enemiesKilledThisWave;
      this.waveComplete = true;
      this.logger.info('Triggering next wave early (one-third cleared)', {
        wave: this.waveNumber,
        killed: this.enemiesKilledThisWave,
        total: this.waveTarget,
        remaining: remainingEnemies,
      });
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
    this.extraBatchTimer = 0;

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
    const bounds = world.bounds;
    if (bounds) {
      this.areaWidth = bounds.width;
    }

    if (this.waveTarget === 0) {
      this.startNextWave();
    } else if (this.waveComplete) {
      this.startNextWave();
    }

    const spawns = world.query(
      COMPONENT_TYPES.spawnPoint,
      COMPONENT_TYPES.position
    );

    let currentEnemyCount = world.query(
      COMPONENT_TYPES.enemy,
      COMPONENT_TYPES.health
    ).length;

    if (this.waveTarget > 0) {
      this.extraBatchTimer += dt;
      if (this.extraBatchTimer >= this.extraBatchInterval) {
        const spawnedExtra = this.spawnBurst(world, spawns, currentEnemyCount);
        currentEnemyCount += spawnedExtra;
        this.extraBatchTimer = 0;
      }
    }

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
        const { spawnX, spawnY } = this.getSpawnCoordinates(pos, spawn);
        const zombie = createZombie(spawnX, spawnY, this.waveNumber);
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
        const boss = createBoss(bossX, 100, this.waveNumber);
        world.addEntity(boss);
        this.eventBus.emit('bossSpawned', { id: boss.id });
        this.bossSpawned = true;
      }
    }
  }

  private spawnBurst(
    world: World,
    spawns: Entity[],
    currentEnemyCount: number
  ) {
    if (
      this.enemiesSpawnedThisWave >= this.waveTarget ||
      this.extraBatchSize <= 0
    ) {
      return 0;
    }

    const remainingToSpawn = this.waveTarget - this.enemiesSpawnedThisWave;
    if (remainingToSpawn <= 0) {
      return 0;
    }

    const candidates = spawns
      .map((entity) => ({
        entity,
        spawn: entity.getComponent<SpawnPointComponent>(
          COMPONENT_TYPES.spawnPoint
        ),
        pos: entity.getComponent<PositionComponent>(COMPONENT_TYPES.position),
      }))
      .filter(
        ({ spawn, pos }) => Boolean(spawn?.autoSpawn) && Boolean(pos)
      ) as Array<{
      entity: Entity;
      spawn: SpawnPointComponent;
      pos: PositionComponent;
    }>;

    if (candidates.length === 0) {
      return 0;
    }

    const targetCount = Math.min(this.extraBatchSize, remainingToSpawn);
    let spawned = 0;

    while (spawned < targetCount && candidates.length > 0) {
      const idx = Math.floor(Math.random() * candidates.length);
      const { spawn, pos } = candidates[idx];
      const populationCap = (spawn.maxEntities ?? 10) * 2;
      if (currentEnemyCount >= populationCap) {
        candidates.splice(idx, 1);
        continue;
      }

      const { spawnX, spawnY } = this.getSpawnCoordinates(pos, spawn);
      const zombie = createZombie(spawnX, spawnY, this.waveNumber);

      world.addEntity(zombie);
      this.enemiesSpawnedThisWave += 1;
      spawned += 1;
      currentEnemyCount += 1;

      this.logger.debug(
        `Burst spawned enemy at (${spawnX.toFixed(1)}, ${spawnY.toFixed(1)})`
      );
      this.eventBus.emit('enemySpawned', {
        id: zombie.id,
        x: spawnX,
        y: spawnY,
      });

      if (this.enemiesSpawnedThisWave >= this.waveTarget) {
        break;
      }
    }

    return spawned;
  }

  private getSpawnCoordinates(
    pos: PositionComponent,
    spawn?: SpawnPointComponent
  ) {
    const view = this.camera?.getState();
    if (!view) {
      return {
        spawnX: pos.x + (Math.random() - 0.5) * 2 * (spawn?.radius ?? 20),
        spawnY: pos.y + (Math.random() - 0.5) * 2 * (spawn?.radius ?? 20),
      };
    }

    const minX = view.x;
    const maxX = view.x + view.visibleWidth;
    const minY = view.y;
    const maxY = view.y + view.visibleHeight;

    const spawnX = minX + Math.random() * (maxX - minX);
    const spawnY = minY + Math.random() * (maxY - minY);

    return { spawnX, spawnY };
  }
}

export default SpawnSystem;
