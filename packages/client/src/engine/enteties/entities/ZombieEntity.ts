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
import type { EnemyVariantDefinition } from '../../../types/settings/enemy-settings.types';
import EnemyProfileComponent from '../../components/EnemyProfileComponent';
import EnemyRangedAttackComponent from '../../components/EnemyRangedAttackComponent';

class ZombieEntity extends Entity {
  constructor(
    x: number,
    y: number,
    level = 1,
    variant?: EnemyVariantDefinition
  ) {
    super();

    const zombieSettings = variant?.settings ?? regularZombie;
    const damageProfile = zombieSettings.damage;
    const attackProfile = zombieSettings.attack;
    const zombieHealth = zombieSettings.health.health(level);
    const movementSpeed = zombieSettings.movement.speed;
    const collisionRadius = zombieSettings.collision.radius;
    const aiState = zombieSettings.ai.startingValue;
    const aggroRange = zombieSettings.ai.aggroRange;
    const attackDamage = damageProfile.actualDamage.call(damageProfile, 0, 1);
    const isRanged = variant?.id === 'zombie-gunner';
    const meleeDamage = isRanged ? 0 : attackDamage;
    const xpReward = zombieSettings.xpReward;
    const sprite = zombieSettings.sprite;

    this.addComponent(new PositionComponent({ x, y }))
      .addComponent(new VelocityComponent({ dx: 0, dy: 0 }))
      .addComponent(
        new HealthComponent({ hp: zombieHealth, maxHp: zombieHealth })
      )
      .addComponent(new CollisionComponent({ radius: collisionRadius }))
      .addComponent(
        new EnemyComponent({
          kind: zombieSettings.kind,
          xpReward,
          damage: meleeDamage,
          speed: movementSpeed,
          aggroRange,
          attackRange: attackProfile.range,
          attackCooldown: attackProfile.cooldown,
        })
      )
      .addComponent(new AIComponent({ state: aiState }))
      .addComponent(
        new AttackComponent({
          damage: meleeDamage,
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
          defaultColor: sprite.defaultColor,
        })
      );

    if (variant) {
      this.addComponent(
        new EnemyProfileComponent({
          variantId: variant.id,
          displayName: variant.displayName,
          description: variant.description,
          tags: variant.tags,
          abilities: variant.abilities,
          spawn: variant.spawn,
        })
      );
    }

    if (isRanged) {
      this.addComponent(
        new EnemyRangedAttackComponent({
          cooldown: attackProfile.cooldown,
          range: attackProfile.range,
          projectileDamage: attackDamage,
          projectileSpeed: 420,
        })
      );
    }
  }
}

export default ZombieEntity;
