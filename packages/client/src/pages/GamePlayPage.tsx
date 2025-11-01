import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { PixelButton } from '@/components/PixelButton'
import '../App.scss'
import styles from './GamePlayPage.module.scss'

export const GamePlayPage = () => {
  const navigate = useNavigate()
  //Это просто заглушка для игрового экрана который будет реализован позже

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Game Play - Mission in Progress</title>
        <meta name="description" content="The game is in progress" />
      </Helmet>

      <main className={`app ${styles.container}`}>
        <h1 className="stalker-text glitch">GAME IN PROGRESS</h1>
        <p className={styles.description}>
          This is a placeholder for the actual game. The game logic will be
          implemented here.
        </p>
        <nav aria-label="Game navigation">
          <PixelButton variant="primary" onClick={() => navigate('/game-menu')}>
            Back to Mission Briefing
          </PixelButton>
        </nav>
      </main>
    </>
  )
}
