import { Search } from './components/Search';
import { Table } from './components/Table';
import { Pagination } from './components/Pagination';
import { Header } from './components/Header';
import styles from './Leaderboard.module.scss';

export const LeaderboardPage = () => {
  return (
    <div className={styles.main}>
      <Header />
      <Search />
      <Table />
      <Pagination />
    </div>
  );
};
