import ProjectileEntity from '../entities/ProjectileEntity';
import { PositionComponent } from '../../components';

export function createProjectile(
  targetPos: PositionComponent,
  sourcePos: PositionComponent,
  sourceId: string,
  damage: number
) {
  return ProjectileEntity.create(targetPos, sourcePos, sourceId, damage);
}

export default createProjectile;
