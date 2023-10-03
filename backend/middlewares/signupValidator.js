const { body } = require('express-validator');

// Define an array of validation middleware functions using Express-validator
module.exports = [
  // Validate the 'name' field
  body('name')
    .notEmpty()
    .withMessage('Full name is required')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters'),

  // Validate the 'pincode' field
  body('pincode')
    .notEmpty()
    .withMessage('Pin code is required')
    .bail()
    .matches(/^\d{6}$/)
    .withMessage('Invalid Indian pin code format'),

  // Validate the 'password' field
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  // Validate the 'confirmPassword' field, ensuring it matches the 'password' field
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .bail()
    .custom(async (value, { req }) => {
      const password = await Promise.resolve(req.body.password); // Resolve the Promise

      if (value !== password) {
        throw new Error('Passwords must match');
      }

      return true;
    }),

  // Validate the 'country' field
  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .bail()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Country must contain only letters and spaces')
  ,

  // Validate the 'city' field
  body('city')
    .notEmpty().withMessage('City is required')
    .bail()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Country must contain only letters and spaces')
  ,

  // Validate the 'state' field
  body('state')
    .notEmpty()
    .withMessage('State is required')
    .bail()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Country must contain only letters and spaces')
];
