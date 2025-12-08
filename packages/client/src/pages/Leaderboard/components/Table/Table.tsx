import { useGetLeaderboardQuery } from '@/api';
import styles from './Table.module.scss';

export const Table = () => {
  const {
    data: leaderboard = [],
    isLoading,
    error,
  } = useGetLeaderboardQuery({ cursor: 0, limit: 10 });

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

  if (isLoading) {
    return <div className={styles.message}>Loading leaderboard...</div>;
  }

  if (error) {
    const errorMessage =
      'error' in error
        ? error.error
        : 'data' in error
        ? JSON.stringify(error.data)
        : 'message' in error
        ? error.message
        : 'Failed to load leaderboard';

    return <div className={styles.error}>Error: {errorMessage}</div>;
  }

  return (
    <table className={styles.main}>
      <thead>
        <tr>
          <th scope={'row'}>RANK</th>
          <th scope={'row'}>STALKER</th>
          <th scope={'row'}>ELIMINATED</th>
          <th scope={'row'}>SCORE</th>
          <th scope={'row'}>LEVEL</th>
          <th scope={'row'}>TIME</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((player) => (
          <tr key={`${player.rank}-${player.username}`}>
            <td scope={'row'}>
              {rankIcons(player.rank || 0)}#{player.rank}
            </td>
            <td scope={'row'}>{player.username}</td>
            <td scope={'row'}>{formatTime(player.timeAlive)}</td>
            <td scope={'row'}>{player.score}</td>
            <td scope={'row'}>{player.level}</td>
            <td scope={'row'}>{formatDate(player.time)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
