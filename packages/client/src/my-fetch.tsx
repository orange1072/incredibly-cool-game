const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:3001/friends', {
      credentials: 'include',
      method: 'GET',
      mode: 'no-cors',
    });
    console.log('fetched data: ', response.json());
  } catch (error) {
    console.log(error);
  }
};

export const ButtonFetch = () => {
  return <button onClick={fetchData}>Fetch Data</button>;
};
