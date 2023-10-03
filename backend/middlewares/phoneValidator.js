const { body } = require('express-validator');
const newUser = require('../MongoDb/models/userModels/User.js');


// Define an array of validation middleware functions for phone number validation
module.exports = [
  // Validate the 'phone' field
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone('any', { strictMode: false })
    .withMessage('Invalid phone number format')
    .custom(async (value) => {
      // Check if an existing user with the same phone number exists in the database
      const existingNumber = await newUser.findOne({ phone: value }).exec();

      // If an existing phone number is found, throw an error indicating that it already exists
      if (existingNumber) {
        throw new Error('Phone number already exists');
      }

      // Return true if validation passes
      return true;
    }),
];
