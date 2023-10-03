//importing mongoose module to connect the server to mongoDb database
const mongoose = require('mongoose');

//function to connect database
const connectDB = (url) => {
    mongoose.set('strictQuery',true);
    mongoose.connect(url)
    .then(()=>console.log('MongoDB connected...'))
    .catch((err)=>console.log(err))
}

module.exports = connectDB;