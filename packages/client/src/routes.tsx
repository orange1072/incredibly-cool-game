import ProtectedRoute from './layouts/ProtectedRoute';
import RootRoute from './layouts/RootRoute';
import { Error500Page } from './pages/Error500Page';
import { GameMenuPage } from './pages/GameMenuPage';
import { GameOverPage } from './pages/GameOverPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { LeaderboardPage } from './pages/Leaderboard';
import { MainPage } from './pages/MainPage';
import { ProfilePage } from './pages/ProfilePage';
import PublicRoute from './layouts/PublicRoute';
import { DemoPage } from './pages/DemoPage';
import { SigninPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Error404Page } from './pages/Error404Page';

export type PageInitContext = {
  clientToken?: string;
};

export const ROUTE_PATHS = {
  root: '/',
  demo: '/demo',
  signin: '/signin',
  signup: '/signup',
  error404: '/error404',
  error500: '/error500',
  gameMenu: '/game-menu',
  gamePlay: '/game-play',
  gameOver: '/game-over',
  profile: '/profile',
  leaderboard: '/leaderboard',
} as const;

export const routes = [
  {
    path: ROUTE_PATHS.root,
    Component: RootRoute,
    children: [
      {
        Component: PublicRoute,
        children: [
          { path: ROUTE_PATHS.root, Component: MainPage },
          { path: ROUTE_PATHS.demo, Component: DemoPage },
          { path: ROUTE_PATHS.signin, Component: SigninPage },
          { path: ROUTE_PATHS.signup, Component: SignupPage },
          { path: ROUTE_PATHS.error404, Component: Error404Page },
          { path: ROUTE_PATHS.error500, Component: Error500Page },
          { path: '*', Component: Error404Page },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          { path: ROUTE_PATHS.gameMenu, Component: GameMenuPage },
          { path: ROUTE_PATHS.gamePlay, Component: GamePlayPage },
          { path: ROUTE_PATHS.gameOver, Component: GameOverPage },
          { path: ROUTE_PATHS.profile, Component: ProfilePage },
          { path: ROUTE_PATHS.leaderboard, Component: LeaderboardPage },
        ],
      },
    ],
  },
];
