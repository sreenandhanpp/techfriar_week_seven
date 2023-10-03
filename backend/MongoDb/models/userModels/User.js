//importing modules
const mongoose = require('mongoose');


//defining the structure of the collection
const newUserSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    aadhar:{
        type:String,
        required:true,
        unique:true
    },
    dob:{
        type:Date,
        required:true,
        unique:true
    },
    verified:{
        type:Boolean,
        required: true
    }
});

//creating the model
const newUser = mongoose.model('user',newUserSchema);

module.exports = newUser;