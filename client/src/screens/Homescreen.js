import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Space } from "antd";
import "antd/dist/antd.css";
import moment from "moment";

const { RangePicker } = DatePicker;
function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();

  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicaterooms, setduplicaterooms] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const response = await axios.get("/api/rooms/getallrooms");

        setrooms(response.data);
        setduplicaterooms(response.data);
        setloading(false);
      } catch (error) {
        seterror(true);
        console.log(error);
        setloading(false);
      }
    };
    fetchData();
  }, []);

  function filterByDate(dates) {
    setfromdate(moment(dates[0]).format("DD-MM-YYYY"));
    settodate(moment(dates[1]).format("DD-MM-YYYY"));
  
    const temprooms = [];
    let availability;
  
    for (const room of duplicaterooms) {
      availability = true;
  
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          if (
            moment(dates[0]).isBetween(booking.fromdate, booking.todate, null, '[]') ||
            moment(dates[1]).isBetween(booking.fromdate, booking.todate, null, '[]') ||
            moment(booking.fromdate, 'DD-MM-YYYY').isBetween(moment(dates[0]), moment(dates[1]), null, '[]') ||
            moment(booking.todate, 'DD-MM-YYYY').isBetween(moment(dates[0]), moment(dates[1]), null, '[]')
          ) {
            availability = false;
            break;
          }
        }
      }
  
      if (availability) {
        temprooms.push(room);
      }
    }
  
    setrooms(temprooms);
  }


  return (
    <div className="coontainer">
      <div className="row mt-5">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : rooms.length > 1 ? (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-2">
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default Homescreen;
