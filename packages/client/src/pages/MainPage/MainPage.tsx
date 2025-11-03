import { useNavigate } from 'react-router-dom';
import { useScrollY } from '@/hooks/useScrollY';
import { ParticleBackground } from '@/components/ParticleBackground/ParticleBackground';
import { HeroSection } from '@/pages/MainPage/sections/HeroSection';
import { FeaturesSection } from '@/pages/MainPage/sections/FeaturesSection';
import { ScreenshotsSection } from '@/pages/MainPage/sections/ScreenshotsSection';
import { StatsSection } from '@/pages/MainPage/sections/StatsSection';
import { CTASection } from '@/pages/MainPage/sections/CTASection';
import { Footer } from '@/pages/MainPage/sections/Footer';

import styles from './MainPage.module.scss';

export const MainPage = () => {
  const navigate = useNavigate();
  const scrollY = useScrollY();

  return (
    <div className={styles.container}>
      <div aria-hidden="true">
        <ParticleBackground particleCount={50} />
      </div>
      <main>
        <HeroSection scrollY={scrollY} />
        <FeaturesSection />
        <ScreenshotsSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
