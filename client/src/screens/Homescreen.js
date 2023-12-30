import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/rooms/getallrooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Home Screen</h1>
      <h1>There are {rooms.length} rooms</h1>
    </div>
  );
}

export default Homescreen;
