import { COMPONENT_TYPES, ISystem } from '../../types/engine.types';
import { AI_STATES } from '../../types/component.types';
import {
  AIComponent,
  PositionComponent,
  VelocityComponent,
  HealthComponent,
  AttackComponent,
  EnemyComponent,
  DamageComponent,
} from '../components';
import World from '../core/World';
import Entity from '../core/Entity';
import Logger from '../infrastructure/Logger';
import { getProximity, calculateUnitDirection } from './helpers/calculations';

const DEFAULT_CHASE_DISTANCE = 600;
const DEFAULT_ATTACK_DISTANCE = 40;
const DEFAULT_MOVE_SPEED = 50;
const ZERO_HEALTH = 0;
const ZERO_VELOCITY = 0;
const ZERO_DISTANCE = 0;
const ZERO_COOLDOWN = 0;
const MIN_DISTANCE = 0.0001;

class AISystem implements ISystem {
  private logger = new Logger('AISystem', 'warn');

  update(world: World, dt: number): void {
    const player = world.query(
      COMPONENT_TYPES.playerControl,
      COMPONENT_TYPES.position
    )[0];
    if (!player) return;

    const playerPos = player.getComponent<PositionComponent>(
      COMPONENT_TYPES.position
    );
    const playerHealth = player.getComponent<HealthComponent>(
      COMPONENT_TYPES.health
    );
    if (!playerPos || !playerHealth || playerHealth.hp <= ZERO_HEALTH) return;

    const enemies = world.query(
      COMPONENT_TYPES.ai,
      COMPONENT_TYPES.position,
      COMPONENT_TYPES.velocity,
      COMPONENT_TYPES.enemy
    );

    for (const e of enemies) {
      const ai = e.getComponent<AIComponent>(COMPONENT_TYPES.ai);
      const pos = e.getComponent<PositionComponent>(COMPONENT_TYPES.position);
      const vel = e.getComponent<VelocityComponent>(COMPONENT_TYPES.velocity);
      const health = e.getComponent<HealthComponent>(COMPONENT_TYPES.health);
      const attack = e.getComponent<AttackComponent>(COMPONENT_TYPES.attack);
      const enemy = e.getComponent<EnemyComponent>(COMPONENT_TYPES.enemy);

      if (!ai || !pos || !vel || !health || !enemy) continue;

      if (health.hp <= ZERO_HEALTH) {
        vel.dx = vel.dy = ZERO_VELOCITY;
        ai.state = AI_STATES.dead;
        continue;
      }

      const dx = getProximity(playerPos.x, pos.x);
      const dy = getProximity(playerPos.y, pos.y);
      const dist = Math.hypot(dx, dy);
      const chaseDistance = enemy.aggroRange ?? DEFAULT_CHASE_DISTANCE;
      const attackDistance = enemy.attackRange ?? DEFAULT_ATTACK_DISTANCE;
      const moveSpeed = enemy.speed ?? DEFAULT_MOVE_SPEED;

      if (attack) {
        attack.cooldownTimer = Math.max(
          attack.cooldownTimer - dt,
          ZERO_COOLDOWN
        );
      }

      if (dist > chaseDistance) {
        ai.state = AI_STATES.idle;
        vel.dx = vel.dy = ZERO_VELOCITY;
      } else if (dist > attackDistance) {
        ai.state = AI_STATES.chase;
        const effectiveDist = dist === ZERO_DISTANCE ? MIN_DISTANCE : dist;
        const normX = calculateUnitDirection(dx, effectiveDist);
        const normY = calculateUnitDirection(dy, effectiveDist);
        vel.dx = normX * moveSpeed;
        vel.dy = normY * moveSpeed;
      } else {
        ai.state = AI_STATES.attack;
        vel.dx = vel.dy = ZERO_VELOCITY;
        if (attack && attack.cooldownTimer <= ZERO_COOLDOWN) {
          this.applyDamage(player, enemy.damage ?? attack.damage, e.id, attack);
        }
      }

      this.logger.debug(`${e.id} → ${ai.state}`, { dist });
    }
  }

  private applyDamage(
    target: Entity,
    amount: number,
    sourceId: string,
    attack: AttackComponent
  ) {
    const existing = target.getComponent<DamageComponent>(
      COMPONENT_TYPES.damage
    );
    if (existing) {
      existing.amount += amount;
      existing.sourceId = sourceId;
    } else {
      target.addComponent(new DamageComponent({ amount, sourceId }));
    }

    attack.cooldownTimer = attack.cooldown;
  }
}

export default AISystem;
