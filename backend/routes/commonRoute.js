const userHelper = require('../helpers/userHelper');
const { resendPhoneOtp, resendEmailOtp } = require('../helpers/userHelper/resendOtp');
const signupValidator = require('../middlewares/signupValidator');
const phoneValidator = require('../middlewares/phoneValidator');
const loginValidator = require('../middlewares/loginValidator');
const emailValidator = require('../middlewares/emailValidator');
const { validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();


// Handle GET request to retrieve all products
router.get('/all-product', (req, res) => {
    // Call the getAllProducts function from commonHelper to retrieve all products from the database
    commonHelper.getAllProducts()
        .then(products => {
            // Respond with a 200 (OK) status and the retrieved product data
            res.status(200).json(products);
        })
        .catch(err => {
            // Respond with a 400 (Bad Request) status and an error message if there's an issue with retrieval
            res.status(400).json(err);
        });
});

// Handle GET request to retrieve a specific product by ID
router.get('/get-product', (req, res) => {
    // Call the getProduct function from commonHelper, passing the product ID from the request body
    commonHelper.getProduct(req.body.id)
        .then(product => {
            // Respond with a 200 (OK) status and the retrieved product data
            res.status(200).json(product);
        })
        .catch(err => {
            // Respond with a 400 (Bad Request) status and an error message if there's an issue with retrieval
            res.status(400).json(err);
        });
});

module.exports = router;