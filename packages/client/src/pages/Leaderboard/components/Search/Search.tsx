import styles from './Search.module.scss';

export const Search = () => {
  return (
    <div className={styles.main}>
      <div className={`${styles.container} stalker-panel`}>
        <img src="/search.png" alt="search" />
        <input
          id="search-input"
          placeholder={'Search by callsign...'}
          className={'stalker-panel'}
          type="text"
        />
      </div>
      <div className={styles.search_container}>
        <button className={'stalker-button secondary'}>GLOBAL</button>
        <button className={'stalker-button secondary'}>SQUAD</button>
      </div>
    </div>
  );
};
