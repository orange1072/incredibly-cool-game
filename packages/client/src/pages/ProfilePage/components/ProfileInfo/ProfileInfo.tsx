import { ProfileSVG, RemoveSVG, UploadSVG } from '@/assets/icons';
import styles from '../../styles.module.scss';
import { Button } from '@/components/Button';
import { useRef, useCallback, useState } from 'react';
import { useSelector } from '@/store/store';
import { MAX_AVATAR_SIZE } from '@/constants';
import { ERROR_MESSAGES } from '@/messages';
import { useUpdateUserAvatarMutation } from '@/api';
import { selectUser } from '@/store/slices/userSlice';

export const ProfileInfo = () => {
  const user = useSelector(selectUser);
  const [updateUserAvatar, { isLoading: avatarUploading, error, reset }] =
    useUpdateUserAvatarMutation();
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
    reset();
    setValidationError('');
  }, [reset]);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          setValidationError(ERROR_MESSAGES.AVATAR.INVALID_FILE_TYPE);
          return;
        }

        if (file.size > MAX_AVATAR_SIZE) {
          setValidationError(ERROR_MESSAGES.AVATAR.FILE_TOO_LARGE);
          return;
        }

        setValidationError('');
        await updateUserAvatar(file);
      }
    },
    [updateUserAvatar]
  );

  const handleRemoveAvatar = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    reset();
    setValidationError('');
  }, [reset]);

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
      {(validationError || error) && (
        <div className={styles.avatarError}>
          {validationError || ERROR_MESSAGES.AVATAR.UPLOAD_FAILED}
        </div>
      )}
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
  );
};
