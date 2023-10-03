const bcrypt = require('bcrypt');
const userPhoneOtpSchema = require("../../MongoDb/models/userModels/phoneOtp");
const newUser = require('../../MongoDb/models/userModels/User');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const springedge = require('springedge');
const dotenv = require('dotenv');
const generateOtp = require('../../utils/generateOtp');
const userMailOtpSchema = require('../../MongoDb/models/userModels/mailOtp.js');


dotenv.config();

module.exports = {

    // Function to handle user registration
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            // Hash the user's password using bcrypt with a salt factor of 10
            userData.password = await bcrypt.hash(userData.password, 10);

            // Create a new user document with the provided user data
            const user = new newUser({
                name: userData.name,
                address: {
                    pincode: userData.pincode,
                    country: userData.country,
                    city: userData.city,
                    state: userData.state,
                },
                verified: false,
                password: userData.password
            });

            // Save the user document to the database
            user.save(user).then((userData) => {
                // Prepare the registration data to be resolved
                const data = {
                    name: userData.name,
                    address: {
                        pincode: userData.pincode,
                        country: userData.country,
                        city: userData.city,
                        state: userData.state,
                    },
                    verified: false,
                }

                // Resolve with the registration data
                resolve(data);
            }).catch(err => {
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
                            <p>This code <b>expires in 1 hour</b>.</p>`
                };

                // Create a transporter for sending emails using nodemailer
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.USER_PASS
                    }
                });

                // Hash the OTP for storage
                const hashedOtp = await bcrypt.hash(otp, 10);

                // Create a record of the OTP in the database
                const userOtp = new userMailOtpSchema({
                    userId: id,
                    otp: hashedOtp,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 3600000
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
        })
    },

    // Function to verify an email OTP and update the user's email if successful
    VerifyEmailOtp: ({ id, otp, email }) => {
        return new Promise(async (resolve, reject) => {
            // Find the user's OTP record in the database based on the user ID
            const user = await userMailOtpSchema.findOne({ userId: new ObjectId(id) });

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
                        await newUser.updateOne({ _id: new ObjectId(id) }, {
                            $set: {
                                email: email
                            }
                        });

                        // Resolve with the updated email
                        resolve(email);
                    }
                }
            }
        })
    },

    // Function to send an OTP to a phone number for verification
    sendPhoneOtpVerification: ({ id, phone }) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Generate a random OTP
                const otp = await generateOtp();

                // Configure parameters for sending SMS using the Spring Edge API
                var params = {
                    'apikey': process.env.SPRING_EDGE_API_KEY, // API Key
                    'sender': 'SEDEMO', // Sender Name
                    'to': [
                        `${phone}`  //Moblie Number
                    ],
                    'message': `Hello ${otp}, This is a test message from spring edge`,
                    'format': 'json'
                };

                // Send the SMS message using Spring Edge API
                await springedge.messages.send(params, 5000, function (err, response) {
                    if (err) {
                        // If there's an error sending the SMS, throw an error
                        throw "something went wrong, Can't send otp right now"
                    }
                });

                // Hash the OTP for storage
                const hashedOtp = await bcrypt.hash(otp, 10);

                // Create a record of the OTP in the database
                const userOtp = new userPhoneOtpSchema({
                    userId: id,
                    otp: hashedOtp,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 3600000
                });

                // Save the OTP record to the database
                const res = await userOtp.save();

                // Resolve with a success message
                resolve("Otp sended successfully");
            } catch (error) {
                // Reject with an error message if something goes wrong
                reject("Something went wrong,Request another OTP")
            }
        })
    },

    // Function to verify a phone number OTP and update the user's phone number if successful
    VerifyPhoneOtp: ({ id, otp, phone }) => {
        return new Promise(async (resolve, reject) => {
            // Find the user's OTP record in the database based on the user ID
            const user = await userPhoneOtpSchema.findOne({ userId: new ObjectId(id) });

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
                        await newUser.updateOne({ _id: new ObjectId(id) }, {
                            $set: {
                                phone: phone,
                                verified: true
                            }
                        });

                        // Resolve with the updated phone number
                        resolve(phone);
                    }
                }
            }
        })
    },

    //To find One user details,then resolve the data
    getUserDetails: ({ id }) => {
        return new Promise(async (resolve, reject) => {
            //matching the user id with mongodb object id 
            newUser.findOne({ _id: new ObjectId(id) }).lean().then((user) => {
                resolve(user);
            }).catch(err => {
                reject(err);
            })
        })
    },
    //To find One user details,then resolve the data
    updateUserDetails: ({ id, dob, name, email, aadhar, phone }) => {
        return new Promise(async (resovle, reject) => {
            newUser.updateOne({ _id: new ObjectId(id) }, {
                $set: {
                    dob: dob,
                    aadhar: aadhar,
                    phone: phone,
                    name: name,
                    email: email,
                }
            }).then((res) => {
                console.log(res);
                resovle(res);
            }).catch(err => {
                reject(err)
            })
        });
    }

}