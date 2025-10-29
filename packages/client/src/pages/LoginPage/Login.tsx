import React, { useCallback, useState } from 'react';
import { Input } from '@/components/Input/Input';
import styles from './Login.module.scss';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Logo } from '@/components/ui';
import { PixelButton } from '@/components/PixelButton';
import { ArrowRight, Radiation, User, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Errors = Partial<Record<'username' | 'password', string>>;

export function SigninPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();

  const validate = useCallback(() => {
    const newErrors: Errors = {};
    if (!username.trim()) newErrors.username = 'Required';
    if (!password) newErrors.password = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) {
        return;
      }

      navigate('/profile');
    },
    [validate, navigate]
  );

  const handleGuestLogin = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      setErrors({});
      navigate('/profile');
    },
    [navigate]
  );

  return (
    <main className={styles['login-page']}>
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

          <section
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

              <form onSubmit={handleSubmit} className={styles['panel-inner']}>
                <Input
                  type="text"
                  name="username"
                  label="Call Sign"
                  placeholder="marked_one"
                  Icon={<User className={styles.icon} />}
                  value={username}
                  error={errors.username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                  name="password"
                  label="Access Code"
                  type="password"
                  placeholder="••••••••"
                  Icon={<Lock className={styles.icon} />}
                  value={password}
                  error={errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <PixelButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className={styles['full-width']}
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
              </form>

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
          </section>

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
    </main>
  );
}
