export interface Level {
  id: number
  name: string
  difficulty: 'Easy' | 'Normal' | 'Hard'
  zombies: number
  icon: string
}

export interface Character {
  id: number
  name: string
  weapon: string
  health: number
  icon: string
}

export const GAME_CONFIG = {
  COUNTDOWN_DURATION: 3, // секунды
  PARTICLE_COUNT: 25,
} as const

// Доступные уровни игры
export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'City Ruins',
    difficulty: 'Easy',
    zombies: 15,
    icon: '🏚️',
  },
  {
    id: 2,
    name: 'Exclusion Zone',
    difficulty: 'Normal',
    zombies: 30,
    icon: '☢️',
  },
  {
    id: 3,
    name: 'Ground Zero',
    difficulty: 'Hard',
    zombies: 50,
    icon: '💀',
  },
]

// Доступные персонажи
export const CHARACTERS: Character[] = [
  {
    id: 0,
    name: 'Scout',
    weapon: 'Pistol',
    health: 100,
    icon: '🔭',
  },
  {
    id: 1,
    name: 'Assault',
    weapon: 'Rifle',
    health: 150,
    icon: '⚔️',
  },
  {
    id: 2,
    name: 'Sniper',
    weapon: 'Sniper Rifle',
    health: 80,
    icon: '🎯',
  },
]
