import { AnalyticSVG } from '@/assets/icons'
import styles from '../../styles.module.scss'
import { PROFILE_STATS } from '@/constants'

export const ProfileStats = () => {
  return (
    <div className={styles.stats}>
      <div className={styles.statsHeader}>
        <AnalyticSVG className={styles.statsIcon} />
        <p className={styles.statsTitle}>Statistics</p>
      </div>
      <ul>
        {PROFILE_STATS.map((stat, index) => (
          <li className={styles.stat} key={index}>
            <div className={styles.statIcon}>{stat.Icon}</div>
            <div className={styles.statValueGroup}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
