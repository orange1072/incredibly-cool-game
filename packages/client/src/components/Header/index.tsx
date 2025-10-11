import { Link } from 'react-router-dom'
import './Header.scss'

export const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/friends">Страница со списком друзей</Link>
          </li>
          <li>
            <Link to="/404">404</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
