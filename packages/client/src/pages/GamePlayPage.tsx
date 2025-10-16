import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { PixelButton } from '@/components/PixelButton'
import '../App.scss'

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

      <main
        className="app"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '2rem',
          padding: '2rem',
        }}
      >
        <h1 className="stalker-text glitch">GAME IN PROGRESS</h1>
        <p
          style={{
            color: 'var(--stalker-text-dim)',
            fontFamily: 'var(--font-family-mono)',
            textAlign: 'center',
            maxWidth: '600px',
          }}
        >
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
