const mongoose = require("mongoose"); //create mongoose require package

//create the schema
const roomSchema = mongoose.Schema({

    //type all the properties of our room model
    name : {
        type: String,
        required: true 
    },
    maxcount : {
        type: Number,
        required: true 
    },
    phonenumber : {
        type: Number,
        required: true 
    },
    rentperday : {
        type: Number,
        required: true 
    },
    imageurls : [],
    currentbookings : [],
    type : {
        type: String,
        required: true 
    },
    description : {
        type: String,
        required: true 
    },

}, {
    timestamps : true,
})

//create room model
const roomModel = mongoose.model('rooms', roomSchema)

module.exports = roomModel