import { Link } from 'react-router-dom';
import { Brand } from './components/Brand';
import { ROUTES } from '@/constants';
import styles from './Nav.module.scss';

export const NavBar = () => {
  return (
    <nav className={styles.nav}>
      <Brand />
      <div className={styles.main}>
        <Link className="stalker-button secondary" to={ROUTES.HOME}>
          Main
        </Link>
        <Link className="stalker-button secondary" to={ROUTES.PROFILE}>
          Profile
        </Link>
        <Link className="stalker-button secondary" to={ROUTES.LEADERBOARD}>
          Leaderboard
        </Link>
        <Link className="stalker-button secondary" to={ROUTES.FORUM}>
          Forum
        </Link>
        <Link className="stalker-button secondary" to={ROUTES.SIGNIN}>
          Signin
        </Link>
        <Link className="stalker-button secondary" to={ROUTES.SIGNUP}>
          Signup
        </Link>
        <Link className="stalker-button secondary" to={ROUTES.ERROR_404}>
          Error404
        </Link>
        <Link className="stalker-button secondary" to={ROUTES.ERROR_500}>
          Error500
        </Link>
      </div>
    </nav>
  );
};
