import { Link } from 'react-router-dom';
import { Brand } from './components/Brand';
import styles from './Nav.module.scss';

export const NavBar = () => {
  return (
    <nav className={styles.nav}>
      <Brand />
      <div className={styles.main}>
        <Link className="stalker-button secondary" to="/">
          Main
        </Link>
        <Link className="stalker-button secondary" to="/profile">
          Profile
        </Link>
        <Link className="stalker-button secondary" to="/leaderboard">
          Leaderboard
        </Link>
        <Link className="stalker-button secondary" to="/forum">
          Forum
        </Link>
        <Link className="stalker-button secondary" to="/signin">
          Signin
        </Link>
        <Link className="stalker-button secondary" to="/signup">
          Signup
        </Link>
        <Link className="stalker-button secondary" to="/error404">
          Error404
        </Link>
        <Link className="stalker-button secondary" to="/error500">
          Error500
        </Link>
      </div>
    </nav>
  );
};
