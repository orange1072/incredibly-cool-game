import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import '../App.scss'

export const DemoPage = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>STALKER Theme Demo - Главная</title>
        <meta
          name="description"
          content="Демонстрация стилей и компонентов в стиле STALKER"
        />
      </Helmet>

      <div className="app">
        <div className="demo-container">
          {/* Заголовок с эффектом */}
          <header className="demo-header scanline">
            <h1 className="stalker-text">S.T.A.L.K.E.R. Theme Demo</h1>
            <p className="demo-subtitle">Демонстрация всех стилей и эффектов</p>
          </header>

          {/* Секция: Типография */}
          <section className="demo-section">
            <h2 className="demo-section-title">1. Типография и шрифты</h2>
            <div className="demo-typography">
              <h1>H1 - Courier New (Заголовки)</h1>
              <h2>H2 - Courier New (Подзаголовки)</h2>
              <h3>H3 - Courier New</h3>
              <h4>H4 - Courier New</h4>
              <p>
                Paragraph - Consolas (Основной текст для параграфов и контента)
              </p>
              <code>Code - Consolas (Моноширинный шрифт для кода)</code>
            </div>
          </section>

          {/* Секция: Цвета */}
          <section className="demo-section">
            <h2 className="demo-section-title">2. Цветовая палитра</h2>
            <div className="demo-colors">
              <div className="color-card color-cyan">
                <div className="color-sample"></div>
                <p>Cyan</p>
                <code>$stalker-cyan</code>
              </div>
              <div className="color-card color-orange">
                <div className="color-sample"></div>
                <p>Orange</p>
                <code>$stalker-orange</code>
              </div>
              <div className="color-card color-dark">
                <div className="color-sample"></div>
                <p>Dark</p>
                <code>$stalker-dark</code>
              </div>
              <div className="color-card color-panel">
                <div className="color-sample"></div>
                <p>Panel</p>
                <code>$stalker-panel</code>
              </div>
            </div>
          </section>

          {/* Секция: Эффекты */}
          <section className="demo-section">
            <h2 className="demo-section-title">3. Эффекты и миксины</h2>
            <div className="demo-effects">
              <div className="effect-card metal-panel">
                <h3>Metal Panel</h3>
                <code>@include metal-panel</code>
              </div>
              <div className="effect-card metal-panel cyan-glow">
                <h3>Cyan Glow</h3>
                <code>@include cyan-glow</code>
              </div>
              <div className="effect-card metal-panel radiation-glow">
                <h3>Radiation Glow</h3>
                <code>@include radiation-glow</code>
              </div>
              <div className="effect-card metal-panel grunge-texture">
                <h3>Grunge Texture</h3>
                <code>@include grunge-texture</code>
              </div>
              <div className="effect-card scanline">
                <h3>Scanline CRT</h3>
                <code>@include scanline</code>
              </div>
              <div className="effect-card anomaly-shimmer">
                <h3>Anomaly Shimmer</h3>
                <code>class="anomaly-shimmer"</code>
              </div>
            </div>
          </section>

          {/* Секция: Кнопки */}
          <section className="demo-section">
            <h2 className="demo-section-title">4. Кнопки</h2>
            <div className="demo-buttons">
              <button className="stalker-button primary">Primary Button</button>
              <button className="stalker-button secondary">
                Secondary Button
              </button>
              <button className="stalker-button danger">Danger Button</button>
            </div>
          </section>

          {/* Секция: Карточки */}
          <section className="demo-section">
            <h2 className="demo-section-title">5. Карточки (адаптивные)</h2>
            <div className="demo-cards">
              <div className="artifact-card">
                <div className="artifact-card__icon cyan-glow">🎭</div>
                <h3 className="artifact-card__title">Газовая маска</h3>
                <p className="artifact-card__description">
                  Защита от аномалий и радиации в Зоне
                </p>
              </div>
              <div className="artifact-card">
                <div className="artifact-card__icon radiation-glow">☢️</div>
                <h3 className="artifact-card__title">Радиация</h3>
                <p className="artifact-card__description">
                  Высокий уровень радиационного фона
                </p>
              </div>
              <div className="artifact-card">
                <div className="artifact-card__icon anomaly-shimmer">✨</div>
                <h3 className="artifact-card__title">Аномалия</h3>
                <p className="artifact-card__description">
                  Мерцающий артефакт с особыми свойствами
                </p>
              </div>
            </div>
          </section>

          {/* Секция: Адаптивность */}
          <section className="demo-section">
            <h2 className="demo-section-title">6. Адаптивная верстка</h2>
            <div className="demo-responsive metal-panel">
              <p>
                <strong>Попробуйте изменить размер окна!</strong>
              </p>
              <p className="responsive-text">
                Этот блок адаптируется под разные размеры экрана:
              </p>
              <ul>
                <li>📱 Мобильный (&lt; 640px) - padding: 1rem</li>
                <li>📱 Small (≥ 640px) - padding: 1.5rem</li>
                <li>💻 Medium (≥ 768px) - padding: 2rem</li>
                <li>🖥️ Large (≥ 1024px) - padding: 2.5rem</li>
                <li>🖥️ XLarge (≥ 1280px) - padding: 3rem</li>
              </ul>
            </div>
          </section>

          {/* Футер */}
          <footer className="demo-footer">
            <p className="stalker-text">Добро пожаловать в Зону, Сталкер</p>
            <p>
              См. <code>STYLES_GUIDE.md</code> для полной документации
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}

export const initDemoPage = async (_args: PageInitArgs) => {
  // Здесь можно добавить загрузку данных для главной страницы
}
