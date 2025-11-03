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
import { regularZombie } from '../../settings/enemy-settings/zombie';

class ZombieEntity extends Entity {
  constructor(x: number, y: number, level = 1) {
    super();

    const damageProfile = regularZombie.damage;
    const attackProfile = regularZombie.attack;
    const zombieHealth = regularZombie.health.health(level);
    const movementSpeed = regularZombie.movement.speed;
    const collisionRadius = regularZombie.collision.radius;
    const aiState = regularZombie.ai.startingValue;
    const aggroRange = regularZombie.ai.aggroRange;
    const attackDamage = damageProfile.actualDamage.call(damageProfile, 0, 1);
    const xpReward = regularZombie.xpReward;
    const sprite = regularZombie.sprite;

    this.addComponent(new PositionComponent({ x, y }))
      .addComponent(new VelocityComponent({ dx: 0, dy: 0 }))
      .addComponent(
        new HealthComponent({ hp: zombieHealth, maxHp: zombieHealth })
      )
      .addComponent(new CollisionComponent({ radius: collisionRadius }))
      .addComponent(
        new EnemyComponent({
          kind: regularZombie.kind,
          xpReward,
          damage: attackDamage,
          speed: movementSpeed,
          aggroRange,
          attackRange: attackProfile.range,
          attackCooldown: attackProfile.cooldown,
        })
      )
      .addComponent(new AIComponent({ state: aiState }))
      .addComponent(
        new AttackComponent({
          damage: attackDamage,
          cooldown: attackProfile.cooldown,
        })
      )
      .addComponent(
        new SpriteComponent({
          name: sprite.name,
          width: sprite.width,
          height: sprite.height,
          source: sprite.source,
          scale: sprite.scale ?? 1,
          frameDuration: sprite.frameDuration ?? 100,
          columns: sprite.columns ?? 1,
          rows: sprite.rows ?? 1,
          padding: sprite.padding,
        })
      );
  }
}

export default ZombieEntity;
