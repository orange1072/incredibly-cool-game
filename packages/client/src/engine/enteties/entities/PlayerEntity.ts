import {
  AttackComponent,
  CollisionComponent,
  ExperienceComponent,
  HealthComponent,
  PlayerControlComponent,
  PositionComponent,
  SpriteComponent,
  VelocityComponent,
  PassiveBonusesComponent,
} from '../../components';
import Entity from '../../core/Entity';
import { player as playerSettings } from '../../settings/player-settings/player';
import { DEFAULT_PLAYER_SPEED } from '../../systems/consts/player-control';

class PlayerEntity extends Entity {
  constructor(worldBoundsWidth: number, worldBoundsHeight: number) {
    super();

    const baseLevel = playerSettings.baseLevel;
    const baseHp = playerSettings.health.health.call(
      playerSettings.health,
      baseLevel
    );
    const baseDamage = playerSettings.damage.actualDamage.call(
      playerSettings.damage,
      0,
      1
    );
    const baseAttackCooldown = 0.35;

    this.addComponent(
      new PositionComponent({
        x: worldBoundsWidth / 2,
        y: worldBoundsHeight / 2,
      })
    )
      .addComponent(new VelocityComponent({ dx: 0, dy: 0 }))
      .addComponent(new PlayerControlComponent())
      .addComponent(
        new AttackComponent({
          damage: baseDamage,
          cooldown: baseAttackCooldown,
        })
      )
      .addComponent(
        new HealthComponent({
          hp: baseHp,
          maxHp: baseHp,
        })
      )
      .addComponent(new CollisionComponent({ radius: 12 }))
      .addComponent(new ExperienceComponent({ level: baseLevel }))
      .addComponent(
        new PassiveBonusesComponent({
          baseMovementSpeed: DEFAULT_PLAYER_SPEED,
          baseDamage,
          baseAttackCooldown,
        })
      )
      .addComponent(
        new SpriteComponent({
          name: playerSettings.sprite.name,
          width: playerSettings.sprite.width,
          height: playerSettings.sprite.height,
          source: playerSettings.sprite.source,
          scale: playerSettings.sprite.scale ?? 1,
          frameDuration: playerSettings.sprite.frameDuration ?? 100,
          columns: playerSettings.sprite.columns ?? 1,
          rows: playerSettings.sprite.rows ?? 1,
          padding: playerSettings.sprite.padding,
        })
      );
  }
}

export default PlayerEntity;
