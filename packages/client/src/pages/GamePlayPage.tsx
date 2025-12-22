import { Helmet } from 'react-helmet';
import { GameCanvas } from '@/components/GameCanvas/GameCanvas';
import withFullscreen from '../hocs/withFullscreen';
import { XpBar } from '@/components/XpBar/XpBar';
import '../App.scss';

const GameCanvasWithFullscreen = withFullscreen(GameCanvas);

export const GamePlayPage = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Game Play - Mission in Progress</title>
        <meta name="description" content="The game is in progress" />
      </Helmet>

      <div className="app">
        <section className="game-section">
          <GameCanvasWithFullscreen />
          <div className="game-section__overlay">
            <XpBar />
          </div>
        </section>
      </div>
    </>
  );
};
