import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SigninPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ForumPage } from '@/pages/ForumPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LeaderboardPage } from '@/pages/Leaderboard';
import { Error404Page } from '@/pages/Error404Page';
import { Error500Page } from '@/pages/Error500Page';
import { PrivateRoute } from '../PrivateRoute';
import { DemoPage } from '@/pages/DemoPage';
import { MainPage } from '@/pages/MainPage';
import { NavBar } from '../Navbar';
import { GameMenuPage } from '@/pages/GameMenuPage';
import { GamePlayPage } from '@/pages/GamePlayPage';
import { GameOverPage } from '@/pages/GameOverPage';
import { ROUTES } from '@/constants';

export const AppRouter = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <NavBar />
      <Routes>
        //Публичные роуты
        <Route path={ROUTES.HOME} Component={MainPage} />
        <Route path={ROUTES.DEMO} Component={DemoPage} />
        <Route path={ROUTES.SIGNIN} Component={SigninPage} />
        <Route path={ROUTES.SIGNUP} Component={SignupPage} />
        <Route path={ROUTES.ERROR_404} Component={Error404Page} />
        <Route path={ROUTES.ERROR_500} Component={Error500Page} />
        //Приватные роуты
        <Route
          path={ROUTES.GAME_MENU}
          element={
            <PrivateRoute>
              <GameMenuPage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.GAME_PLAY}
          element={
            <PrivateRoute>
              <GamePlayPage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.GAME_OVER}
          element={
            <PrivateRoute>
              <GameOverPage victory={false} />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.LEADERBOARD}
          element={
            <PrivateRoute>
              <LeaderboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.FORUM}
          element={
            <PrivateRoute>
              <ForumPage />
            </PrivateRoute>
          }
        />
        //Последний роут на 404
        <Route path="*" Component={Error404Page} />
      </Routes>
    </Router>
  );
};
