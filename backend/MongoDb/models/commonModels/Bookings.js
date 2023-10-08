//importing modules
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


//defining the structure of the collection
const Schema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        unique: true
    },
    vehicles: [
        {
            type: ObjectId,
            ref: 'vehicles'
        }
    ],
    payment_status: {
        type: Boolean,
        required: true
    }
});

//creating the model
const BookingSchema = mongoose.model('booking', Schema);

module.exports = BookingSchema;