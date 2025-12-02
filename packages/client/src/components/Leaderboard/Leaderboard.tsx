import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/api/leaderboard';
import { LeaderboardItem } from '@/types/leaderboard';
import styles from '../../pages/Leaderboard/components/Table/Table.module.scss';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getLeaderboard({ cursor: 0, limit: 10 });
        setLeaderboard(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load leaderboard'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#ff4444' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <table className={styles.main}>
      <thead>
        <tr>
          <th scope={'row'}>RANK</th>
          <th scope={'row'}>STALKER</th>
          <th scope={'row'}>SCORE</th>
          <th scope={'row'}>LEVEL</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((player) => (
          <tr key={`${player.rank}-${player.username}`}>
            <td scope={'row'}>
              {rankIcons(player.rank || 0)}#{player.rank}
            </td>
            <td scope={'row'}>{player.username}</td>
            <td scope={'row'}>{player.score}</td>
            <td scope={'row'}>{player.level}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
