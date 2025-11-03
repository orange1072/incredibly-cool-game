import { memo } from 'react';
import { SectionTitle } from '@/components/ui';
import styles from './ScreenshotsSection.module.scss';

interface Screenshot {
  title: string;
  emoji: string;
}

const screenshots: Screenshot[] = [
  { title: 'City Ruins', emoji: '🏚️' },
  { title: 'Exclusion Zone', emoji: '☢️' },
  { title: 'Ground Zero', emoji: '💀' },
];

export const ScreenshotsSection = memo(() => {
  return (
    <section className={styles.screenshotsSection}>
      <div className={styles.screenshotsContent}>
        <SectionTitle title="EXPLORE THE ZONES" />

        <div className={styles.screenshotsGrid}>
          {screenshots.map((screenshot, index) => (
            <div key={index} className={styles.screenshotCard}>
              <div className={styles.screenshotContent}>
                {/* Screenshot Placeholder */}
                <div className={styles.screenshotPlaceholder}>
                  <div>
                    <div className={styles.screenshotEmoji}>
                      {screenshot.emoji}
                    </div>
                    <div className={styles.screenshotPreviewText}>Preview</div>
                  </div>
                </div>

                <h3 className={styles.screenshotTitle}>{screenshot.title}</h3>
              </div>

              {/* Hover glow */}
              <div className={styles.screenshotBottomLine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ScreenshotsSection.displayName = 'ScreenshotsSection';
