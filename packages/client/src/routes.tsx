import ProtectedRoute from './layouts/ProtectedRoute';
import RootRoute from './layouts/RootRoute';
import { Error500Page } from './pages/Error500Page';
import { ForumPage } from './pages/ForumPage';
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

export const routes = [
  {
    path: '/',
    Component: RootRoute,
    children: [
      {
        Component: PublicRoute,
        children: [
          { path: '/', Component: MainPage },
          { path: '/demo', Component: DemoPage },
          { path: '/signin', Component: SigninPage },
          { path: '/signup', Component: SignupPage },
          { path: '/error404', Component: Error404Page },
          { path: '/error500', Component: Error500Page },
          { path: '*', Component: Error404Page },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          { path: '/game-menu', Component: GameMenuPage },
          { path: '/game-play', Component: GamePlayPage },
          { path: '/game-over', Component: GameOverPage },
          { path: '/profile', Component: ProfilePage },
          { path: '/leaderboard', Component: LeaderboardPage },
          { path: '/forum', Component: ForumPage },
        ],
      },
    ],
  },
];
