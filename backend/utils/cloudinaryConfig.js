const cloud = require('cloudinary').v2;


require('dotenv').config();
cloud.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});




module.exports =  cloud;