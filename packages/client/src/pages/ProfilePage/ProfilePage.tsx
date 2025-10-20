import { GuardSVG } from '@/assets/icons'
import styles from './styles.module.scss'
import { Button } from '@/components/Button'
import { ParticleBackground } from '@/components/ParticleBackground'
import { useState, useCallback } from 'react'
import { Input } from '@/components/Input'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileInfo } from './components/ProfileInfo'
import { ProfileStats } from './components/ProfileStats'
import { ChangePasswordModal } from './components/ChangePasswordModal'

export const ProfilePage = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const handleOpenPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true)
  }, [])

  const handleClosePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false)
  }, [])

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

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
      />
    </main>
  )
}
