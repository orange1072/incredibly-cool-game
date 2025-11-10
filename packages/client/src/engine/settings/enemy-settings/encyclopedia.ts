import { bossVariants } from './bosses';
import { zombieVariants } from './zombie';

export const ENEMY_ENCYCLOPEDIA = {
  zombies: zombieVariants,
  bosses: bossVariants,
};

export type EnemyCatalogue = typeof ENEMY_ENCYCLOPEDIA;

export default ENEMY_ENCYCLOPEDIA;
