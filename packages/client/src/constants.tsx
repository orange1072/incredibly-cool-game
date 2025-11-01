import './client.d';
import { HeartSVG, RadiationSVG, GuardSVG } from '@/assets/icons';

export const SERVER_HOST =
  typeof window === 'undefined'
    ? __INTERNAL_SERVER_URL__
    : __EXTERNAL_SERVER_URL__;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Route paths
export const ROUTES = {
  HOME: '/',
  DEMO: '/demo',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  GAME_MENU: '/game-menu',
  GAME_PLAY: '/game-play',
  GAME_OVER: '/game-over',
  LEADERBOARD: '/leaderboard',
  FORUM: '/forum',
  ERROR_404: '/error404',
  ERROR_500: '/error500',
} as const;

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
