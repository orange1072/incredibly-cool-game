import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground } from '@/components/ParticleBackground'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ScreenshotsSection } from '@/components/sections/ScreenshotsSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { CTASection } from '@/components/sections/CTASection'
import { Footer } from '@/components/sections/Footer'

import styles from './MainPage.module.scss'

export const MainPage = () => {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={styles.container}>
      {/* Animated Background Particles */}
      <ParticleBackground particleCount={50} />

      {/* Hero Section */}
      <HeroSection scrollY={scrollY} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Screenshots Section */}
      <ScreenshotsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
