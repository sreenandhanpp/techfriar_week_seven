const Product = require("../../MongoDb/models/adminModels/Products");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    // Function to retrieve all products from the database
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            // Use the Product model to find all products in the database
            Product.find()
                .then(products => {
                    // Resolve with the retrieved products
                    resolve(products);
                })
                .catch(err => {
                    // Reject with an error message if there's an issue with retrieving products
                    reject(err);
                });
        });
    },

    // Function to retrieve a specific product by ID from the database
    getProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            // Use the Product model to find a product with the provided ID
            Product.findOne({ _id: new ObjectId(id) })
                .then(product => {
                    // If no product is found, reject with an error message
                    if (!product) {
                        reject("Product not found");
                    }
                    // Resolve with the retrieved product data
                    resolve(product);
                })
                .catch(err => {
                    // Reject with an error message if there's an issue with retrieval
                    reject("Something went wrong");
                });
        });
    },


}