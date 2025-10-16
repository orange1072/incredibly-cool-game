import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { SigninPage } from '@/pages/Login'
import { SignupPage } from '@/pages/SignupPage'
import { ForumPage } from '@/pages/ForumPage'
import { ProfilePage } from '@/pages/ProflePage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { Error404Page } from '@/pages/Error404Page'
import { Error500Page } from '@/pages/Error500Page'
import { PrivateRoute } from '../PrivateRoute'
import { DemoPage } from '@/pages/DemoPage'
import { MainPage } from '@/pages/MainPage'

export const AppRouter = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* <nav>
        <Link to="/">Main</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/forum">Forum</Link>
        <Link to="/signin">Signin</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/error404">Error404</Link>
        <Link to="/error500">Error500</Link>
      </nav> */}
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
  )
}
