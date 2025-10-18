import styles from './Header.module.scss';

export const Header = () => {
  const title = 'GLOBAL RANKINGS';
  const subTitle = 'Top Survivors in The Zone';
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <img src="/leaderboardBrand.png" alt="leaderboardBrand" />
      </div>
      <div className={styles.title}>
        <h2>{title}</h2>
        <h5>{subTitle}</h5>
      </div>
    </header>
  );
};
