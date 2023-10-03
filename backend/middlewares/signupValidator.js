const { body,validationResult } = require('express-validator');
const newUser = require('../MongoDb/models/userModels/User.js');

//validaing form

module.exports = [
// Validate email
body('email')
.custom(async (value) => {
  const user = await newUser.findOne({ email: value });
  if (user) {
    throw new Error('Email already exists');
  }
  return true;
}),
body('phone')
.custom(async (value) => {
  const user = await newUser.findOne({ phone: value });
  if (user) {
    throw new Error('Phone number already exists');
  }
  return true;
}),
body('aadhar')
.custom(async (value) => {
  const user = await newUser.findOne({ aadhar: value });
  if (user) {
    throw new Error('Aadhar number already exists');
  }
  return true;
}),

    
    // .custom((value,{req}) => {
    //     if (value !== req.body.confirmPass) {
    //         // trow error if passwords do not match
    //         throw new Error("Passwords don't match");
    //     }
    //     return true;
    // })
]