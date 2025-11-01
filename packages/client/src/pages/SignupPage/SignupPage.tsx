import React, { useCallback, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  CheckCircle,
  Shield,
  Activity,
} from 'lucide-react';
import { Input } from '@/components/Input/Input';
import { PixelButton } from '@/components/PixelButton';
import styles from './Registration.module.scss';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from '@/components/ParticleBackground';
import { useGetUserMutation, useSignUpMutation } from '@/slices/authApi';
import { useDispatch } from '@/store/store';
import { setUser } from '@/store/slices/userSlice';

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
  const dispatch = useDispatch();
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

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.first_name) newErrors.first_name = 'Required';
      if (!formData.second_name) newErrors.second_name = 'Required';
    } else if (currentStep === 2) {
      if (!formData.email) newErrors.email = 'Required';
      if (!formData.phone) newErrors.phone = 'Required';
    } else if (currentStep === 3) {
      if (!formData.login) newErrors.login = 'Required';
      if (!formData.password) newErrors.password = 'Required';
      if (formData.password !== formData.confirmPassword) {
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
          await signUp(formData);
          const user = await getUser().unwrap();
          if (user) {
            dispatch(setUser(user));
            navigate('/profile');
          }
        } catch (error) {
          console.error('Registration failed:', error);
        }
      }
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
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

              <form onSubmit={handleSubmit}>
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
                      type="email"
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
              </div>
            </div>

            <div className={styles['bottom-line']} />
          </section>
        </div>
      </div>
    </main>
  );
};
