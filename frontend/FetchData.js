// Example of making an API call with the access token
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const FetchData = () => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchData = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:5001/protected-route', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={fetchData}>Fetch Data</button>;
};

export default FetchData;
