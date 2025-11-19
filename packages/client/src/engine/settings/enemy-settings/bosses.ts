import bossFuriousRunSprite from '../../../assets/enemies/bosses/boss-furious/run.png';
import bossJuggernautRunSprite from '../../../assets/enemies/bosses/boss-juggernaut/run.png';
import bossToxicRunSprite from '../../../assets/enemies/bosses/boss-toxic/run.png';
import bossArtilleryRunSprite from '../../../assets/enemies/bosses/boss-artillery/run.png';
import type {
  EnemyVariantDefinition,
  HealthProfile,
} from '../../../types/settings/enemy-settings.types';
import {
  baseBossSpawn,
  createBossSettings,
  fatZombieBossSettings,
} from './bosses/baseSettings';

const fatZombieBoss: EnemyVariantDefinition = {
  id: 'boss-fat',
  displayName: 'Плотоядный громила',
  description:
    'Классический босс-мутант с массивным телом и ударом сокрушающей силы.',
  tags: ['базовый', 'давление'],
  abilities: ['Высокий урон в ближнем бою', 'Сбалансированная скорость'],
  spawn: baseBossSpawn,
  settings: fatZombieBossSettings,
};

const furiousBoss: EnemyVariantDefinition = {
  id: 'boss-furious',
  displayName: 'Бешеный разрыватель',
  description:
    'Ставка на мобильность: сокращает дистанцию за секунды и не даёт отдышаться.',
  tags: ['скорость', 'агрессия'],
  abilities: ['Увеличенная скорость и радиус агрессии', 'Снижен урон'],
  spawn: { ...baseBossSpawn, weight: 0.9 },
  settings: createBossSettings({
    movement: { speed: 48 },
    ai: {
      aggroRange: 720,
      startingValue: 'idle',
    },
    damage: {
      ...fatZombieBossSettings.damage,
      baseValue: 32,
    },
    xpReward: 520,
    sprite: {
      ...fatZombieBossSettings.sprite,
      source: bossFuriousRunSprite,
    },
  }),
};

const juggernautBoss: EnemyVariantDefinition = {
  id: 'boss-juggernaut',
  displayName: 'Гниющий таран',
  description:
    'Выкладывается в живучесть: способен выдержать любой шквал огня.',
  tags: ['живучесть', 'контроль'],
  abilities: ['Высочайшее здоровье', 'Замедленная скорость атаки'],
  spawn: { ...baseBossSpawn, weight: 0.7 },
  settings: createBossSettings({
    health: {
      baseValue: 800,
      levelBonus: 220,
      health(this: HealthProfile, level: number, multiplier = 1) {
        return this.baseValue * multiplier + this.levelBonus * level;
      },
    },
    movement: { speed: 22 },
    attack: { cooldown: 3.1, range: 72 },
    xpReward: 580,
    skin: {
      color: 'rgba(175, 135, 90, 0.95)',
      healthBarColor: '#a36d2e',
    },
    sprite: {
      ...fatZombieBossSettings.sprite,
      source: bossJuggernautRunSprite,
      defaultColor: 'rgba(175, 135, 90, 0.95)',
    },
  }),
};

const toxicOverlord: EnemyVariantDefinition = {
  id: 'boss-toxic',
  displayName: 'Токсичный надзиратель',
  description:
    'Генерирует обширные токсичные лужи при каждом рывке и после гибели.',
  tags: ['контроль территории', 'ловушки'],
  abilities: [
    'Оставляет токсичные лужи при гибели',
    'Повышенное здоровье и радиус атаки',
  ],
  spawn: { ...baseBossSpawn, weight: 0.6, minWorldLevel: 1 },
  settings: createBossSettings({
    health: {
      baseValue: 650,
      levelBonus: 190,
      health(this: HealthProfile, level: number, multiplier = 1) {
        return this.baseValue * multiplier + this.levelBonus * level;
      },
    },
    attack: { range: 88, cooldown: 3 },
    xpReward: 620,
    sprite: {
      ...fatZombieBossSettings.sprite,
      source: bossToxicRunSprite,
      defaultColor: 'rgba(106, 200, 142, 0.95)',
    },
    skin: {
      color: 'rgba(106, 200, 142, 0.95)',
      healthBarColor: '#4ab876',
    },
  }),
};

const artilleryBoss: EnemyVariantDefinition = {
  id: 'boss-artillery',
  displayName: 'Осадный плеватель',
  description:
    'Предпочитает дистанционный бой, обстреливая игрока токсичными снарядами.',
  tags: ['дальний бой', 'давление'],
  abilities: [
    'Стреляет дальнобойными снарядами без самонаведения',
    'Сниженная скорость и здоровье',
  ],
  spawn: { ...baseBossSpawn, weight: 0.5, minWorldLevel: 1 },
  settings: createBossSettings({
    movement: { speed: 26 },
    attack: { range: 360, cooldown: 2.8 },
    damage: {
      ...fatZombieBossSettings.damage,
      baseValue: 28,
    },
    health: {
      baseValue: 540,
      levelBonus: 170,
      health(this: HealthProfile, level: number, multiplier = 1) {
        return this.baseValue * multiplier + this.levelBonus * level;
      },
    },
    xpReward: 650,
    sprite: {
      ...fatZombieBossSettings.sprite,
      source: bossArtilleryRunSprite,
      defaultColor: 'rgba(186, 120, 255, 0.95)',
    },
    skin: {
      color: 'rgba(186, 120, 255, 0.95)',
      healthBarColor: '#9d63ff',
    },
  }),
};

export const bossVariants: EnemyVariantDefinition[] = [
  fatZombieBoss,
  furiousBoss,
  juggernautBoss,
  toxicOverlord,
  artilleryBoss,
];

export const defaultBoss = fatZombieBoss.settings;

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
    return fatZombieBoss;
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

export function getBossVariantForLevel(level: number): EnemyVariantDefinition {
  const eligible =
    bossVariants.filter((variant) => meetsSpawnCondition(variant, level)) || [];

  if (eligible.length === 0) {
    return fatZombieBoss;
  }

  return selectVariantByWeight(eligible);
}
