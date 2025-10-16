import {
  AttackComponent,
  CollisionComponent,
  ExperienceComponent,
  HealthComponent,
  PlayerControlComponent,
  PositionComponent,
  SpriteComponent,
  VelocityComponent,
} from '../core/Components'
import Entity from '../core/Entity'
import { player as playerSettings } from '../settings/player-settings/player'

export function createPlayer(
  worldBoundsWidth: number,
  worldBoundsHeight: number
) {
  const player = new Entity()
  const baseLevel = playerSettings.baseLevel
  const baseHp = playerSettings.health.health.call(
    playerSettings.health,
    baseLevel
  )
  const baseDamage = playerSettings.damage.actualDamage.call(
    playerSettings.damage,
    0,
    1
  )
  player.addComponent(
    new PositionComponent({
      x: worldBoundsWidth / 2,
      y: worldBoundsHeight / 2,
    })
  )

  player.addComponent(new VelocityComponent({ dx: 0, dy: 0 }))
  player.addComponent(new PlayerControlComponent())
  player.addComponent(
    new AttackComponent({
      damage: baseDamage,
      cooldown: 0.35,
    })
  )
  player.addComponent(
    new HealthComponent({
      hp: baseHp,
      maxHp: baseHp,
    })
  )
  player.addComponent(new CollisionComponent({ radius: 12 }))
  player.addComponent(new ExperienceComponent({ level: baseLevel }))
  player.addComponent(
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
  )
  return player
}
