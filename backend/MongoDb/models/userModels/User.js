//importing modules
const mongoose = require('mongoose');


//defining the structure of the collection
const newUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: true
    },
    phone: {
        type: String,
        required: false,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        country: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String ,
            required: true,
        }
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true
    }
});

//creating the model
const newUser = mongoose.model('user', newUserSchema);

module.exports = newUser;