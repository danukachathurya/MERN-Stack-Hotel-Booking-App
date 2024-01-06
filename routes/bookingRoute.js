const express = require("express");
const router = express.Router();
const Bookings = require("../models/booking");
const moment = require("moment");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51OUxf7BkRKQHJh5bdwoNAORJrSGlV1Ra3vGaeAMJW8gdRyoejubOULXxElGk3sZ0kZ4X0l92n05DZunnj97cINsX00007y395c"
);

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } =
    req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "usd",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(), //customer can not charges twice
      }
    );

    if (payment) {
      const newbooking = new Bookings({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        todate: moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        totalamount,
        totaldays,
        transactionid: "1234",
      });

      const booking = await newbooking.save();

      const roomtemp = await Room.findOne({ _id: room._id });

      roomtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        todate: moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });

      await roomtemp.save();
    }

    res.send("Payment Successfull, Your Room is Booked");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid", async(req, res) => {

  const userid = req.body.userid;

  try {
    const booking = await Bookings.find({userid : userid})
    res.send(booking);
  } catch (error) {
    return res.status(400).json({ error });
  }

});

router.post("/cancelbooking", async(req, res) => {
  const {bookingid, roomid} = req.body

  try {
    
    const bookingitem = await Bookings.findOne({_id : bookingid})

    bookingitem.status = 'cancelled'
    await bookingitem.save()
    const room = await Room.findOne({_id : roomid})

    const booking = room.currentbookings

    const temp = booking.filter(booking => booking.bookingid.toString()!==bookingid)
    room.currentbookings = temp

    await room.save()

    res.send('Your booking cancelled successfully')

  } catch (error) {
    return res.status(400).json({error})
  }
})


module.exports = router;
