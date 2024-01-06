import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  console.log(roomid);

  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setroom] = useState();

  const fromDate = moment(fromdate, "DD-MM-YYYY");
  const toDate = moment(todate, "DD-MM-YYYY");

  const totaldays = moment.duration(toDate.diff(fromDate)).asDays() + 1;
  const [totalamount, settotalamount] = useState();

  useEffect(() => {

    if(localStorage.getItem('currentUser')){
      window.localStorage.reload='/login'
    }

    const fetchData = async () => {
      try {
        setloading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", { roomid: roomid })
        ).data;
        settotalamount(data.rentperday * totaldays);
        setroom(data);
        setloading(false);
      } catch (error) {
        setloading(false);
        seterror(true);
      }
    };
    fetchData();
  }, []);

  async function onToken(token) {
    console.log(token);

    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token
    };

    try {
      setloading(true);
      const result = await axios.post("/api/booking/bookroom", bookingDetails);
      setloading(false);
      Swal.fire('Congratulation', 'Your Room Booked Successfully', 'success').then(result => {
        window.location.href = '/booking'
      })
    } catch (error) {
      setloading(false);
      Swal.fire('OOps', 'Your Room Booked Failure', 'error')
    }
      
  }

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>

            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />

                <b>
                  <p>
                    Name :{" "}
                    {JSON.parse(localStorage.getItem("currentUser")).name}
                  </p>
                  <p>From Date : {fromdate}</p>
                  <p>To Date : {todate}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <h1>Amount</h1>
                <hr />

                <b>
                  <p>Total days : {totaldays}</p>
                  <p>Rent per day : {room.rentperday}</p>
                  <p>Total Amount : {totalamount}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalamount * 100}
                  token={onToken}
                  currency="USD"
                  stripeKey="pk_test_51OUxf7BkRKQHJh5bxkfhTarqoicTflibhRCxme4CjfoZd39TB9uEGD2bS1NL3F5iWsmzuD5BVPDBuPZXOY5ZlRUy00ATvv7YhL"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
