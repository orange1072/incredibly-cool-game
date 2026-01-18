import styles from './Table.module.scss';
import { useGetLeaderboardQuery } from '@/api';
import { LeaderboardItem } from '@/types/leaderboard';

export const Table = () => {
  const { data: leaderboard = [], isLoading } = useGetLeaderboardQuery({
    limit: 10,
  });

  const rankIcons = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <img className={styles.img_rank} src={'/1st.png'} alt="1st place" />
        );
      case 2:
        return (
          <img className={styles.img_rank} src={'/2nd.png'} alt="2nd place" />
        );
      case 3:
        return (
          <img className={styles.img_rank} src={'/3nd.png'} alt="3rd place" />
        );
      default:
        return (
          <img
            className={styles.img_rank}
            src={'/otherPlace.png'}
            alt="Other place"
          />
        );
    }
  };

  const formatDate = (date: number) => {
    const hours = date / 60 / 60;
    return hours.toFixed(1);
  };
  return (
    <table className={styles.main}>
      <thead>
        <tr>
          <th scope={'row'}>RANK</th>
          <th scope={'row'}>STALKER</th>
          <th scope={'row'}>SCORE</th>
          <th scope={'row'}>LEVEL</th>
          <th scope={'row'}>TIME</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={5}>Loading...</td>
          </tr>
        ) : (
          leaderboard.map((player: LeaderboardItem, index: number) => (
            <tr key={`${player.username}-${player.score}-${index}`}>
              <td scope={'row'}>
                {rankIcons(index + 1 || 0)}#{index + 1}
              </td>
              <td scope={'row'}>{player.username}</td>
              <td scope={'row'}>{player.score}</td>
              <td scope={'row'}>{player.level}</td>
              <td scope={'row'}>
                {player.timeAlive ? `${formatDate(player.timeAlive)} h` : '-'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
