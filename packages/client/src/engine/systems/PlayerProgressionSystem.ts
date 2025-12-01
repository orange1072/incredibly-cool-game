import {
  COMPONENT_TYPES,
  SYSTEM_TYPES,
  type PassiveBonusKind,
  type SystemType,
  type ISystem,
} from '../../types/engine.types';
import type World from '../core/World';
import EventBus from '../infrastructure/EventBus';
import Logger from '../infrastructure/Logger';
import { PassiveBonusesComponent } from '../components';
import type AttackComponent from '../components/AttackComponent';
import type HealthComponent from '../components/HealthComponent';
import {
  MAX_DAMAGE_BONUS,
  MAX_ATTACK_SPEED_BONUS,
  MAX_MOVEMENT_SPEED_BONUS,
  MAX_HEALTH_BONUS,
  MAX_XP_BONUS,
  PASSIVE_BONUS_OPTIONS,
  PASSIVE_HEALTH_STEP,
} from '../components/PassiveBonusesComponent';
import type {
  PassiveBonusOption,
  PassiveBonusSelectionPayload,
  PassiveBonusSnapshot,
  PlayerLevelUpPayload,
} from '@/types/component.types';

interface PlayerProgressionSystemOptions {
  eventBus: EventBus;
}

type PassiveBonusEventPayload = {
  id: string;
  bonus: PassiveBonusKind;
  remainingChoices: number;
  totals: PassiveBonusSnapshot;
  availableOptions: PassiveBonusOption[];
};

type PassiveBonusAvailabilityPayload = {
  id: string;
  passiveOptions: typeof PASSIVE_BONUS_OPTIONS;
  pendingPassiveBonuses: number;
  weaponOptions: unknown[];
};

class PlayerProgressionSystem implements ISystem<SystemType> {
  type: SystemType = SYSTEM_TYPES.progression as SystemType;
  private eventBus: EventBus;
  private world: World | null = null;
  private readonly logger = new Logger('PlayerProgressionSystem', 'info');
  private pendingPassiveSelections = new Map<string, number>();

  constructor({ eventBus }: PlayerProgressionSystemOptions) {
    this.eventBus = eventBus;
    this.eventBus.on('playerLevelUp', this.handlePlayerLevelUp);
    this.eventBus.on('passiveBonusSelected', this.handlePassiveBonusSelected);
  }

  initialize(world: World) {
    this.world = world;
  }

  update(world: World): void {
    this.world = world;
    const players = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.passiveBonuses
    );

    for (const entity of players) {
      const bonuses = entity.getComponent<PassiveBonusesComponent>(
        COMPONENT_TYPES.passiveBonuses
      );
      const attack = entity.getComponent<AttackComponent>(
        COMPONENT_TYPES.attack
      );
      if (!bonuses || !attack) continue;

      const damage = bonuses.getDamage();
      if (attack.damage !== damage) {
        attack.damage = damage;
      }

      const cooldown = bonuses.getAttackCooldown();
      if (Math.abs(attack.cooldown - cooldown) > 1e-6) {
        attack.cooldown = cooldown;
      }
    }
  }

  onDestroy(): void {
    this.eventBus.off('playerLevelUp', this.handlePlayerLevelUp);
    this.eventBus.off('passiveBonusSelected', this.handlePassiveBonusSelected);
  }

  private handlePlayerLevelUp = (rawPayload: unknown) => {
    const payload = rawPayload as PlayerLevelUpPayload | undefined;
    const entityId = payload?.id;
    if (!entityId) {
      this.logger.debug('Received malformed playerLevelUp payload', rawPayload);
      return;
    }

    const passiveOptions = this.getAvailablePassiveOptions(entityId);
    if (passiveOptions.length === 0) {
      this.logger.info('No passive bonuses available at level up', {
        id: entityId,
      });
      return;
    }

    const pending = (this.pendingPassiveSelections.get(entityId) ?? 0) + 1;
    this.pendingPassiveSelections.set(entityId, pending);
    const availabilityPayload: PassiveBonusAvailabilityPayload = {
      id: entityId,
      passiveOptions,
      pendingPassiveBonuses: pending,
      weaponOptions: [],
    };

    this.eventBus.emit('levelUpRewardsAvailable', availabilityPayload);
    this.logger.info('Passive bonus choices available', availabilityPayload);
  };

  private handlePassiveBonusSelected = (rawPayload: unknown) => {
    const payload = rawPayload as PassiveBonusSelectionPayload | undefined;
    const entityId = payload?.id;
    const bonusKind = payload?.bonus;
    if (!entityId || !bonusKind) {
      this.logger.debug(
        'Ignoring passiveBonusSelected event without entity or bonus',
        rawPayload
      );
      return;
    }

    const pending = this.pendingPassiveSelections.get(entityId) ?? 0;
    if (pending <= 0) {
      this.logger.debug('No pending passive bonuses for entity', {
        id: entityId,
        requestedBonus: bonusKind,
      });
      return;
    }

    const world = this.world;
    if (!world) return;
    const entity = world.getEntity(entityId);
    if (!entity) {
      this.logger.warn('Failed to locate entity for passive bonus selection', {
        id: entityId,
        requestedBonus: bonusKind,
      });
      return;
    }

    const bonuses = entity.getComponent<PassiveBonusesComponent>(
      COMPONENT_TYPES.passiveBonuses
    );
    if (!bonuses) {
      this.logger.warn('Entity missing PassiveBonusesComponent', {
        id: entityId,
      });
      return;
    }

    if (this.isBonusMaxed(bonuses, bonusKind)) {
      this.logger.info('Passive bonus already at maximum', {
        id: entityId,
        requestedBonus: bonusKind,
      });
      return;
    }

    const totals = bonuses.applyPassiveBonus(bonusKind);
    this.pendingPassiveSelections.set(entityId, pending - 1);

    const attack = entity.getComponent<AttackComponent>(COMPONENT_TYPES.attack);
    if (attack) {
      attack.damage = bonuses.getDamage();
      attack.cooldown = bonuses.getAttackCooldown();
    }

    const health = entity.getComponent<HealthComponent>(COMPONENT_TYPES.health);
    if (health) {
      if (bonusKind === 'maxHealth') {
        health.maxHp += PASSIVE_HEALTH_STEP;
        health.hp = health.maxHp;
      } else if (bonusKind === 'fullHeal') {
        health.hp = health.maxHp;
      }
    }

    let remainingChoices = this.pendingPassiveSelections.get(entityId) ?? 0;
    const availableOptions = this.getAvailablePassiveOptions(entityId);
    if (availableOptions.length === 0 && remainingChoices > 0) {
      remainingChoices = 0;
      this.pendingPassiveSelections.set(entityId, 0);
    }

    const eventPayload: PassiveBonusEventPayload = {
      id: entityId,
      bonus: bonusKind,
      remainingChoices,
      totals,
      availableOptions,
    };

    this.eventBus.emit('passiveBonusApplied', eventPayload);
    this.logger.info('Applied passive bonus', eventPayload);
  };

  private getAvailablePassiveOptions(entityId: string): PassiveBonusOption[] {
    const world = this.world;
    if (!world) return [...PASSIVE_BONUS_OPTIONS];
    const entity = world.getEntity(entityId);
    if (!entity) return [...PASSIVE_BONUS_OPTIONS];
    const bonuses = entity.getComponent<PassiveBonusesComponent>(
      COMPONENT_TYPES.passiveBonuses
    );
    if (!bonuses) return [...PASSIVE_BONUS_OPTIONS];

    return PASSIVE_BONUS_OPTIONS.filter(
      (option) => !this.isBonusMaxed(bonuses, option.kind)
    );
  }

  private isBonusMaxed(
    bonuses: PassiveBonusesComponent,
    kind: PassiveBonusKind
  ): boolean {
    switch (kind) {
      case 'movementSpeed':
        return bonuses.movementSpeedBonus >= MAX_MOVEMENT_SPEED_BONUS;
      case 'damage':
        return bonuses.damageBonus >= MAX_DAMAGE_BONUS;
      case 'attackSpeed':
        return bonuses.attackSpeedBonus >= MAX_ATTACK_SPEED_BONUS;
      case 'maxHealth':
        return bonuses.healthBonus >= MAX_HEALTH_BONUS;
      case 'fullHeal':
        return bonuses.healUsed;
      case 'xpGain':
        return bonuses.xpBonus >= MAX_XP_BONUS;
      default:
        return false;
    }
  }
}

export default PlayerProgressionSystem;
