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
import { useMemo, memo, useRef, useCallback, useState, FormEvent } from 'react'
import { Input } from '@/components/Input'
import { useDispatch, useSelector } from '@/store'
import {
  updateUserAvatarThunk,
  changePasswordThunk,
  selectUser,
} from '@/slices/userSlice'
import { Modal } from '@/components/Modal'

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
  const [avatarError, setAvatarError] = useState('')
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const avatarUploading = useSelector((state) => state.user.avatarUploading)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
    setAvatarError('')
  }, [])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          setAvatarError('Please upload an image file')
          return
        }

        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
          setAvatarError('File size should not exceed 5MB')
          return
        }

        try {
          await dispatch(updateUserAvatarThunk(file)).unwrap()
          setAvatarError('')
        } catch (err) {
          console.error('Avatar upload error:', err)
          setAvatarError('Failed to upload avatar. Please try again.')
        }
      }
    },
    [dispatch]
  )

  const handleRemoveAvatar = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setAvatarError('')
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
      {avatarError && <div className={styles.avatarError}>{avatarError}</div>}
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
  const dispatch = useDispatch()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const passwordChanging = useSelector((state) => state.user.passwordChanging)

  const handleOpenPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true)
  }, [])

  const handleClosePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }, [])

  const handlePasswordSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setError('')

      if (!oldPassword || !newPassword || !confirmPassword) {
        setError('All fields are required')
        return
      }

      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters')
        return
      }

      if (newPassword !== confirmPassword) {
        setError('New passwords do not match')
        return
      }

      try {
        await dispatch(
          changePasswordThunk({ oldPassword, newPassword })
        ).unwrap()
        handleClosePasswordModal()
      } catch (err) {
        setError(
          'Failed to change password. Please check your current password.'
        )
      }
    },
    [
      oldPassword,
      newPassword,
      confirmPassword,
      dispatch,
      handleClosePasswordModal,
    ]
  )

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
            <div className={styles.inputsGroup}>
              <Input
                label="Access Code"
                name="accessCode"
                type="password"
                placeholder="Access Code"
                value="123456"
                disabled
              />
              <Button
                className={styles.changePasswordButton}
                size="sm"
                onClick={handleOpenPasswordModal}
                type="button"
              >
                Change Password
              </Button>
            </div>
            <Button size="md" Icon={<GuardSVG />}>
              Update Equipment
            </Button>
          </form>
        </div>
      </section>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        title="CHANGE ACCESS CODE"
      >
        <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
          <p className={styles.passwordDescription}>
            Enter your current access code and create a new one. The new code
            must be at least 6 characters long.
          </p>

          {error && <div className={styles.passwordError}>{error}</div>}

          <div className={styles.passwordInputsGroup}>
            <Input
              label="Current Access Code"
              name="oldPassword"
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <Input
              label="New Access Code"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Access Code"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.passwordButtonsGroup}>
            <Button
              type="submit"
              size="md"
              Icon={<GuardSVG />}
              disabled={passwordChanging}
            >
              {passwordChanging ? 'Updating...' : 'Update Code'}
            </Button>
            <Button
              type="button"
              size="md"
              styleType="danger"
              onClick={handleClosePasswordModal}
              disabled={passwordChanging}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  )
}
