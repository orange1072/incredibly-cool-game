import styles from './Brand.module.scss';

export const Brand = () => {
  const title = 'Z.O.N.E.';
  const underTitle = 'Zombie Outbreak Neutralization';

  return (
    <div className={styles.brand_container}>
      <div className={styles.main}>
        <img src="/brand.png" alt="brand" className="brand" />
        <h3 className="brand-title">{title}</h3>
        <img src="/lighting.png" alt="lightning" className={styles.lightning} />
      </div>
      <div className={styles.subtitle}>
        <sub>{underTitle}</sub>
      </div>
    </div>
  );
};
