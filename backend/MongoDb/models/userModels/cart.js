//importing modules
const mongoose = require('mongoose');


//defining the structure of the collection
const cartSchema = new mongoose.Schema({
    userId: {
        type:String,
        required:true,
        unique:true
    },
    proId:{
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
const userCartSchema = mongoose.model('cart',cartSchema);

module.exports = userCartSchema;