import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';

import gameReducer, {
  countBossFrag,
  countFrag,
  levelUp,
  openLevelRewards,
  closeLevelRewards,
  setLevelRewardsOptions,
  setAttackSpeedModifier,
  setBossCount,
  setDamageModifier,
  setEnemyCount,
  setHealthModifier,
  setMovementSpeedModifier,
  setPlayerHealth,
  setPlayerXp,
  setXpModifier,
  updateLevelRewardsPending,
} from '../../store/slices/game';
import type { RootState } from '@/store/store';
import {
  COMPONENT_TYPES,
  SystemType,
  type ISystem,
} from '@/types/engine.types';
import GameEngine from '../core/GameEngine';
import type World from '../core/World';
import type Entity from '../core/Entity';
import type {
  EnemyComponent,
  ExperienceComponent,
  HealthComponent,
  PassiveBonusesComponent,
} from '../components';
import EventBus, { type Listener } from '../infrastructure/EventBus';
import { isProperEntity } from '../systems/helpers/utils';
import type {
  LevelUpRewardsAvailablePayload,
  PassiveBonusAppliedPayload,
} from '@/types/component.types';

type GameSliceState = ReturnType<typeof gameReducer>;

export interface StoreLike<TState> {
  dispatch: (action: AnyAction) => unknown;
  getState: () => TState;
  subscribe?: (listener: () => void) => () => void;
}

interface ReduxAdapterOptions<TState> {
  engine: GameEngine;
  store?: StoreLike<TState>;
  selectGameState?: (state: TState) => GameSliceState;
}

function defaultSelectGameState<TState>(
  state: TState
): GameSliceState | undefined {
  if (state && typeof state === 'object') {
    const record = state as Record<string, unknown>;
    if (Object.prototype.hasOwnProperty.call(record, 'game')) {
      return record.game as GameSliceState;
    }
    return record as unknown as GameSliceState;
  }
  return undefined;
}

class ReduxAdapter<TState = RootState> {
  private readonly engine: GameEngine;
  private readonly eventBus: EventBus;
  private readonly externalStore?: StoreLike<TState>;
  private readonly selectGameState:
    | ((state: TState) => GameSliceState | undefined)
    | undefined;
  private readonly internalStore?: EnhancedStore<GameSliceState>;
  private readonly dispatchImpl: (action: AnyAction) => unknown;
  private readonly getGameStateImpl: () => GameSliceState;
  private readonly subscribeImpl?: (listener: () => void) => () => void;
  private readonly cleanupListeners: Array<() => void> = [];
  private readonly syncSystem: ISystem<SystemType>;

  private isActive = false;
  private syncSystemRegistered = false;
  private lastEnemyCount = 0;
  private waveSize = 0;
  private lastBossCount = 0;
  private lastPlayerSnapshot: {
    hp: number | null;
    xp: number | null;
    level: number | null;
    xpToNext: number | null;
  } = {
    hp: null,
    xp: null,
    level: null,
    xpToNext: null,
  };
  private lastModifiersSnapshot = {
    damage: 0,
    attackSpeed: 0,
    movementSpeed: 0,
    health: 0,
    xp: 0,
  };

  constructor({ engine, store, selectGameState }: ReduxAdapterOptions<TState>) {
    this.engine = engine;
    this.eventBus = engine.eventBus;
    this.externalStore = store;
    this.selectGameState = selectGameState;

    if (store) {
      this.dispatchImpl = store.dispatch;
      const select = selectGameState ?? defaultSelectGameState<TState>;
      this.getGameStateImpl = () => {
        const state = store.getState();
        const gameState = select(state);
        if (!gameState) {
          throw new Error(
            'Unable to select game state from the provided store'
          );
        }
        return gameState;
      };
      this.subscribeImpl = store.subscribe?.bind(store);
    } else {
      this.internalStore = configureStore({
        reducer: gameReducer,
      });
      this.dispatchImpl = this.internalStore.dispatch;
      this.getGameStateImpl = () => this.internalStore!.getState();
      this.subscribeImpl = this.internalStore.subscribe;
    }

    this.syncSystem = {
      type: 'sync',
      update: (world: World) => {
        if (!this.isActive) return;
        this.syncPlayerState(world);
      },
    };
  }

  connect() {
    if (this.isActive) return;
    this.isActive = true;

    this.initializeSnapshots();
    if (!this.syncSystemRegistered) {
      this.engine.addSystem(this.syncSystem, 'sync');
      this.syncSystemRegistered = true;
    }

    this.addListener('entityAdded', this.handleEntityAdded)
      .addListener('entityRemoved', this.handleEntityRemoved)
      .addListener('bossSpawned', this.handleBossSpawned)
      .addListener('playerLevelUp', this.handlePlayerLevelUp)
      .addListener(
        'levelUpRewardsAvailable',
        this.handleLevelUpRewardsAvailable
      )
      .addListener('passiveBonusApplied', this.handlePassiveBonusAppliedEvent);

    this.syncEnemyCounts();
    this.syncPlayerState(this.engine.world);
  }

  disconnect() {
    if (!this.isActive) return;
    this.isActive = false;

    while (this.cleanupListeners.length > 0) {
      const cleanup = this.cleanupListeners.pop();
      cleanup?.();
    }
  }

  destroy() {
    this.disconnect();
  }

  getStore() {
    return this.internalStore;
  }

  dispatch(action: AnyAction) {
    return this.dispatchImpl(action);
  }

  getGameState() {
    return this.getGameStateImpl();
  }

  subscribe(listener: () => void) {
    if (!this.subscribeImpl) {
      throw new Error(
        'Subscribe is not available for the provided store instance'
      );
    }
    return this.subscribeImpl(listener);
  }

  private addListener(event: string, listener: Listener) {
    this.eventBus.on(event, listener);
    this.cleanupListeners.push(() => this.eventBus.off(event, listener));

    return this;
  }

  private initializeSnapshots() {
    const state = this.getGameStateImpl();
    this.lastEnemyCount = state.missionProgress.amountOfEnemiesInWave;
    this.waveSize = state.missionProgress.waveSize;
    this.lastBossCount = state.missionProgress.amountOfBosses;
    this.lastPlayerSnapshot = {
      hp: state.player.hp,
      xp: state.player.xp,
      level: state.player.level,
      xpToNext: state.player.xpToNext,
    };
    this.lastModifiersSnapshot = {
      damage: state.modifiers.damage,
      attackSpeed: state.modifiers.attackSpeed,
      movementSpeed: state.modifiers.movementSpeed,
    };
  }

  private handleEntityAdded: Listener = (...args) => {
    if (!this.isActive) return;
    const [entity] = args as [Entity | undefined];
    if (!entity || !isProperEntity(entity, COMPONENT_TYPES.enemy)) return;
    this.syncEnemyCounts();
  };

  private handleEntityRemoved: Listener = (...args) => {
    if (!this.isActive) return;
    const [entity] = args as [Entity | undefined];
    if (!entity || !isProperEntity(entity, COMPONENT_TYPES.enemy)) {
      return;
    }

    this.dispatchImpl(countFrag());

    const enemy = entity.getComponent<EnemyComponent>(COMPONENT_TYPES.enemy);
    if (enemy?.kind === 'boss') {
      this.dispatchImpl(countBossFrag());
    }

    this.syncEnemyCounts();
  };

  private handleBossSpawned = () => {
    if (!this.isActive) return;
    this.syncEnemyCounts();
  };

  private handlePlayerLevelUp = () => {
    if (!this.isActive) return;
    this.dispatchImpl(levelUp());
    const state = this.getGameStateImpl();
    this.lastPlayerSnapshot.level = state.player.level;
  };

  private handleLevelUpRewardsAvailable: Listener = (...args) => {
    if (!this.isActive) return;
    const [payload] = args as [LevelUpRewardsAvailablePayload | undefined];
    if (!payload || !payload.id) return;

    this.dispatchImpl(
      openLevelRewards({
        entityId: payload.id,
        pending: payload.pendingPassiveBonuses,
        options: payload.passiveOptions,
      })
    );
  };

  private handlePassiveBonusAppliedEvent: Listener = (...args) => {
    if (!this.isActive) return;
    const [payload] = args as [PassiveBonusAppliedPayload | undefined];
    if (!payload) return;

    this.dispatchImpl(updateLevelRewardsPending(payload.remainingChoices));
    if (payload.availableOptions) {
      this.dispatchImpl(setLevelRewardsOptions(payload.availableOptions));
      if (
        payload.remainingChoices <= 0 &&
        payload.availableOptions.length === 0
      ) {
        this.dispatchImpl(closeLevelRewards());
      }
    }
  };

  private syncEnemyCounts() {
    const world = this.engine.world;
    const enemies = world.query(COMPONENT_TYPES.enemy);
    const enemyCount = enemies.length;
    const gameState = this.getGameStateImpl();
    const targetSize = Math.max(gameState.missionProgress.waveSize, enemyCount);
    this.waveSize = targetSize;

    if (enemyCount !== this.lastEnemyCount) {
      this.dispatchImpl(
        setEnemyCount({
          total: targetSize,
          remaining: enemyCount,
        })
      );
      this.lastEnemyCount = enemyCount;
    }

    let bossCount = 0;
    for (const enemyEntity of enemies) {
      const enemy = enemyEntity.getComponent<EnemyComponent>(
        COMPONENT_TYPES.enemy
      );
      if (enemy?.kind === 'boss') {
        bossCount += 1;
      }
    }

    if (bossCount !== this.lastBossCount) {
      this.dispatchImpl(setBossCount(bossCount));
      this.lastBossCount = bossCount;
    }
  }

  private syncPlayerState(world: World) {
    const players = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.health
    );
    const playerEntity = players[0];
    if (!playerEntity) return;

    const health = playerEntity.getComponent<HealthComponent>(
      COMPONENT_TYPES.health
    );
    if (health && health.hp !== this.lastPlayerSnapshot.hp) {
      this.dispatchImpl(setPlayerHealth(health.hp));
      this.lastPlayerSnapshot.hp = health.hp;
    }

    const experience = playerEntity.getComponent<ExperienceComponent>(
      COMPONENT_TYPES.experience
    );
    if (!experience) return;

    if (
      experience.xp !== this.lastPlayerSnapshot.xp ||
      experience.xpToNext !== this.lastPlayerSnapshot.xpToNext
    ) {
      this.dispatchImpl(
        setPlayerXp({
          current: experience.xp,
          toNext: experience.xpToNext,
        })
      );
      this.lastPlayerSnapshot.xp = experience.xp;
      this.lastPlayerSnapshot.xpToNext = experience.xpToNext;
    }

    const passiveBonuses = playerEntity.getComponent<PassiveBonusesComponent>(
      COMPONENT_TYPES.passiveBonuses
    );

    if (passiveBonuses) {
      const snapshot = passiveBonuses.getSnapshot();

      if (snapshot.damageBonus !== this.lastModifiersSnapshot.damage) {
        this.dispatchImpl(setDamageModifier(snapshot.damageBonus));
        this.lastModifiersSnapshot.damage = snapshot.damageBonus;
      }

      if (
        snapshot.attackSpeedBonus !== this.lastModifiersSnapshot.attackSpeed
      ) {
        this.dispatchImpl(setAttackSpeedModifier(snapshot.attackSpeedBonus));
        this.lastModifiersSnapshot.attackSpeed = snapshot.attackSpeedBonus;
      }

      if (
        snapshot.movementSpeedBonus !== this.lastModifiersSnapshot.movementSpeed
      ) {
        this.dispatchImpl(
          setMovementSpeedModifier(snapshot.movementSpeedBonus)
        );
        this.lastModifiersSnapshot.movementSpeed = snapshot.movementSpeedBonus;
      }

      if (snapshot.healthBonus !== this.lastModifiersSnapshot.health) {
        this.dispatchImpl(setHealthModifier(snapshot.healthBonus));
        this.lastModifiersSnapshot.health = snapshot.healthBonus;
      }

      if (snapshot.xpBonus !== this.lastModifiersSnapshot.xp) {
        this.dispatchImpl(setXpModifier(snapshot.xpBonus));
        this.lastModifiersSnapshot.xp = snapshot.xpBonus;
      }
    } else if (
      this.lastModifiersSnapshot.damage !== 0 ||
      this.lastModifiersSnapshot.attackSpeed !== 0 ||
      this.lastModifiersSnapshot.movementSpeed !== 0 ||
      this.lastModifiersSnapshot.health !== 0 ||
      this.lastModifiersSnapshot.xp !== 0
    ) {
      this.dispatchImpl(setDamageModifier(0));
      this.dispatchImpl(setAttackSpeedModifier(0));
      this.dispatchImpl(setMovementSpeedModifier(0));
      this.dispatchImpl(setHealthModifier(0));
      this.dispatchImpl(setXpModifier(0));
      this.lastModifiersSnapshot = {
        damage: 0,
        attackSpeed: 0,
        movementSpeed: 0,
        health: 0,
        xp: 0,
      };
    }

    const currentLevel = experience.level;
    const knownLevel = this.lastPlayerSnapshot.level ?? 0;

    if (currentLevel > knownLevel) {
      for (let lvl = knownLevel; lvl < currentLevel; lvl += 1) {
        this.dispatchImpl(levelUp());
      }
    }

    this.lastPlayerSnapshot.level = currentLevel;
  }
}

export default ReduxAdapter;
