import {
  PositionComponent,
  VelocityComponent,
  HealthComponent,
  CollisionComponent,
  EnemyComponent,
  SpriteComponent,
  AIComponent,
  AttackComponent,
} from '../../components';
import Entity from '../../core/Entity';
import { fatZombieBoss } from '../../settings/enemy-settings/bosses';

export class BossEntity extends Entity {
  constructor(x: number, y: number, level = 1) {
    super();

    const baseHp = fatZombieBoss.health.health.call(
      fatZombieBoss.health,
      level
    );
    const baseSpeed = fatZombieBoss.movement.speed + level * 3;
    const baseDamage = fatZombieBoss.damage.actualDamage.call(
      fatZombieBoss.damage,
      0,
      1
    );
    const attackProfile = fatZombieBoss.attack;

    this.addComponent(new PositionComponent({ x, y }));
    this.addComponent(new VelocityComponent({ dx: 0, dy: 0 }));
    this.addComponent(new HealthComponent({ hp: baseHp, maxHp: baseHp }));
    this.addComponent(
      new CollisionComponent({ radius: fatZombieBoss.collision.radius })
    );
    this.addComponent(
      new EnemyComponent({
        kind: fatZombieBoss.kind,
        xpReward: fatZombieBoss.xpReward,
        damage: baseDamage,
        speed: baseSpeed,
        aggroRange: fatZombieBoss.ai.aggroRange,
        attackRange: attackProfile.range,
        attackCooldown: attackProfile.cooldown,
      })
    );
    this.addComponent(
      new AIComponent({ state: fatZombieBoss.ai.startingValue })
    );
    this.addComponent(
      new AttackComponent({
        damage: baseDamage,
        cooldown: attackProfile.cooldown,
      })
    );
    this.addComponent(
      new SpriteComponent({
        name: fatZombieBoss.sprite.name,
        width: fatZombieBoss.sprite.width,
        height: fatZombieBoss.sprite.height,
        source: fatZombieBoss.sprite.source,
        columns: fatZombieBoss.sprite.columns ?? 1,
        rows: fatZombieBoss.sprite.rows ?? 1,
        frameDuration: fatZombieBoss.sprite.frameDuration ?? 100,
        scale: fatZombieBoss.sprite.scale ?? 1,
        padding: fatZombieBoss.sprite.padding,
      })
    );
  }
}

export default BossEntity;
