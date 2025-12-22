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
