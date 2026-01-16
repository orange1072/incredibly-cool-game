import { Table } from './components/Table';
import { Header } from './components/Header';
import styles from './Leaderboard.module.scss';

export const LeaderboardPage = () => {
  return (
    <div className={styles.main}>
      <Header />
      <Table />
    </div>
  );
};
