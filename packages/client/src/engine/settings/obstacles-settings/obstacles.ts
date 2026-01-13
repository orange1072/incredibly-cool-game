import object3E from '../../../assets/obstacles/small-singles/object_3_e.png';
import object3N from '../../../assets/obstacles/small-singles/object_3_n.png';
import object4N from '../../../assets/obstacles/small-singles/object_4_n.png';
import streetLamp1W from '../../../assets/obstacles/small-singles/street_lamp_1_w.png';
import treeA1N from '../../../assets/obstacles/small-singles/tree_a1_n.png';
import treeA1S from '../../../assets/obstacles/small-singles/tree_a1_s.png';
import treeA1W from '../../../assets/obstacles/small-singles/tree_a1_w.png';
import car10S from '../../../assets/obstacles/big-singles/сar_10_s.png';
import car10W from '../../../assets/obstacles/big-singles/сar_10_w.png';
import car11W from '../../../assets/obstacles/big-singles/сar_11_w.png';
import car12E from '../../../assets/obstacles/big-singles/сar_12_e.png';

export const OBSTACLES = [
  'object3E',
  'object3N',
  'object4N',
  'streetLamp1W',
  'treeA1N',
  'treeA1S',
  'treeA1W',
  'car10S',
  'car10W',
  'car11W',
  'car12E',
];

export const SMALL_OBSTACLE_SIZE = {
  width: 128,
  height: 256,
};
export const BIG_OBSTACLE_SIZE = {
  width: 128,
  height: 256,
};

export type ObstaclePreset = {
  isBlocking: boolean;
  speedReducing: number;
  damaging: number;
  sprite?: string;
  isBig: boolean;
};

const OBSTACLE_PRESETS = {
  object3E: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: object3E,
    isBig: false,
  },
  object4N: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: object4N,
    isBig: false,
  },
  treeA1N: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: treeA1N,
    isBig: false,
  },
  treeA1S: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: treeA1S,
    isBig: false,
  },
  treeA1W: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: treeA1W,
    isBig: false,
  },
  object3N: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: object3N,
    isBig: false,
  },
  car10S: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: car10S,
    isBig: true,
  },
  car10W: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: car10W,
    isBig: true,
  },
  car11W: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: car11W,
    isBig: true,
  },
  car12E: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: car12E,
    isBig: true,
  },
  streetLamp1W: {
    isBlocking: false,
    speedReducing: 0.7,
    damaging: 5,
    sprite: streetLamp1W,
    isBig: false,
  },
  worldBorder: {
    isBlocking: true,
    speedReducing: 0,
    damaging: 0,
    sprite: undefined,
    isBig: false,
  },
  toxicPuddle: {
    isBlocking: false,
    speedReducing: 0,
    damaging: 0,
    sprite: undefined,
    isBig: false,
  },
} as unknown as Record<string, ObstaclePreset>;

export default OBSTACLE_PRESETS;
export type ObstaclePresetName = keyof typeof OBSTACLE_PRESETS;
