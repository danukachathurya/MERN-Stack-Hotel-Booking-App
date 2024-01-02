import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

function Bookingscreen() {
  const { roomid } = useParams();
  console.log(roomid);

  const [loading, setloading] = useState();
  const [error, seterror] = useState();
  const [room, setroom] = useState();

  useEffect(() => {
    const fetchData = async() => {

      try {
        setloading(true);
        const data = (await axios.post("/api/rooms/getroombyid", {roomid : roomid})).data;
        setroom(data);
        setloading(false);
      } catch (error) {
        setloading(false);
        seterror(true);
      }
    };
    fetchData();
  }, [])

  return (
    <div>
      <h1>Booking Screen</h1>
      <h1>Room id = {roomid}</h1>
    </div>
  );
}

export default Bookingscreen;
