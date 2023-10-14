const Vehicle = require("../../MongoDb/models/adminModels/Vehicle");
const cloudinary = require("../../utils/cloudinaryConfig");
const { otps } = require("../../utils/cloudinaryCredential");
const mongoose = require("mongoose");
const deleteProductImage = require("./deleteProductImage");
const BookingSchema = require("../../MongoDb/models/commonModels/Bookings");
const newUser = require("../../MongoDb/models/userModels/User");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  // Function to create a new product in the database
  createProduct: (body, urls) => {
    return new Promise(async (resolve, reject) => {
      // Extract product information from the request body
      const { name, description, quantity, price, model, manufacturer } = body;

      // Create a new Product document with the provided information
      const vehicles = new Vehicle({
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        images: urls,
        manufacturer: manufacturer,
        model: model,
      });

      // Save the product document to the database
      vehicles
        .save(vehicles)
        .then((res) => {
          // Resolve with a success message if the product is created successfully
          resolve("Product created successfully");
        })
        .catch((err) => {
          // Reject with an error message if there's an issue creating the product
          reject("Something went wrong on creating the product");
        });
    });
  },

  // Function to delete a product from the database and associated images
  deleteProduct: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Find and delete the product document from the database using the provided product ID
        Vehicle.findOneAndDelete({ _id: new ObjectId(id) })
          .then((deletedProduct) => {
            if (!deletedProduct) {
              // If the product doesn't exist, reject with an error message
              reject("Product not found");
            } else {
              // Call a function to delete associated images
              deleteProductImage(deletedProduct.images)
                .then(() => {
                  // Resolve with a success message if the product and images are deleted successfully
                  resolve("Product deleted successfully");
                })
                .catch((err) => {
                  // Reject with an error message if there's an issue with image deletion
                  reject(err);
                });
            }
          })
          .catch((err) => {
            // Reject with an error message if there's an issue with product deletion
            reject("Something went wrong with product deletion");
          });
      } catch (error) {
        // Reject with a general error message if an exception occurs
        reject("Something went wrong");
      }
    });
  },

  // Function to update an existing product in the database
  updateProduct: (body, urls) => {
    return new Promise(async (resolve, reject) => {
      // Extract updated product information from the request body
      const { id, name, description, quantity, price, model, manufacturer } =
        body;

      // Find and update the product document in the database using the provided product ID
      Vehicle.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: name,
            description: description,
            price: price,
            quantity: quantity,
            images: urls,
            manufacturer: manufacturer,
            model: model,
          },
        }
      )
        .then((updatedProduct) => {
          if (!updatedProduct) {
            // If the product doesn't exist, reject with an error message
            reject("Product not found");
          } else {
            // Call a function to delete previous images associated with the product
            deleteProductImage(updatedProduct.images)
              .then(() => {
                // Resolve with a success message if the product is updated successfully
                resolve("Product updated successfully");
              })
              .catch((err) => {
                // Reject with an error message if there's an issue with image deletion
                reject(err);
              });
          }
        })
        .catch((err) => {
          // Reject with an error message if there's an issue with product updating
          reject("Something went wrong with updating the product");
        });
    });
  },

  // Function to upload a product image to Cloudinary
  uploadProductImage: (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        let imgData = {};
        // Use the Cloudinary uploader to upload the image from the provided temporary file path
        cloudinary.uploader.upload(file, (error, result) => {
          if (result && result.secure_url) {
            (imgData.id = result.public_id), (imgData.url = result.secure_url);
            // If the upload is successful, resolve with the secure URL of the uploaded image
            resolve(imgData);
          } else {
            // If there's an error or the secure URL is not present, reject with an error message
            reject("something went wrong on uploading images!!");
          }
        });
      } catch (error) {
        // If there's an exception, reject with an error message
        reject(error);
      }
    });
  },

  updateAdminDetails: ({
    phone,
    name,
    email,
    pincode,
    country,
    city,
    state,
    password,
    img_id,
    image,
  }) => {
    return new Promise(async (resolve, reject) => {
      if (img_id) {
        await cloudinary.uploader.destroy(img_id);
      }
      // Use the Cloudinary uploader to upload the image from the provided temporary file path
      cloudinary.uploader.upload(image, (error, result) => {
        if (result && result.secure_url) {
          // If the upload is successful, resolve with the secure URL of the uploaded image
          newUser
            .findOne(
              { admin: true },
              {
                phone: phone,
                name: name,
                email: email,
                address: {
                  pincode: pincode,
                  country: country,
                  city: city,
                  state: state,
                },
                password: password,
                profile_image: {
                  _id: result.public_id,
                  url: result.secure_url,
                },
              }
            )
            .then((res) => {
              resolve(res);
            });
        } else {
          // If there's an error or the secure URL is not present, reject with an error message
          reject("something went wrong on uploading images!!");
        }
      });
    });
  },
  getAllBookedDetails: () => {
    return new Promise(async (resolve, reject) => {
      BookingSchema.aggregate([
        {
          $unwind: "$bookingList",
        },
        {
          $project: {
            _id: 0,
            userId: 1,
            bookingList: 1,
          },
        },
      ])
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject("Something went wrong on fetching booking details");
        });
    });
  },
  acceptBooking: ({ userId, vehicleId }) => {
    return new Promise(async (resolve, reject) => {
      BookingSchema.updateOne(
        {
          userId: new ObjectId(userId), // Replace with the user's ObjectId
          "bookingList._id": new ObjectId(vehicleId), // Replace with the product's ObjectId
        },
        {
          $set: { "bookingList.$.booking_status": "SUCCESS" }, // Replace with the desired status update
        }
      )
        .then((res) => {
          resolve("Booking Accepted Successfully");
        })
        .catch((err) => {
          reject("Something went wrong on Accepting Booking");
        });
    });
  },
  rejectBooking: ({ userId, vehicleId }) => {
    console.log(userId,vehicleId)
    return new Promise(async (resolve, reject) => {
      BookingSchema.updateOne(
        {
          userId: new ObjectId(userId), // Replace with the user's ObjectId
          "bookingList._id": new ObjectId(vehicleId), // Replace with the product's ObjectId
        },
        {
          $set: { "bookingList.$.booking_status": "REJECTED" }, // Replace with the desired status update
        }
      )
        .then((res) => {
          resolve("Booking Rejected Successfully");
        })
        .catch((err) => {
          reject("Something went wrong on Rejecting Booking");
        });
    });
  },
};
