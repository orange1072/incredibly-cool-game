import {
  COMPONENT_TYPES,
  type IEntity,
  type IPureDataComponent,
  type ProjectileComponentState,
} from '../../types/engine.types';

const DEFAULT_PROJECTILE_DAMAGE = 10;
const DEFAULT_PROJECTILE_SOURCE_ID = '';
const DEFAULT_PROJECTILE_SPEED = 300;
const DEFAULT_PROJECTILE_LIFETIME = 3;
const DEFAULT_PROJECTILE_KIND: NonNullable<ProjectileComponentState['kind']> =
  'bullet';

class ProjectileComponent
  implements IPureDataComponent, Required<ProjectileComponentState>
{
  type = COMPONENT_TYPES.projectile;
  entity!: IEntity;
  damage: number;
  sourceId: string;
  speed: number;
  lifetime: number;
  kind: NonNullable<ProjectileComponentState['kind']>;

  constructor({
    damage = DEFAULT_PROJECTILE_DAMAGE,
    sourceId = DEFAULT_PROJECTILE_SOURCE_ID,
    speed = DEFAULT_PROJECTILE_SPEED,
    lifetime = DEFAULT_PROJECTILE_LIFETIME,
    kind = DEFAULT_PROJECTILE_KIND,
  }: ProjectileComponentState = {}) {
    this.damage = damage;
    this.sourceId = sourceId;
    this.speed = speed;
    this.lifetime = lifetime;
    this.kind = kind;
  }
}

export default ProjectileComponent;
