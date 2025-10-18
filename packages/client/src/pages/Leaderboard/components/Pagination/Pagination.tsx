import styles from './Pagination.module.scss';

export const Pagination = () => {
  return (
    <div className={styles.content}>
      <button
        aria-label={' ← Prev'}
        type={'button'}
        className={'stalker-button secondary'}
      >
        ← Prev
      </button>
      <button
        aria-label={'1'}
        type={'button'}
        className={'stalker-button secondary'}
      >
        1
      </button>
      <button
        aria-label={' 2'}
        type={'button'}
        className={'stalker-button secondary'}
      >
        2
      </button>
      <button
        aria-label={'3'}
        type={'button'}
        className={'stalker-button secondary'}
      >
        3
      </button>
      <button
        aria-label={'Next →'}
        type={'button'}
        className={'stalker-button secondary '}
      >
        Next →
      </button>
    </div>
  );
};
