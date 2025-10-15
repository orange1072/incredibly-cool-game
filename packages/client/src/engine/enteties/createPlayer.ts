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
      damage: playerSettings.damage.baseValue,
      cooldown: 0.35,
    })
  )
  player.addComponent(
    new HealthComponent({
      hp: playerSettings.health.baseValue,
      maxHp: playerSettings.health.baseValue,
    })
  )
  player.addComponent(new CollisionComponent({ radius: 12 }))
  player.addComponent(new ExperienceComponent())
  player.addComponent(
    new SpriteComponent({
      name: playerSettings.sprite.name,
      width: playerSettings.sprite.width,
      height: playerSettings.sprite.height,
      source: playerSettings.sprite.source,
      scale: playerSettings.sprite.scale,
      frameDuration: playerSettings.sprite.frameDuration,
      columns: playerSettings.sprite.columns,
      rows: playerSettings.sprite.rows,
    })
  )
  return player
}
