export const AI_STATES = {
  idle: 'idle',
  chase: 'chase',
  attack: 'attack',
  dead: 'dead',
} as const;

export type AIState = (typeof AI_STATES)[keyof typeof AI_STATES];

export type EnemyKind = 'zombie' | 'runner' | 'bloater' | 'boss';

export type ProjectileKind = 'bullet' | 'rocket' | 'plasma' | 'shotgun';

export type EffectKind =
  | 'damageOverTime'
  | 'healOverTime'
  | 'speedBoost'
  | 'slow';

export interface EffectEntry {
  kind: EffectKind;
  value: number;
  duration: number;
  elapsed?: number;
  tickRate?: number;
  tickTimer?: number;
}

export interface EnemyKilledPayload {
  killerId: string;
}

export interface XpLootPayload {
  xpReward: number;
}

export type SpawnType = 'player' | 'enemy' | 'item' | 'boss';

export type PassiveBonusKind = 'movementSpeed' | 'damage' | 'attackSpeed';

export interface PassiveBonusOption {
  kind: PassiveBonusKind;
  label: string;
  description: string;
}

export interface PlayerLevelUpPayload {
  id: string;
  newLevel: number;
}

export interface PassiveBonusSelectionPayload {
  id: string;
  bonus: PassiveBonusKind;
}

export interface LevelUpRewardsAvailablePayload {
  id: string;
  passiveOptions: PassiveBonusOption[];
  pendingPassiveBonuses: number;
  weaponOptions?: unknown[];
}

export interface PassiveBonusAppliedPayload {
  id: string;
  bonus: PassiveBonusKind;
  remainingChoices: number;
}
