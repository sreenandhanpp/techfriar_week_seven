//importing modules
const mongoose = require('mongoose');


//defining the structure of the collection
const OtpSchema = new mongoose.Schema({
    userId: {
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
});

//creating the model
const userMailOtpSchema = mongoose.model('emailOtp',OtpSchema);

module.exports = userMailOtpSchema;