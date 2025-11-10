const OBSTACLE_PRESETS = {
  wall: { isBlocking: true, speedReducing: 0, damaging: 0 },
  rock: { isBlocking: true, speedReducing: 0, damaging: 0 },
  barricade: { isBlocking: true, speedReducing: 0, damaging: 0 },
  goo: { isBlocking: false, speedReducing: 0.5, damaging: 0 },
  barbWire: { isBlocking: false, speedReducing: 0.7, damaging: 5 },
  toxicPuddle: { isBlocking: true, speedReducing: 0.8, damaging: 8 },
} as const;

export default OBSTACLE_PRESETS;
export type ObstaclePresetName = keyof typeof OBSTACLE_PRESETS;
