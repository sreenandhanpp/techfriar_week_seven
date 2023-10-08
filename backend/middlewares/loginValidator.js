const { body } = require('express-validator');

// Define an array of validation middleware functions for login validation
module.exports = [
    // Validate the 'email' field
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Invalid email address'),

    // Validate the 'password' field
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];