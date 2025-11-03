import { XpLootPayload } from '@/types/component.types';
import {
  COMPONENT_TYPES,
  ISystem,
  SYSTEM_TYPES,
  SystemType,
} from '../../types/engine.types';
import { ExperienceComponent } from '../components';
import World from '../core/World';
import EventBus from '../infrastructure/EventBus';
import Logger from '../infrastructure/Logger';
import {
  LEVEL_INCREMENT,
  MIN_THRESHOLD,
  THRESHOLD_GROWTH_RATE,
  ZERO_XP,
} from './consts/experience';

interface ExperienceSystemOptions {
  eventBus: EventBus;
}

class ExperienceSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.experience as SystemType;
  private eventBus: EventBus;
  private world: World | null = null;
  private pendingRewards: XpLootPayload[] = [];
  private logger = new Logger('ExperienceSystem', 'info');

  private handleXpCollected = (rawData: unknown) => {
    const data = rawData as Partial<XpLootPayload> | undefined;

    const xpReward = Number(data?.xpReward ?? ZERO_XP);
    if (!Number.isFinite(xpReward) || xpReward <= ZERO_XP) {
      this.logger.debug('Ignoring non-positive XP reward', data);
      return;
    }

    if (!this.world) {
      this.pendingRewards.push({ xpReward });
      return;
    }

    this.grantExperience(xpReward);
  };

  constructor({ eventBus }: ExperienceSystemOptions) {
    this.eventBus = eventBus;
    this.eventBus.on('xpCollected', this.handleXpCollected);
  }

  initialize(world: World): void {
    this.world = world;
    this.flushPendingRewards();
  }

  update(world: World): void {
    this.world = world;
    this.flushPendingRewards();

    const players = world.query(COMPONENT_TYPES.experience);
    for (const player of players) {
      const exp = player.getComponent<ExperienceComponent>(
        COMPONENT_TYPES.experience
      );
      if (!exp) continue;

      this.processLevelUps(player.id, exp);
    }
  }

  private grantExperience(xpReward: number) {
    if (!this.world) return;
    const player = this.world.query(COMPONENT_TYPES.experience)[0];
    const exp = player?.getComponent<ExperienceComponent>(
      COMPONENT_TYPES.experience
    );
    if (!exp) {
      this.logger.debug('Entity without experience component received XP', {
        player,
      });
      return;
    }

    exp.xp += xpReward;
  }

  private flushPendingRewards() {
    if (!this.world || this.pendingRewards.length === 0) return;

    const rewards = this.pendingRewards.splice(0);
    for (const reward of rewards) {
      this.grantExperience(reward.xpReward);
    }
  }

  private processLevelUps(entityId: string, exp: ExperienceComponent) {
    let leveledUp = false;

    while (exp.xp >= exp.xpToNext && exp.xpToNext > ZERO_XP) {
      exp.xp -= exp.xpToNext;
      exp.level += LEVEL_INCREMENT;
      exp.xpToNext = Math.max(
        MIN_THRESHOLD,
        Math.floor(exp.xpToNext * THRESHOLD_GROWTH_RATE)
      );
      leveledUp = true;

      this.eventBus.emit('playerLevelUp', {
        id: entityId,
        newLevel: exp.level,
      });
    }

    if (leveledUp) {
      this.logger.info('Player level up', {
        id: entityId,
        level: exp.level,
        remainingXp: exp.xp,
        nextThreshold: exp.xpToNext,
      });
    }
  }
}

export default ExperienceSystem;
