import React, { useState } from 'react'
import { Input } from '@/components/Input/Input'
import styles from './Login.module.scss'
import { ParticleBackground } from '@/components/ParticleBackground'
import { Logo } from '@/components/ui'
import { PixelButton } from '@/components/PixelButton'
import { ArrowRight, Radiation, User, Lock, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function SigninPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = () => {
    if (username && password) {
      console.log('handleLogin')
    }
  }

  const handleGuestLogin = () => {
    console.log('handleGuestLogin')
  }

  return (
    <div className={styles['login-page']}>
      <ParticleBackground particleCount={20} />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div
              className={`${styles['logo-wrap']} ${styles['anomaly-pulse']}`}
            >
              <Logo />
            </div>

            <h1 className={`${styles['stalker-text']} glitch`}>Z.O.N.E.</h1>

            <p className={styles.subtitle}>
              Zombie Outbreak Neutralization Expedition
            </p>

            <p className={styles['subtitle-muted']}>Access Terminal v2.1</p>

            <div className={styles['status-warning']}>
              <AlertTriangle
                className={`${styles.icon} ${styles.small} ${styles.pulse}`}
              />

              <span>HIGH RADIATION AREA</span>

              <AlertTriangle
                className={`${styles.icon} ${styles.small} ${styles.pulse}`}
              />
            </div>
          </div>

          <div
            className={`${styles['metal-panel']} ${styles['grunge-texture']}`}
          >
            <div className={styles['top-line']} />

            <div className={styles['panel-inner']}>
              <div className={styles['status-line']}>
                <div
                  className={`${styles['status-dot']} ${styles['cyan-glow']} ${styles.pulse}`}
                />

                <span className={styles['status-text']}>System Online</span>
              </div>

              <Input
                label="Call Sign"
                placeholder="marked_one"
                icon={<User className={styles.icon} />}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                label="Access Code"
                type="password"
                placeholder="••••••••"
                icon={<Lock className={styles.icon} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PixelButton
                variant="primary"
                size="lg"
                className={styles['full-width']}
                onClick={handleLogin}
              >
                Enter Zone
              </PixelButton>

              <div className={styles.divider}>
                <div className={styles.line} />

                <span className={styles.or}>OR</span>

                <div className={styles.line} />
              </div>

              <PixelButton
                variant="secondary"
                size="md"
                icon={
                  <ArrowRight className={`${styles.icon} ${styles.small}`} />
                }
                className={styles['full-width']}
                onClick={handleGuestLogin}
              >
                Anonymous Access
              </PixelButton>

              <div className={styles['panel-actions']}>
                <button
                  onClick={() => navigate('/signup')}
                  className={`${styles.link} ${styles['primary-link']}`}
                >
                  Register Stalker ID
                </button>

                <button className={`${styles.link} ${styles['muted-link']}`}>
                  <Radiation
                    className={`${styles.icon} ${styles.small} ${styles.pulse}`}
                  />
                  Forgot Access Code?
                </button>
              </div>
            </div>

            <div className={styles['bottom-line']} />
          </div>

          <div className={styles['warning-row']}>
            <div
              className={`${styles['warning-box']} ${styles.pulse} ${styles['radiation-glow']}`}
            >
              <Radiation className={`${styles.icon} ${styles.pulse}`} />

              <span>Danger: Anomalous Activity Detected</span>
            </div>
          </div>

          <div className={styles.quote}>
            <p>"Get out of here, stalker..."</p>
          </div>
        </div>
      </div>
    </div>
  )
}
