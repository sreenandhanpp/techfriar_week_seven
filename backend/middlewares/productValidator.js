const { body } = require('express-validator');

module.exports = [

    body('name')
        .notEmpty()
        .withMessage('Product name is required')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Product name must be at least 3 characters'),

    body('description')
        .notEmpty()
        .withMessage('Product description is required')
        .bail()
        .isLength({ min: 10 })
        .withMessage('Product description must be at least 10 characters'),

    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .bail()
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),

    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .bail()
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),

    body('model')
        .notEmpty()
        .withMessage('Product model is required')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Product model must be at least 3 characters'),

    body('manufacturer')
        .notEmpty()
        .withMessage('Manufacturer is required')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Manufacturer must be at least 3 characters'),

    // body('image')
    //     .notEmpty()
    //     .withMessage('Product image is required'),
];
