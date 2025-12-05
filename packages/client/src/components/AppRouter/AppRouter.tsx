import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SigninPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ForumPage } from '@/pages/ForumPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LeaderboardPage } from '@/pages/Leaderboard';
import { Error404Page } from '@/pages/Error404Page';
import { Error500Page } from '@/pages/Error500Page';
import { DemoPage } from '@/pages/DemoPage';
import { MainPage } from '@/pages/MainPage';
import { NavBar } from '../Navbar';
import { GameMenuPage } from '@/pages/GameMenuPage';
import { GamePlayPage } from '@/pages/GamePlayPage';
import { GameOverPage } from '@/pages/GameOverPage';
import { withAuth } from '@/hocs/withAuth';

const GameMenuWithAuth = withAuth(GameMenuPage);
const GamePlayWithAuth = withAuth(GamePlayPage);
const GameOverWithAuth = withAuth(GameOverPage);
const ProfileWithAuth = withAuth(ProfilePage);
const LeaderboardWithAuth = withAuth(LeaderboardPage);
const ForumWithAuth = withAuth(ForumPage);

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
        <Route path="/game-menu" Component={GameMenuWithAuth} />
        <Route path="/game-play" Component={GamePlayWithAuth} />
        <Route path="/game-over" Component={GameOverWithAuth} />
        <Route path="/profile" Component={ProfileWithAuth} />
        <Route path="/leaderboard" Component={LeaderboardWithAuth} />
        <Route path="/forum" Component={ForumWithAuth} />
        //Последний роут на 404
        <Route path="*" Component={Error404Page} />
      </Routes>
    </Router>
  );
};
