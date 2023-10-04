//importing modules
const mongoose = require('mongoose');


//defining the structure of the collection
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [ String ],
    quantity: {
        type: Number,
        required: true,
    },
    manufacturer:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required: true
    }
});

//creating the model
const Product = mongoose.model('products', productSchema);

module.exports = Product;