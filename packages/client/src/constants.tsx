import './client.d';

// Реэкспортируем API_URL и SERVER_HOST из отдельных файлов для избежания циклических зависимостей
export { API_URL } from './config/api';
export { SERVER_HOST } from './config/server';

import { HeartSVG, RadiationSVG, GuardSVG } from '@/assets/icons';

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const PROFILE_STATS = [
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
];

export const ERROR_MESSAGES = {
  AVATAR: {
    INVALID_FILE_TYPE: 'Please upload an image file',
    FILE_TOO_LARGE: 'File size should not exceed 5MB',
    UPLOAD_FAILED: 'Failed to upload avatar. Please try again.',
  },
  PASSWORD: {
    ALL_FIELDS_REQUIRED: 'All fields are required',
    PASSWORD_TOO_SHORT: 'New password must be at least 6 characters',
    PASSWORDS_DO_NOT_MATCH: 'New passwords do not match',
    CHANGE_FAILED:
      'Failed to change password. Please check your current password.',
  },
};
