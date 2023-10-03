const { body } = require('express-validator');
const newUser = require('../MongoDb/models/userModels/User.js');

// Define an array of validation middleware functions for email validation
module.exports = [
    // Validate the 'email' field
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            // Check if an existing user with the same email exists in the database
            const existingUser = await newUser.findOne({ email: value }).exec();

            // If an existing user is found, throw an error indicating that the email already exists
            if (existingUser) {
                throw new Error('Email already exists');
            }

            // Return true if validation passes
            return true;
        }),
];