export type AIState = 'idle' | 'chase' | 'attack' | 'dead'

export type EnemyKind = 'zombie' | 'runner' | 'bloater' | 'boss'

export type ProjectileKind = 'bullet' | 'rocket' | 'plasma' | 'shotgun'

export type EffectKind =
  | 'damageOverTime'
  | 'healOverTime'
  | 'speedBoost'
  | 'slow'

export interface EffectEntry {
  kind: EffectKind
  value: number
  duration: number
  elapsed?: number
  tickRate?: number
  tickTimer?: number
}

export type SpawnType = 'player' | 'enemy' | 'item' | 'boss'
