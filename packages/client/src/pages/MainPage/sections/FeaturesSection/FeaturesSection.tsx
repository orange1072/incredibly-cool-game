import { memo } from 'react';
import { Zap, Skull, Radiation, Trophy } from 'lucide-react';
import { SectionTitle } from '@/components/ui';
import styles from './FeaturesSection.module.scss';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  colorClass: string;
}

const features: Feature[] = [
  {
    icon: Skull,
    title: 'Intense Waves',
    description: 'Face endless zombie hordes in brutal top-down combat',
    colorClass: styles.red,
  },
  {
    icon: Radiation,
    title: 'Radiation Zones',
    description: 'Explore contaminated areas with deadly anomalies',
    colorClass: styles.orange,
  },
  {
    icon: Zap,
    title: 'Power-Ups',
    description: 'Collect artifacts and weapons to survive longer',
    colorClass: styles.cyan,
  },
  {
    icon: Trophy,
    title: 'Leaderboards',
    description: 'Compete globally and prove you are the ultimate stalker',
    colorClass: styles.lightCyan,
  },
];

export const FeaturesSection = memo(() => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContent}>
        <SectionTitle title="GAME FEATURES" />

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureTopLine} />

                <div className={styles.featureContent}>
                  <Icon
                    className={`${styles.featureIcon} ${feature.colorClass}`}
                  />
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';
