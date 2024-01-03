import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  console.log(roomid);

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState();

  const fromDate = moment(fromdate, 'DD-MM-YYYY');
  const toDate = moment(todate, 'DD-MM-YYYY');

  const totaldays = moment.duration(toDate.diff(fromDate)).asDays()+1;
  const totalamount = room ? totaldays * room.rentperday : 0;

  

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
    <div className="m-5">
      {loading ? (<Loader/>) : room ? (<div>

        <div className="row justify-content-center mt-5 bs">

          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img src={room.imageurls[0]} className="bigimg"/>
          </div>

          <div className="col-md-6">
            
            <div style={{textAlign:'right'}}>
              <h1>Booking Details</h1>
              <hr/>

              <b>
                <p>Name : </p>
                <p>From Date : {fromdate}</p>
                <p>To Date : {todate}</p>
                <p>Max Count : {room.maxcount}</p>
              </b>
            </div>

            <div style={{textAlign:'right'}}>
              <h1>Amount</h1>
              <hr/>

              <b>
                <p>Total days : {totaldays}</p>
                <p>Rent per day : {room.rentperday}</p>
                <p>Total Amount : {totalamount}</p>
              </b>
            </div>

            <div style={{float:'right'}}>
              <button className='btn btn-primary'>Pay Now</button>
            </div>

          </div>

        </div>

      </div>) : (<Error/>)}
    </div>
  );
}

export default Bookingscreen;