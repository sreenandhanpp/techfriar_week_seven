const { Router } = require('express');
const adminHelper = require('../helpers/adminHelper');
const { generateUrls } = require('../utils/GenerateUrl');
const productValidator = require('../middlewares/productValidator');
const { validationResult } = require('express-validator');
const router = Router();


router.post('/create-product', productValidator, (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        // Extract the validation errors and send a 401 (Unauthorized) response with the errors
        let errors = err.array();
        res.status(401).json({ error: errors });
    } else {
        try {
            generateUrls(req).then(urls => {
                if (urls.length == 4) {
                    adminHelper.createProduct(req.body, urls).then(resp => {
                        res.status(200).json({ message: resp });
                    }).catch(err => {
                        res.status(400).json({ message: err });
                    });
                }
            }).catch(err => {
                res.status(400).json({ message: err });
            })
        } catch (error) {
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





module.exports = router;
