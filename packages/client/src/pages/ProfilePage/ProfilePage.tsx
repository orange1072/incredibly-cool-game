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
import { useMemo, memo, useRef, useCallback } from 'react'
import { Input } from '@/components/Input'
import { useDispatch, useSelector } from '@/store'
import { updateUserAvatarThunk, selectUser } from '@/slices/userSlice'

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
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const avatarUploading = useSelector((state) => state.user.avatarUploading)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          console.error('Please upload an image file')
          return
        }

        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
          console.error('File size should not exceed 5MB')
          return
        }

        dispatch(updateUserAvatarThunk(file))
      }
    },
    [dispatch]
  )

  const handleRemoveAvatar = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className={styles.info}>
      <div className={styles.avatar}>
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Profile avatar"
            className={styles.avatarImage}
          />
        ) : (
          <ProfileSVG />
        )}
      </div>
      <div className={styles.buttonsGroup}>
        <Button
          size="sm"
          Icon={<UploadSVG />}
          onClick={handleUploadClick}
          disabled={avatarUploading}
        >
          {avatarUploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
        {user?.avatar && (
          <Button
            size="sm"
            Icon={<RemoveSVG />}
            styleType="danger"
            onClick={handleRemoveAvatar}
            disabled={avatarUploading}
          >
            Remove
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.hiddenInput}
        disabled={avatarUploading}
      />
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
