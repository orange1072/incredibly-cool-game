import { GuardSVG } from '@/assets/icons';
import styles from './styles.module.scss';
import { Button } from '@/components/Button';
import { ParticleBackground } from '@/components/ParticleBackground';
import { useState, useCallback } from 'react';
import { Input } from '@/components/Input';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileStats } from './components/ProfileStats';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { useSelector } from '@/store/store';
import { selectUser, selectUserLoading } from '@/store/slices/userSlice';

export const ProfilePage = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const user = useSelector(selectUser);
  const handleOpenPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true);
  }, []);
  const isLoading = useSelector(selectUserLoading);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const handleClosePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false);
  }, []);
  console.log('userData', user);
  return (
    isLoading && (
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
                  value={user?.first_name || ''}
                />
                <Input
                  label="Last Name"
                  name="secondName"
                  type="text"
                  placeholder="Second Name"
                  value={user?.second_name || ''}
                />
              </div>
              <Input
                label="Call Sign"
                name="username"
                type="text"
                placeholder="Username"
                value={user?.login || ''}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Email"
                value={user?.email || ''}
              />
              <Input
                label="Phone"
                name="phoneNumber"
                type="phone"
                placeholder="Phone Number"
                value={user?.phone || ''}
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
  );
};
