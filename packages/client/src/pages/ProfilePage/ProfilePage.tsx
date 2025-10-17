import {
  AnalyticSVG,
  HeartSVG,
  ProfileSVG,
  RadiationSVG,
  RemoveSVG,
  UploadSVG,
  GuardSVG,
} from '@/assets/icons'
import styles from './styles.module.scss'
import { Button } from '@/components/Button'
import { ParticleBackground } from '@/components/ParticleBackground'
import { useMemo, memo } from 'react'
import { Input } from '@/components/Input'

const ProfileHeader = memo(() => (
  <div className={styles.top}>
    <h3 className={styles.title}>
      <span className={styles.icon}>
        <AnalyticSVG />
      </span>
      PERSONAL DATA ARCHIVE
    </h3>
    <p className={styles.subtitle}>Stalker Profile Management</p>
  </div>
))

const ProfileInfo = memo(() => {
  return (
    <div className={styles.info}>
      <div className={styles.avatar}>
        <ProfileSVG />
      </div>
      <div className={styles.buttonsGroup}>
        <Button size="sm" Icon={<UploadSVG />}>
          Upload Photo
        </Button>
        <Button size="sm" Icon={<RemoveSVG />} styleType="danger">
          Remove
        </Button>
      </div>
    </div>
  )
})

const ProfileStats = memo(() => {
  const stats = useMemo(
    () => [
      {
        label: 'Days Survived',
        value: 247,
        Icon: <HeartSVG />,
      },
      {
        label: 'Days Survived',
        value: 247,
        Icon: <RadiationSVG />,
      },
      {
        label: 'Days Survived',
        value: 247,
        Icon: <GuardSVG />,
      },
    ],
    []
  )

  return (
    <div className={styles.stats}>
      <div className={styles.statsHeader}>
        <AnalyticSVG className={styles.statsIcon} />
        <p className={styles.statsTitle}>Statistics</p>
      </div>
      {stats.map((stat, index) => (
        <div className={styles.stat} key={index}>
          <div className={styles.statIcon}>{stat.Icon}</div>
          <div className={styles.statValueGroup}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
})

ProfileHeader.displayName = 'ProfileHeader'
ProfileInfo.displayName = 'ProfileInfo'
ProfileStats.displayName = 'ProfileStats'

export const ProfilePage = () => {
  return (
    <main>
      <ParticleBackground />
      <section className={styles.profileSection}>
        <ProfileHeader />
        <div className={styles.content}>
          <div className={styles.profilePreview}>
            <ProfileInfo />
            <ProfileStats />
          </div>
          <form className={styles.profileSettings}>
            <h3 className={styles.title}>Identity Data</h3>
            <div className={styles.inputsGroup}>
              <Input
                label="First Name"
                name="name"
                type="text"
                placeholder="Name"
              />
              <Input
                label="Last Name"
                name="secondName"
                type="text"
                placeholder="Second Name"
              />
            </div>
            <Input
              label="Call Sign"
              name="username"
              type="text"
              placeholder="Username"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
            />
            <Input
              label="Phone"
              name="phoneNumber"
              type="phone"
              placeholder="Phone Number"
            />
            <Input
              label="Access Code"
              name="accessCode"
              type="password"
              placeholder="Access Code"
            />
            <Button
              className={styles.submitButton}
              size="md"
              Icon={<GuardSVG />}
            >
              Update Equipment
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
