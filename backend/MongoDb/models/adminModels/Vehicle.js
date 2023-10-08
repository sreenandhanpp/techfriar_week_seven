//importing modules
const mongoose = require('mongoose');


//defining the structure of the collection
const vehicleSchema = new mongoose.Schema({
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
    images: [ 
        {
            id:{
                type: String,
                required: true,
            },
            url:{
                type:String,
                required: true
            }
        },
        {
            id:{
                type: String,
                required: true,
            },
            url:{
                type:String,
                required: true
            }
        },
        {
            id:{
                type: String,
                required: true,
            },
            url:{
                type:String,
                required: true
            }
        },
        {
            id:{
                type: String,
                required: true,
            },
            url:{
                type:String,
                required: true
            }
        }
     ],
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
const Vehicle = mongoose.model('vehicles', vehicleSchema);

module.exports = Vehicle;