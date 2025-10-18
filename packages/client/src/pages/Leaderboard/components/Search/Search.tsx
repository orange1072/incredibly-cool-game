import styles from './Search.module.scss';

export const Search = () => {
  return (
    <div className={styles.main}>
      <form className={`${styles.container} stalker-panel`}>
        <img src="/search.png" alt="search" />
        <input
          aria-label="Search"
          name={'search-input'}
          id="search-input"
          placeholder="Search by callsign..."
          className={'stalker-panel'}
          type="text"
        />
      </form>
      <div className={styles.search_container}>
        <button className={'stalker-button secondary'}>GLOBAL</button>
        <button className={'stalker-button secondary'}>SQUAD</button>
      </div>
    </div>
  );
};
