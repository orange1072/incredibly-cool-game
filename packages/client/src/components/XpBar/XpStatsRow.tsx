import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  getMissionProgress,
  getPlayerState,
  getWorldStats,
} from '../../slices/game'

export const XpStatsRow = () => {
  const player = useSelector(getPlayerState)
  const world = useSelector(getWorldStats)
  const mission = useSelector(getMissionProgress)

  const items = useMemo(() => {
    const waveTarget = Math.max(1, mission.waveSize)
    const remaining = Math.max(0, mission.amountOfEnemiesInWave)
    const clearedInWave = Math.min(waveTarget, waveTarget - remaining)

    return [
      {
        label: 'Игрок',
        value: `ур. ${player.level}`,
      },
      {
        label: 'Мир',
        value: `ур. ${world.level} (${world.killProgress}/${world.nextLevelThreshold})`,
      },
      {
        label: 'Волна',
        value: `#${Math.max(mission.wave, 1)} · ${clearedInWave}/${waveTarget}`,
      },
    ]
  }, [
    mission.amountOfEnemiesInWave,
    mission.wave,
    mission.waveSize,
    player.level,
    world.killProgress,
    world.level,
    world.nextLevelThreshold,
  ])

  return (
    <div className="xp-bar__stats-row">
      {items.map((item) => (
        <div key={item.label} className="xp-bar__stats-item">
          <span className="xp-bar__stats-label">{item.label}</span>
          <span className="xp-bar__stats-value">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
