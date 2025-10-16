import type { EffectEntry } from '../component.types'

export type DamageSettings = {
  baseSpeed: number
  baseValue: number
  actualDamage(this: DamageSettings, bonus: number, multiplier?: number): number
}

export type HealthSettings = {
  baseValue: number
  levelBonus: number
  health(this: HealthSettings, level: number, multiplier?: number): number
}

export type SkinSettings = {
  color: string
  healthBarColor: string
}

export type SpritePadding = {
  x?: number
  y?: number
}

export type SpriteSettings = {
  name: string
  width: number
  height: number
  source: string
  scale?: number
  frameDuration?: number
  columns?: number
  rows?: number
  padding?: SpritePadding
}

export interface PlayerSettings {
  name: string
  baseLevel: number
  damage: DamageSettings
  health: HealthSettings
  skin: SkinSettings
  sprite: SpriteSettings
  baseSpeed: number
  abilities?: EffectEntry[]
}
