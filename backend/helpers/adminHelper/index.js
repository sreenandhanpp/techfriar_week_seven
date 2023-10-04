const Product = require("../../MongoDb/models/adminModels/Products");
const cloudinary = require("../../utils/cloudinaryConfig");
const { otps } = require("../../utils/cloudinaryCredential");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;



module.exports = {
    // Function to create a new product in the database
    createProduct: (body, urls) => {
        return new Promise(async (resolve, reject) => {
            // Extract product information from the request body
            const { name, description, quantity, price, model, manufacturer } = body;

            // Create a new Product document with the provided information
            const product = new Product({
                name: name,
                description: description,
                price: price,
                quantity: quantity,
                images: urls,
                manufacturer: manufacturer,
                model: model
            });

            // Save the product document to the database
            product.save(product)
                .then(res => {
                    // Resolve with a success message if the product is created successfully
                    resolve("Product created successfully");
                })
                .catch(err => {
                    // Reject with an error message if there's an issue creating the product
                    reject("Something went wrong on creating the product");
                });
        });
    },

    // Function to delete a product from the database
    deleteProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            // Delete the product document from the database using the provided product ID
            Product.deleteOne({ _id: new ObjectId(id) })
                .then(res => {
                    // Resolve with a success message if the product is deleted successfully
                    resolve('Product deleted successfully');
                })
                .catch(err => {
                    // Reject with an error message if there's an issue with product deletion
                    reject('Something went wrong with product deletion');
                });
        });
    },

    // Function to upload a product image to Cloudinary
    uploadProductImage: (file) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Use the Cloudinary uploader to upload the image from the provided temporary file path
                cloudinary.uploader.upload(file.tempFilePath, otps, (error, result) => {
                    if (result && result.secure_url) {
                        // If the upload is successful, resolve with the secure URL of the uploaded image
                        resolve(result.secure_url);
                    } else {
                        // If there's an error or the secure URL is not present, reject with an error message
                        reject("something went wrong on uploading images!!")
                    }
                })
            } catch (error) {
                // If there's an exception, reject with an error message
                reject(error)
            }
        })
    }
}