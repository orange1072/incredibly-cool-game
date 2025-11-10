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
import { defaultBoss } from '../../settings/enemy-settings/bosses';
import type { EnemyVariantDefinition } from '../../../types/settings/enemy-settings.types';
import EnemyProfileComponent from '../../components/EnemyProfileComponent';
import EnemyRangedAttackComponent from '../../components/EnemyRangedAttackComponent';

class BossEntity extends Entity {
  constructor(
    x: number,
    y: number,
    level = 1,
    variant?: EnemyVariantDefinition
  ) {
    super();

    const bossSettings = variant?.settings ?? defaultBoss;
    const baseHp = bossSettings.health.health.call(bossSettings.health, level);
    const baseSpeed = bossSettings.movement.speed + level * 3;
    const baseDamage = bossSettings.damage.actualDamage.call(
      bossSettings.damage,
      0,
      1
    );
    const attackProfile = bossSettings.attack;
    const isRanged = variant?.id === 'boss-artillery';
    const meleeDamage = isRanged ? 0 : baseDamage;

    this.addComponent(new PositionComponent({ x, y }))
      .addComponent(new VelocityComponent({ dx: 0, dy: 0 }))
      .addComponent(new HealthComponent({ hp: baseHp, maxHp: baseHp }))
      .addComponent(
        new CollisionComponent({ radius: bossSettings.collision.radius })
      )
      .addComponent(
        new EnemyComponent({
          kind: bossSettings.kind,
          xpReward: bossSettings.xpReward,
          damage: meleeDamage,
          speed: baseSpeed,
          aggroRange: bossSettings.ai.aggroRange,
          attackRange: attackProfile.range,
          attackCooldown: attackProfile.cooldown,
        })
      )
      .addComponent(new AIComponent({ state: bossSettings.ai.startingValue }))
      .addComponent(
        new AttackComponent({
          damage: meleeDamage,
          cooldown: attackProfile.cooldown,
        })
      )
      .addComponent(
        new SpriteComponent({
          name: bossSettings.sprite.name,
          width: bossSettings.sprite.width,
          height: bossSettings.sprite.height,
          source: bossSettings.sprite.source,
          columns: bossSettings.sprite.columns ?? 1,
          rows: bossSettings.sprite.rows ?? 1,
          frameDuration: bossSettings.sprite.frameDuration ?? 100,
          scale: bossSettings.sprite.scale ?? 1,
          padding: bossSettings.sprite.padding,
          defaultColor: bossSettings.sprite.defaultColor,
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
          projectileDamage: baseDamage,
          projectileSpeed: 380,
        })
      );
    }
  }
}

export default BossEntity;
