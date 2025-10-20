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
        <Route path="/" Component={MainPage} />
        <Route path="/demo" Component={DemoPage} />
        <Route path="/signin" Component={SigninPage} />
        <Route path="/signup" Component={SignupPage} />
        <Route path="/error404" Component={Error404Page} />
        <Route path="/error500" Component={Error500Page} />
        //Приватные роуты
        <Route
          path="/game-menu"
          element={
            <PrivateRoute>
              <GameMenuPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/game-play"
          element={
            <PrivateRoute>
              <GamePlayPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <LeaderboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/forum"
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
