import { MOCK_LEADERBOARD } from '../../constants';
import styles from './Table.module.scss';

export const Table = () => {
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

  return (
    <table className={styles.main}>
      <thead>
        <tr>
          <th scope={'row'}>RANK</th>
          <th scope={'row'}>STALKER</th>
          <th scope={'row'}>ELIMINATED</th>
          <th scope={'row'}>LEVEL</th>
          <th scope={'row'}>TIME</th>
          <th scope={'row'}>DATE</th>
        </tr>
      </thead>
      <tbody>
        {MOCK_LEADERBOARD.map((user, index) => (
          <tr key={`${user.rank}-${user.name}`}>
            <td scope={'row'}>
              {rankIcons(user.rank)}#{user.rank}
            </td>
            <td scope={'row'}>{user.name}</td>
            <td scope={'row'}>
              <img
                className={styles.img_table}
                src={'/kills.png'}
                alt="kills"
              />
              {user.kills}
            </td>
            <td scope={'row'}>
              <img className={styles.img_table} src={'/lvl.png'} alt="lvl" />
              {user.level}
            </td>
            <td scope={'row'}>{user.time}</td>
            <td scope={'row'}>{`${user.date}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
