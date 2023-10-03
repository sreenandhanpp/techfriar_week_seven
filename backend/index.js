//importing modules
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./MongoDb/connect.js');
const cors = require('cors');
const userRoute = require('./routes/userRoute.js');
const adminRoute = require('./routes/adminRoute.js');
const session = require('express-session');



//compiling .env file
dotenv.config();

//taking the values from .env file
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

//creating the server from express library
const app = express();

//encoding the url to make the data passed through it to a object 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

app.use('/user/api',userRoute);
app.use('/admin/api',adminRoute);


//function to start the server
const StartServer = (MONGODB_URL) => {
    //passing mongoDB url to database connecting function
    connectDB(MONGODB_URL);
    //make the server to listen the port  
    app.listen(PORT, () => {
        console.log(`Server started ${PORT}`)
    });
};


StartServer(MONGODB_URL);
