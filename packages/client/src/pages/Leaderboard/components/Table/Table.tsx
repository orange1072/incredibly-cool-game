import styles from './Table.module.scss';
import supabase from '@/utils/supabase';
import { useEffect, useState } from 'react';

export const Table = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function getLeaderboard(limit = 10) {
      const { data, error } = await supabase
        .from('game_records')
        .select()
        .order('score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }
      console.log('records', data);
      setLeaderboard(data);
      return data;
    }
    getLeaderboard();
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
        {leaderboard.map((player, index) => (
          <tr key={`${player.game_data.username}-${player.game_data.score}`}>
            <td scope={'row'}>
              {rankIcons(index + 1 || 0)}#{index + 1}
            </td>
            <td scope={'row'}>{player.game_data.username}</td>
            <td scope={'row'}>{player.score}</td>
            <td scope={'row'}>{player.level}</td>
            <td scope={'row'}>{`${formatDate(player.time_played)} h`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
