import styles from './Pagination.module.scss';

export const Pagination = () => {
  return (
    <div className={styles.content}>
      <button className={'stalker-button secondary'}>← Prev</button>
      <button className={'stalker-button secondary'}>1</button>
      <button className={'stalker-button secondary'}>2</button>
      <button className={'stalker-button secondary'}>3</button>
      <button className={'stalker-button secondary '}>Next →</button>
    </div>
  );
};
