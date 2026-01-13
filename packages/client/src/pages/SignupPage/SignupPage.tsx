import React, { useCallback, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  Shield,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/Input/Input';
import { PixelButton } from '@/components/PixelButton';
import styles from './Registration.module.scss';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from '@/components/ParticleBackground';
import { useGetUserMutation, useSignUpMutation } from '@/api/authApi';
import { useDispatch } from '@/store/store';
import { setUser } from '@/store/slices/userSlice';
import { useOAuth } from '@/hooks/useOAuth';
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated';

type FormData = {
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
  login: string;
  password: string;
  confirmPassword: string;
};

export const SignupPage = () => {
  const [signUp] = useSignUpMutation();
  const [getUser] = useGetUserMutation();
  const navigate = useNavigate();
  const { handleOAuthLogin } = useOAuth();
  const dispatch = useDispatch();
  useRedirectIfAuthenticated();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    second_name: '',
    email: '',
    phone: '',
    login: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.first_name.trim()) {
        newErrors.first_name = 'Required';
      } else if (formData.first_name.trim().length < 2) {
        newErrors.first_name = 'First Name must be at least 2 characters';
      } else if (!/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/.test(formData.first_name.trim())) {
        newErrors.first_name =
          'First Name can only contain letters, spaces, hyphens and apostrophes';
      }

      if (!formData.second_name.trim()) {
        newErrors.second_name = 'Required';
      } else if (formData.second_name.trim().length < 2) {
        newErrors.second_name = 'Last Name must be at least 2 characters';
      } else if (!/^[a-zA-Zа-яА-ЯёЁ\s'-]+$/.test(formData.second_name.trim())) {
        newErrors.second_name =
          'Last Name can only contain letters, spaces, hyphens and apostrophes';
      }
    } else if (currentStep === 2) {
      if (!formData.email.trim()) {
        newErrors.email = 'Required';
      } else if (!validateEmail(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Required';
      } else if (!validatePhone(formData.phone.trim())) {
        newErrors.phone =
          'Please enter a valid phone number (at least 10 digits)';
      }
    } else if (currentStep === 3) {
      if (!formData.login.trim()) {
        newErrors.login = 'Required';
      } else if (formData.login.trim().length < 3) {
        newErrors.login = 'Call Sign must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.login.trim())) {
        newErrors.login =
          'Call Sign can only contain letters, numbers and underscores';
      }

      if (!formData.password) {
        newErrors.password = 'Required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Access Code must be at least 6 characters';
      } else if (formData.password.length > 50) {
        newErrors.password = 'Access Code must be less than 50 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        try {
          await signUp(formData).unwrap();
          const user = await getUser().unwrap();
          if (user) {
            dispatch(setUser(user));
            navigate('/game-menu');
          }
        } catch (error: any) {
          console.error('Registration failed:', error);
          const serverErrors: Record<string, string> = {};

          if (error?.data) {
            const errorReason = error.data.reason || '';

            const isTechnicalError =
              errorReason.toLowerCase().includes('cookie') ||
              errorReason.toLowerCase().includes('session') ||
              errorReason.toLowerCase().includes('token');

            if (errorReason && !isTechnicalError) {
              if (
                errorReason.includes('login') ||
                errorReason.includes('Login')
              ) {
                serverErrors.login = errorReason;
              } else if (
                errorReason.includes('email') ||
                errorReason.includes('Email')
              ) {
                serverErrors.email = errorReason;
              } else if (
                errorReason.includes('phone') ||
                errorReason.includes('Phone')
              ) {
                serverErrors.phone = errorReason;
              } else {
                serverErrors.login = errorReason;
              }
            }
            if (error.status === 409) {
              serverErrors.login =
                'This Call Sign or Email is already registered';
            }
          }

          if (Object.keys(serverErrors).length > 0) {
            setErrors(serverErrors);
            if (serverErrors.login) {
              setStep(3);
            } else if (serverErrors.email || serverErrors.phone) {
              setStep(2);
            }
          } else {
            setErrors({ login: 'Registration failed. Please try again.' });
            setStep(3);
          }
        }
      }
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const steps = ['Personal Data', 'Contacts', 'Access ID'];

  const combineClassNames = (...names: Array<string | undefined | false>) =>
    names.filter(Boolean).join(' ');

  return (
    <main className={styles['registration-page']}>
      <ParticleBackground particleCount={20} />

      <div className={styles['registration-page__content']}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles['logo-wrap']}>
              <div className={`${styles.glow}`} />
              <Shield className={`${styles.icon} ${styles.shield}`} />
            </div>

            <h1 className={styles['stalker-text']}>STALKER REGISTRATION</h1>

            <p className={styles.subtitle}>Join the Z.O.N.E. Expedition</p>
          </div>

          <div className={styles.progress}>
            {steps.map((stepName, index) => (
              <div key={index} className={styles['progress__segment']}>
                <div className={styles['progress__inner']}>
                  <div
                    className={combineClassNames(
                      styles['progress__bar'],
                      index + 1 <= step
                        ? styles['is-active']
                        : styles['is-inactive']
                    )}
                  ></div>

                  {index < steps.length - 1 && (
                    <Activity
                      className={combineClassNames(
                        styles['mini-activity'],
                        index + 1 < step ? styles.active : undefined
                      )}
                    />
                  )}
                </div>

                <div className={styles['progress__label']}>{stepName}</div>
              </div>
            ))}
          </div>

          <section className={styles['metal-panel']}>
            <div className={styles['top-line']} />

            <div className={styles['form-inner']}>
              <div className={styles.status}>
                <div className={styles['status-dot']} />

                <span className={styles['status-text']}>Step {step}/3</span>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {step === 1 && (
                  <fieldset className={styles['grid-2']}>
                    <legend style={{ display: 'none' }}>Personal data</legend>

                    <Input
                      type="text"
                      name={'first_name'}
                      label="First Name"
                      placeholder="Alex"
                      Icon={<User className={styles['input-icon']} />}
                      value={formData.first_name}
                      onChange={handleChange}
                      error={errors.first_name}
                    />

                    <Input
                      type="text"
                      name={'second_name'}
                      label="Last Name"
                      placeholder="Degtyarev"
                      Icon={<User className={styles['input-icon']} />}
                      value={formData.second_name}
                      onChange={handleChange}
                      error={errors.second_name}
                    />
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset className={styles['grid-2-2']}>
                    <legend style={{ display: 'none' }}>Contacts</legend>

                    <Input
                      name={'email'}
                      label="Email"
                      type="text"
                      placeholder="stalker@zone.net"
                      Icon={<Mail className={styles['input-icon']} />}
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />

                    <Input
                      name={'phone'}
                      label="Phone"
                      type="phone"
                      placeholder="+1 (555) 000-0000"
                      Icon={<Phone className={styles['input-icon']} />}
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                    />
                  </fieldset>
                )}

                {step === 3 && (
                  <fieldset className={styles['grid-2-2']}>
                    <legend style={{ display: 'none' }}>Access</legend>

                    <Input
                      type="text"
                      name={'login'}
                      label="Call Sign"
                      placeholder="marked_one"
                      Icon={<User className={styles['input-icon']} />}
                      value={formData.login}
                      onChange={handleChange}
                      error={errors.login}
                    />

                    <Input
                      name={'password'}
                      label="Access Code"
                      type="password"
                      placeholder="••••••••"
                      Icon={<Lock className={styles['input-icon']} />}
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                    />

                    <Input
                      name={'confirmPassword'}
                      label="Confirm Code"
                      type="password"
                      placeholder="••••••••"
                      Icon={
                        formData.password === formData.confirmPassword &&
                        formData.confirmPassword ? (
                          <CheckCircle className={styles['input-icon']} />
                        ) : (
                          <Lock className={styles['input-icon']} />
                        )
                      }
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                    />
                  </fieldset>
                )}

                <div className={styles.actions}>
                  {step > 1 && (
                    <PixelButton
                      variant="secondary"
                      size="lg"
                      className={`${styles.btn} ${styles['flex-1']}`}
                      onClick={() => setStep(step - 1)}
                    >
                      ← Back
                    </PixelButton>
                  )}

                  <PixelButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className={`${styles.btn} ${styles['flex-1']}`}
                  >
                    {step === 3 ? 'Complete Registration' : 'Next →'}
                  </PixelButton>
                </div>
              </form>

              <div className={styles['footer-link']}>
                <button
                  onClick={() => navigate('/signin')}
                  className={styles['sign-in-link']}
                >
                  Already Registered? Sign In
                </button>

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
                  onClick={handleOAuthLogin}
                >
                  Access via Yandex
                </PixelButton>
              </div>
            </div>

            <div className={styles['bottom-line']} />
          </section>
        </div>
      </div>
    </main>
  );
};
