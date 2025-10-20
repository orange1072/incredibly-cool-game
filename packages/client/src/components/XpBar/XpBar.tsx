import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getPlayerState } from '../../slices/game'
import { XpStatsRow } from './XpStatsRow'

export const XpBar = () => {
  const { level, xp, xpToNext } = useSelector(getPlayerState)

  const { progressPercent, progressLabel } = useMemo(() => {
    if (!xpToNext || xpToNext <= 0) {
      return {
        progressPercent: 0,
        progressLabel: '0%',
      }
    }
    const ratio = Math.max(0, Math.min(1, xp / xpToNext))
    const percent = Math.round(ratio * 100)
    return {
      progressPercent: percent,
      progressLabel: `${percent}%`,
    }
  }, [xp, xpToNext])

  return (
    <div className="xp-bar">
      <XpStatsRow />
      <div className="xp-bar__label">
        Уровень {level} · {Math.floor(xp)} / {xpToNext}
      </div>
      <div className="xp-bar__track">
        <div
          className="xp-bar__fill"
          style={{ width: `${progressPercent}%` }}
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="xp-bar__progress">{progressLabel}</span>
        </div>
      </div>
    </div>
  )
}
