import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs } from "antd";
import Loader from "../components/Loader";
import Error from "../components/Error";

const { TabPane } = Tabs;

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="mt-3">
      <Tabs defaultActiveKey="1" style={{ marginLeft: "20px" }}>
        <TabPane tab="Profile" key="1">
          <h1>My Profile</h1>

          <br />

          <h1>Name : {user.name}</h1>
          <h1>Email : {user.email}</h1>
          <h1>isAdmin : {user.isAdmin ? "YES" : "NO"}</h1>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const rooms = await axios.post("/api/booking/getbookingsbyuserid", {
          userid: user._id,
        });
        console.log(rooms.data);
        setbookings(rooms.data);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror(true);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-6">
        {loading && <loader />}
        {bookings &&
          bookings.map((booking) => {
            return (
              <div className="bs">
                <h1>{booking.room}</h1>
                <p>
                  <b>BookingId</b> : {booking._id}
                </p>
                <p>
                  <b>Check In</b> : {booking.fromdate}
                </p>
                <p>
                  <b>Check Out</b> : {booking.todate}
                </p>
                <p>
                  <b>Amount</b> : {booking.totalamount}
                </p>
                <p>
                  <b>Status</b> : {booking.status == "booked" ? "CONFIRMED" : "CANCELLED"}
                </p>

                <div style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary">CANCEL BOOKING</button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
