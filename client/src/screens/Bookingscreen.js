import React from 'react';
import { useParams } from 'react-router-dom';

function Bookingscreen() {
  const { roomid } = useParams();
  console.log(roomid);
  return (
    <div>
      <h1>Booking Screen</h1>
      <h1>Room id = {roomid}</h1>
    </div>
  );
}

export default Bookingscreen;
