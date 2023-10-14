const bcrypt = require("bcrypt");
const userPhoneOtpSchema = require("../../MongoDb/models/userModels/phoneOtp");
const newUser = require("../../MongoDb/models/userModels/User");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const springedge = require("springedge");
const generateOtp = require("../../utils/generateOtp");
const userMailOtpSchema = require("../../MongoDb/models/userModels/mailOtp.js");
const BookingSchema = require("../../MongoDb/models/commonModels/Bookings");
const Product = require("../../MongoDb/models/adminModels/Vehicle");
const Vehicle = require("../../MongoDb/models/adminModels/Vehicle");

module.exports = {
  // Function to handle user registration
  doSignup: (userData) => {
    console.log(userData)
    return new Promise(async (resolve, reject) => {
    
      // Hash the user's password using bcrypt with a salt factor of 10
      userData.password = await bcrypt.hash(userData.password, 10);

      // Create a new user document with the provided user data
      const user = new newUser({
        phone: userData.phone,
        name: userData.name,
        email: userData.email,
        address: {
          pincode: userData.pincode,
          country: userData.country,
          city: userData.city,
          state: userData.state,
        },
        verified: false,
        password: userData.password,
        admin: false,
      });

      // Save the user document to the database
      user
        .save(user)
        .then((userData) => {
          // Prepare the registration data to be resolved
          const data = {
            phone: userData.phone,
            id: userData._id,
            email: userData.email,
            name: userData.name,
            address: {
              pincode: userData.address.pincode,
              country: userData.address.country,
              city: userData.address.city,
              state: userData.address.state,
            },
            verified: false,
            admin: userData.admin,
          };

          // Resolve with the registration data
          resolve(data);
        })
        .catch((err) => {
          console.log(err)
          // Reject with any error that occurred during user registration
          reject(err);
        });
    });
  },

  // Function to send an OTP verification email to a user's email address
  sendOtpVerificationEmail: ({ id, email }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Generate a random OTP
        const otp = await generateOtp();

        // Define the email content and options
        const mailOptions = {
          from: "sreenandhanpp@gmail.com",
          to: email,
          subject: "Verify Your Email",
          html: `<p>Enter <b>${otp}</b> in the app to verify your 
                            email address and complete the signup process</p>
                            <p>This code <b>expires in 1 hour</b>.</p>`,
        };

        // Create a transporter for sending emails using nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
          },
        });

        // Hash the OTP for storage
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Create a record of the OTP in the database
        const userOtp = new userMailOtpSchema({
          userId: id,
          otp: hashedOtp,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });

        // Save the OTP record to the database
        await userOtp.save();

        // Send the OTP verification email
        await transporter.sendMail(mailOptions);

        // Resolve with a success message
        resolve("Otp sended successfully");
      } catch (error) {
        // Reject with an error message if something goes wrong
        reject("Something went wrong,Request another OTP");
      }
    });
  },

  // Function to verify an email OTP and update the user's email if successful
  VerifyEmailOtp: ({ id, otp }) => {
    return new Promise(async (resolve, reject) => {
      // Find the user's OTP record in the database based on the user ID
      const user = await userMailOtpSchema.findOne({
        userId: new ObjectId(id),
      });

      // If the user record is not found, reject with an error message
      if (!user) {
        reject("User not found");
      } else {
        const { expiresAt } = user.expiresAt;
        const hashedOtp = user.otp;

        // Check if the OTP has expired
        if (expiresAt < Date.now()) {
          // If expired, delete the OTP record and reject with an error message
          await userMailOtpSchema.deleteOne({ userId: new ObjectId(id) });
          reject("Code has expired. Please request again");
        } else {
          // Compare the provided OTP with the hashed OTP in the database
          const validOtp = await bcrypt.compare(otp, hashedOtp);

          // If the OTP is invalid, reject with an error message
          if (!validOtp) {
            reject("Invalid code please check your inbox");
          } else {
            // If the OTP is valid, delete the OTP record and update the user's email
            await userMailOtpSchema.deleteOne({ userId: new ObjectId(id) });
            // Resolve with the updated email
            resolve("Email verified successfully");
          }
        }
      }
    });
  },

  // Function to send an OTP to a phone number for verification
  sendPhoneOtpVerification: ({ id, phone }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Generate a random OTP
        const otp = await generateOtp();

        // Configure parameters for sending SMS using the Spring Edge API
        var params = {
          apikey: process.env.SPRING_EDGE_API_KEY, // API Key
          sender: "SEDEMO", // Sender Name
          to: [
            `${phone}`, //Moblie Number
          ],
          message: `Hello ${otp}, This is a test message from spring edge`,
          format: "json",
        };

        // Send the SMS message using Spring Edge API
        await springedge.messages.send(params, 5000, function (err, response) {
          if (err) {
            // If there's an error sending the SMS, throw an error
            throw "something went wrong, Can't send otp right now";
          }
        });

        // Hash the OTP for storage
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Create a record of the OTP in the database
        const userOtp = new userPhoneOtpSchema({
          userId: id,
          otp: hashedOtp,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000,
        });

        // Save the OTP record to the database
        const res = await userOtp.save();

        // Resolve with a success message
        resolve("Otp sended successfully");
      } catch (error) {
        // Reject with an error message if something goes wrong
        reject("Something went wrong,Request another OTP");
      }
    });
  },

  // Function to verify a phone number OTP and update the user's phone number if successful
  VerifyPhoneOtp: ({ id, otp }) => {
    return new Promise(async (resolve, reject) => {
      // Find the user's OTP record in the database based on the user ID
      const user = await userPhoneOtpSchema.findOne({
        userId: new ObjectId(id),
      });

      // If the user record is not found, reject with an error message
      if (!user) {
        reject("User not found");
      } else {
        const { expiresAt } = user.expiresAt;
        const hashedOtp = user.otp;

        // Check if the OTP has expired
        if (expiresAt < Date.now()) {
          // If expired, delete the OTP record and reject with an error message
          await userPhoneOtpSchema.deleteOne({ userId: new ObjectId(id) });
          reject("Code has expired. Please request again");
        } else {
          // Compare the provided OTP with the hashed OTP in the database
          validOtp = await bcrypt.compare(otp, hashedOtp);

          // If the OTP is invalid, reject with an error message
          if (!validOtp) {
            reject("Invalid code please check your inbox");
          } else {
            // If the OTP is valid, delete the OTP record and update the user's phone number
            await userPhoneOtpSchema.deleteOne({ userId: new ObjectId(id) });
            await newUser.updateOne(
              { _id: new ObjectId(id) },
              {
                $set: {
                  verified: true,
                },
              }
            );
            // Resolve with the updated phone number
            resolve("Phone number verified Successfully");
          }
        }
      }
    });
  },

  // Function to perform user login
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      // Find a user in the database with the provided email
      const user = await newUser.findOne({ email: userData.email });

      // If a user with the provided email is found
      if (user) {
        // Compare the provided password with the hashed password stored in the database
        let status = await bcrypt.compare(userData.password, user.password);

        // If the password matches
        if (status) {
          // Prepare user data for response
          const data = {
            id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone,
            admin: user.admin
          };

          // Resolve with the user data
          resolve(data);
        } else {
          // Reject with an error message for incorrect password
          reject("Incorrect email or password");
        }
      } else {
        // Reject with an error message for incorrect email
        reject("Incorrect email or password");
      }
    });
  },

  // Function to create booking details
  createBookingDetails: ({ proId, userId }) => {
    return new Promise(async (resolve, reject) => {
      await Vehicle.updateOne(
        { _id: new ObjectId(proId) },
        {
          $inc: {
            quantity: -1,
          },
        }
      );
      const isBooking = await BookingSchema.findOne({
        userId: new ObjectId(userId),
      });
      if (isBooking) {
        BookingSchema.findOneAndUpdate(
          { userId: new ObjectId(userId) },
          {
            $push: {
              bookingList: [
                {
                  _id: new ObjectId(proId),
                  booking_status: "PENDING",
                  payment_status: true,
                },
              ],
            },
          }
        )
          .then((res) => {
            console.log(res);
            resolve("Vehicle booked successfully"); // Resolve with success message
          })
          .catch((err) => {
            reject("something went wrong on booking"); // Reject with error message if there's an issue
          });
      } else {
        // Create a new Booking instance using the BookingSchema
        const Booking = new BookingSchema({
          userId: new ObjectId(userId), // Assign the user ID to the booking
          bookingList: [
            {
              _id: new ObjectId(proId), // Assign the product ID to the booking
              booking_status: "PENDING", //Set booking_status to PENDING indicating the booing is on process
              payment_status: true, // Set payment_status to true indicating successful payment
            },
          ],
        });
        // Save the booking instance to the database
        Booking.save(Booking)
          .then((res) => {
            console.log(res);
            resolve("Vehicle booked successfully"); // Resolve with success message
          })
          .catch((err) => {
            reject("something went wrong on booking"); // Reject with error message if there's an issue
          });
      }
    });
  },

  getBookingDetails: ({ id }) => {
    return new Promise(async (resolve, reject) => {
      //   const bookedProducts = await BookingSchema.findOne({
      //     userId: new ObjectId(id),
      //   })
      //     .populate("vehicles")
      //     .exec();
      try {
        const bookedProducts = await BookingSchema.aggregate([
          {
            $match: { userId: new ObjectId(id) },
          },
          {
            $lookup: {
              from: "vehicles",
              let: { bookList: "$bookingList" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$_id", "$$bookList._id"],
                    },
                  },
                },
              ],
              as: "bookings",
            },
          },
        ]);
        // console.log(bookedProducts)
        // coVehiclensole.log(bookedProducts[0].bookings);
        const structureBookings = (bookedProducts) => {
          for (const bookingObject of bookedProducts) {
            // Iterate through the bookingList array
            let bkl = bookingObject.bookings.length - 1;
            for (let j = 0; j < bookingObject.bookings.length; j++) {
              // Find the corresponding booking in the bookings array by productId
              bookingObject.bookings[bkl].bookingDetails =
                bookingObject.bookingList[j];
              bkl = bkl - 1;
              // Create a new object combining product and booking details
              // Add the combined object to the new array
            }
          }
          return bookedProducts;
        };
        const newArray = await structureBookings(bookedProducts);
        resolve(newArray[0].bookings);
      } catch (err) {
        console.log(err);
        reject("Something went wrong on,collecting booking details");
      }
    });
  },
  sendCancelRequest: ({ userId, proId }) => {
    console.log(userId, proId);
    return new Promise(async (resolve, reject) => {
      BookingSchema.updateOne(
        {
          userId:new ObjectId(userId), // The user's _id
          "bookingList._id":new ObjectId(proId), // The specific booking's _id
        },
        {
          $set: {
            "bookingList.$[elem].cancel_status": "REQUESTED", // Replace "NEW_STATUS" with the new booking status you want to set
          },
        },
        {
          arrayFilters: [{ "elem._id":new ObjectId(proId) }], // The specific booking's _id
        }
      )
        .then((res) => {
          console.log(res);
          resolve("Cancel request sended Successfully");
        })
        .catch((err) => {
          reject("Something went wrong on sending cancel request");
        });
    });
  },
};
