import './client.d';

// Реэкспортируем API_URL и SERVER_HOST из отдельных файлов для избежания циклических зависимостей
export { API_URL } from './config/api';
export { SERVER_HOST } from './config/server';

import { HeartSVG, RadiationSVG, GuardSVG } from '@/assets/icons';
import { MainPage } from '@/pages/MainPage';
import { DemoPage } from '@/pages/DemoPage';
import { SigninPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { Error404Page } from '@/pages/Error404Page';
import { Error500Page } from '@/pages/Error500Page';
import { RouteObject } from 'react-router';
import { GameMenuPage } from '@/pages/GameMenuPage';
import { GamePlayPage } from '@/pages/GamePlayPage';
import { GameOverPage } from '@/pages/GameOverPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LeaderboardPage } from '@/pages/Leaderboard';
import { ForumPage } from '@/pages/ForumPage';

export const ROUTES: RouteObject[] = [
  { path: '/', Component: MainPage },
  { path: '/demo', Component: DemoPage },
  { path: '/signin', Component: SigninPage },
  { path: '/signup', Component: SignupPage },
  { path: '/error404', Component: Error404Page },
  { path: '/error500', Component: Error500Page },
  { path: '/game-menu', Component: GameMenuPage },
  { path: '/game-play', Component: GamePlayPage },
  { path: '/game-over', Component: GameOverPage },
  { path: '/profile', Component: ProfilePage },
  { path: '/leaderboard', Component: LeaderboardPage },
  { path: '/forum', Component: ForumPage },
  { path: '*', Component: Error404Page },
];

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
