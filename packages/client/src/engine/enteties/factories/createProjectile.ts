import ProjectileEntity from '../entities/ProjectileEntity';
import { PositionComponent } from '../../components';

export function createProjectile(
  targetPos: PositionComponent,
  sourcePos: PositionComponent,
  sourceId: string,
  damage: number,
  speed?: number
) {
  return new ProjectileEntity(targetPos, sourcePos, sourceId, damage, speed);
}

export default createProjectile;
