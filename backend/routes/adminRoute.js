const { Router } = require('express');
const adminHelper = require('../helpers/adminHelper');
const { generateUrls } = require('../utils/GenerateUrl');
const productValidator = require('../middlewares/productValidator');
const { validationResult } = require('express-validator');
const commonHelper = require('../helpers/commonHelper');
const router = Router();

const multer = require('multer');

// Set up multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle POST request to create a new product
router.post('/create-product', productValidator, (req, res) => {
    // Validate the request data using the productValidator middleware
    let images = [...req.body.images];
    const err = validationResult(req);

    // If there are validation errors in the request data
    if (!err.isEmpty()) {
        // Respond with a 401 (Unauthorized) status and the validation error details
        let errors = err.array();
        res.status(401).json({ error: errors });
    } else {
        try {
            // Generate image URLs for the new product using generateUrls function
            generateUrls(images)
                .then(urls => {
                    if (urls.length == 4) {
                        // If there are exactly 4 image URLs generated, proceed to create the product
                        adminHelper.createProduct(req.body, urls)
                            .then(resp => {
                                // Respond with a 200 (OK) status and a success message if the product is created successfully
                                res.status(200).json({ message: resp });
                            })
                            .catch(err => {
                                console.log(err)
                                // Respond with a 400 (Bad Request) status and an error message if product creation fails
                                res.status(400).json({ message: err });
                            });
                    }
                })
                .catch(err => {
                    // Respond with a 400 (Bad Request) status and an error message if there's an issue generating image URLs
                    res.status(400).json({ message: err });
                });
        } catch (error) {
            // Respond with a 400 (Bad Request) status and a general error message if something goes wrong
            res.status(400).json({ message: error });
        }
    }
});


// Handle POST request to delete a product
router.post('/delete-product', (req, res) => {
    // Call a function to delete the product based on the product ID in the request body
    adminHelper.deleteProduct(req.body.id)
        .then(resp => {
            // Respond with a 200 (OK) status and a success message if the deletion is successful
            res.status(200).json({ message: resp });
        })
        .catch(err => {
            // Respond with a 400 (Bad Request) status and an error message if deletion fails
            res.status(400).json({ message: err });
        });
});

// Handle POST request to update a product
router.post('/update-product', productValidator, (req, res) => {

    let images = [...req.body.images];

    // Validate the request data using the productValidator middleware
    const err = validationResult(req);

    // If there are validation errors in the request data
    if (!err.isEmpty()) {
        // Respond with a 401 (Unauthorized) status and the validation error details
        let errors = err.array();
        res.status(401).json({ error: errors });
    } else {
        try {
            // Generate image URLs for the updated product using generateUrls function
            generateUrls(images)
                .then(urls => {
                    if (urls.length == 4) {
                        // If there are exactly 4 image URLs generated, proceed to update the product
                        adminHelper.updateProduct(req.body, urls)
                            .then(resp => {
                                // Respond with a 200 (OK) status and a success message if the update is successful
                                res.status(200).json({ message: resp });
                            })
                            .catch(err => {
                                // Respond with a 400 (Bad Request) status and an error message if the update fails
                                res.status(400).json({ message: err });
                            });
                    }
                })
                .catch(err => {
                    // Respond with a 400 (Bad Request) status and an error message if there's an issue generating image URLs
                    res.status(400).json({ message: err });
                });
        } catch (error) {
            // Respond with a 400 (Bad Request) status and a general error message if something goes wrong
            res.status(400).json({ message: error });
        }
    }
});









module.exports = router;
