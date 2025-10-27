import { GuardSVG } from '@/assets/icons';
import styles from '../../styles.module.scss';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { useState, useCallback, FormEvent } from 'react';
import { ERROR_MESSAGES } from '@/messages';
import { useChangePasswordMutation } from '@/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
}: ChangePasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [changePassword, { isLoading: passwordChanging }] =
    useChangePasswordMutation();

  const handleClose = useCallback(() => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  }, [onClose]);

  const handlePasswordSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError('');

      if (!oldPassword || !newPassword || !confirmPassword) {
        setError(ERROR_MESSAGES.PASSWORD.ALL_FIELDS_REQUIRED);
        return;
      }

      if (newPassword.length < 6) {
        setError(ERROR_MESSAGES.PASSWORD.PASSWORD_TOO_SHORT);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError(ERROR_MESSAGES.PASSWORD.PASSWORDS_DO_NOT_MATCH);
        return;
      }

      try {
        await changePassword({ oldPassword, newPassword }).unwrap();
        handleClose();
      } catch (err) {
        setError(ERROR_MESSAGES.PASSWORD.CHANGE_FAILED);
      }
    },
    [oldPassword, newPassword, confirmPassword, changePassword, handleClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="CHANGE ACCESS CODE">
      <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
        <p className={styles.passwordDescription}>
          Enter your current access code and create a new one. The new code must
          be at least 6 characters long.
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
            onClick={handleClose}
            disabled={passwordChanging}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
