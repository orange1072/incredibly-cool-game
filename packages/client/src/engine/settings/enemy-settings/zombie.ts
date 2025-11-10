import defaultZombieRunSprite from '../../../assets/enemies/regulars/default-zombie/run.png';
import zombieRunnerRunSprite from '../../../assets/enemies/regulars/zombie-runner/run.png';
import zombieToxicRunSprite from '../../../assets/enemies/regulars/zombie-toxic/run.png';
import zombieBruiserRunSprite from '../../../assets/enemies/regulars/zombie-bruiser/run.png';
import zombieTankRunSprite from '../../../assets/enemies/regulars/zombie-tank/run.png';
import zombieGunnerRunSprite from '../../../assets/enemies/regulars/zombie-gunner/run.png';

import type {
  DamageProfile,
  EnemySettings,
  EnemyVariantDefinition,
  HealthProfile,
  SpawnCondition,
} from '../../../types/settings/enemy-settings.types';

const baseSpawn: SpawnCondition = {
  minWorldLevel: 1,
  weight: 1,
};

const baseZombieSettings: EnemySettings = {
  name: 'zombie-walker',
  kind: 'zombie',
  ai: {
    startingValue: 'idle',
    aggroRange: 1800,
  },
  damage: {
    radius: 5,
    baseSpeed: 40,
    baseValue: 10,
    actualDamage(this: DamageProfile, bonus: number, multiplier = 1) {
      return this.baseValue * multiplier + bonus;
    },
  },
  xpReward: 20,
  sprite: {
    defaultColor: 'rgba(255, 75, 75, 0.95)',
    width: 128,
    height: 128,
    name: 'zombie-walker',
    source: defaultZombieRunSprite,
    columns: 8,
    rows: 15,
    frameDuration: 80,
    scale: 0.5,
    padding: {
      x: 20,
      y: 20,
    },
  },
  skin: {
    color: 'rgba(255, 75, 75, 0.95)',
    healthBarColor: '#ff4d6d',
  },
  collision: {
    radius: 12,
  },
  health: {
    baseValue: 300,
    levelBonus: 10,
    health(this: HealthProfile, level: number, multiplier = 1) {
      return this.baseValue * multiplier + this.levelBonus * level;
    },
  },
  movement: {
    speed: 60,
  },
  attack: {
    range: 45,
    cooldown: 1.2,
  },
};

type SettingsOverride = Partial<
  Pick<
    EnemySettings,
    | 'damage'
    | 'xpReward'
    | 'skin'
    | 'collision'
    | 'health'
    | 'movement'
    | 'attack'
    | 'sprite'
    | 'ai'
  >
>;

function createVariantSettings(overrides: SettingsOverride): EnemySettings {
  return {
    ...baseZombieSettings,
    ai: { ...baseZombieSettings.ai, ...overrides.ai },
    damage: { ...baseZombieSettings.damage, ...overrides.damage },
    xpReward: overrides.xpReward ?? baseZombieSettings.xpReward,
    sprite: { ...baseZombieSettings.sprite, ...overrides.sprite },
    skin: { ...baseZombieSettings.skin, ...overrides.skin },
    collision: { ...baseZombieSettings.collision, ...overrides.collision },
    health: {
      ...baseZombieSettings.health,
      ...overrides.health,
      health: overrides.health?.health ?? baseZombieSettings.health.health,
    },
    movement: { ...baseZombieSettings.movement, ...overrides.movement },
    attack: { ...baseZombieSettings.attack, ...overrides.attack },
  };
}

const regularZombieVariant: EnemyVariantDefinition = {
  id: 'zombie-walker',
  displayName: 'Обычный ходок',
  description:
    'Стандартный заражённый с базовыми параметрами движения и урона. Служит отправной точкой для остальных видов.',
  tags: ['базовый', 'ближний бой'],
  abilities: ['Умеренные скорость и урон', 'Атакует в ближнем радиусе'],
  spawn: baseSpawn,
  settings: baseZombieSettings,
};

const speedyZombieVariant: EnemyVariantDefinition = {
  id: 'zombie-runner',
  displayName: 'Проворный ходок',
  description:
    'Быстрый противник, способный быстро сокращать дистанцию до сталкера.',
  tags: ['скорость', 'преследование'],
  abilities: ['Увеличенная скорость передвижения', 'Сохраняет базовый урон'],
  spawn: { ...baseSpawn, weight: 1.2 },
  settings: createVariantSettings({
    movement: { speed: 85 },
    xpReward: 30,
    sprite: {
      ...baseZombieSettings.sprite,
      name: 'zombie-runner',
      source: zombieRunnerRunSprite,
      defaultColor: 'rgba(92, 196, 212, 0.9)',
    },
  }),
};

const bruiserZombieVariant: EnemyVariantDefinition = {
  id: 'zombie-bruiser',
  displayName: 'Усиленный ходок',
  description:
    'Заражённый с усиленными атаками, способный быстро пробивать броню.',
  tags: ['урон', 'ближний бой'],
  abilities: ['Повышенный урон по цели', 'Стандартная скорость'],
  spawn: { ...baseSpawn, weight: 0.9 },
  settings: createVariantSettings({
    damage: {
      ...baseZombieSettings.damage,
      baseValue: 18,
    },
    xpReward: 35,
    sprite: {
      ...baseZombieSettings.sprite,
      name: 'zombie-bruiser',
      source: zombieBruiserRunSprite,
      defaultColor: 'rgba(155, 19, 19, 0.9)',
    },
  }),
};

const tankZombieVariant: EnemyVariantDefinition = {
  id: 'zombie-tank',
  displayName: 'Тяжёлый ходок',
  description:
    'Вынужден двигаться медленнее из-за массивного тела, но выдерживает серьёзный урон.',
  tags: ['живучесть', 'контроль'],
  abilities: ['Увеличенное здоровье', 'Пониженная скорость движения'],
  spawn: { ...baseSpawn, weight: 0.8 },
  settings: createVariantSettings({
    health: {
      baseValue: 450,
      levelBonus: 18,
      health(this: HealthProfile, level: number, multiplier = 1) {
        return this.baseValue * multiplier + this.levelBonus * level;
      },
    },
    movement: { speed: 45 },
    sprite: {
      ...baseZombieSettings.sprite,
      name: 'zombie-tank',
      source: zombieTankRunSprite,
      defaultColor: 'rgba(209, 215, 45, 0.9)',
    },
    xpReward: 40,
  }),
};

const toxicAmbusherVariant: EnemyVariantDefinition = {
  id: 'zombie-toxic',
  displayName: 'Токсичный следопыт',
  description:
    'После гибели оставляет токсичную жижу, временно блокирующую проход.',
  tags: ['контроль территории', 'ловушки'],
  abilities: [
    'При гибели создаёт токсичную лужу-преграду на 5 секунд',
    'Повышенное здоровье',
  ],
  spawn: { ...baseSpawn, weight: 0.6 },
  settings: createVariantSettings({
    health: {
      baseValue: 360,
      levelBonus: 14,
      health(this: HealthProfile, level: number, multiplier = 1) {
        return this.baseValue * multiplier + this.levelBonus * level;
      },
    },
    xpReward: 45,
    sprite: {
      ...baseZombieSettings.sprite,
      name: 'zombie-toxic',
      source: zombieToxicRunSprite,
      defaultColor: 'rgba(86, 199, 120, 0.9)',
    },
    skin: {
      color: 'rgba(86, 199, 120, 0.9)',
      healthBarColor: '#4aa56e',
    },
  }),
};

const rangedZombieVariant: EnemyVariantDefinition = {
  id: 'zombie-gunner',
  displayName: 'Бесконтрольный стрелок',
  description:
    'Периодически стреляет самодельными болтами без наведения прямо в цель.',
  tags: ['дальний бой', 'давление'],
  abilities: [
    'Запускает прямолинейные снаряды по игроку',
    'Сниженное здоровье для компенсации дальности',
  ],
  spawn: { ...baseSpawn, weight: 0.5, minWorldLevel: 1 },
  settings: createVariantSettings({
    attack: {
      range: 280,
      cooldown: 2.5,
    },
    movement: { speed: 55 },
    health: {
      baseValue: 260,
      levelBonus: 12,
      health(this: HealthProfile, level: number, multiplier = 1) {
        return this.baseValue * multiplier + this.levelBonus * level;
      },
    },
    xpReward: 55,
    sprite: {
      ...baseZombieSettings.sprite,
      source: zombieGunnerRunSprite,
      defaultColor: 'rgba(195, 127, 255, 0.9)',
    },
    skin: {
      color: 'rgba(195, 127, 255, 0.9)',
      healthBarColor: '#a76cff',
    },
  }),
};

export const zombieVariants: EnemyVariantDefinition[] = [
  regularZombieVariant,
  speedyZombieVariant,
  bruiserZombieVariant,
  tankZombieVariant,
  toxicAmbusherVariant,
  rangedZombieVariant,
];

export const regularZombie = regularZombieVariant.settings;

function meetsSpawnCondition(variant: EnemyVariantDefinition, level: number) {
  const { spawn } = variant;
  const worldLevel = spawn.minWorldLevel ?? 1;
  const maxWorldLevel = spawn.maxWorldLevel ?? Infinity;
  const minWave = spawn.minWave ?? 1;
  const maxWave = spawn.maxWave ?? Infinity;

  return (
    level >= worldLevel &&
    level <= maxWorldLevel &&
    level >= minWave &&
    level <= maxWave
  );
}

function selectVariantByWeight(
  variants: EnemyVariantDefinition[]
): EnemyVariantDefinition {
  if (variants.length === 0) {
    return regularZombieVariant;
  }

  const totalWeight = variants.reduce(
    (acc, variant) => acc + (variant.spawn.weight ?? 1),
    0
  );
  const target = Math.random() * totalWeight;
  let cumulative = 0;

  for (const variant of variants) {
    cumulative += variant.spawn.weight ?? 1;
    if (target <= cumulative) {
      return variant;
    }
  }

  return variants[variants.length - 1];
}

export function getZombieVariantForLevel(
  level: number
): EnemyVariantDefinition {
  const eligible =
    zombieVariants.filter((variant) => meetsSpawnCondition(variant, level)) ||
    [];

  if (eligible.length === 0) {
    return regularZombieVariant;
  }

  return selectVariantByWeight(eligible);
}
