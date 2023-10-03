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
    //user signup
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            //creating user object using user Model
            const user = new newUser({
                name: userData.name,
                email: userData.email,
                dob: userData.dob,
                aadhar: userData.aadhar,
                verified: false,
                phone: userData.phone
            });
            //save the user collection using SAVE method,if success resolve the inserted data or reject with error msg
            user.save(user).then((data) => {
                const userData = {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    dob: data.dob,
                    aadhar: data.aadhar,
                    verified: data.verified,
                    phone: data.phone
                };
                resolve(userData);
            }).catch(err => {
                reject(err);
            });
        });
    },
    //sending email verification otp using nodemailer 
    sendOtpVerificationEmail: ({ id, email }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const otp = await generateOtp();

                //creating mail template and conifiguring sender and reciever details
                const mailOptions = {
                    from: "sreenandhanpp@gmail.com",
                    to: email,
                    subject: "Verify Your Email",
                    html: `<p>Enter <b>${otp}</b> in the app to verify your 
                            email address and complete the signup process</p>
                            <p>This code <b>expires in 1 hour</b>.</p>`
                };
                //creating transporter 
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.USER_PASS
                    }
                });
                const hashedOtp = await bcrypt.hash(otp, 10);
                const userOtp = new userMailOtpSchema({
                    userId: id,
                    otp: hashedOtp,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 3600000
                });
                await userOtp.save();
                await transporter.sendMail(mailOptions);
                const data = {
                    isEmailVerified: true
                }
                resolve("Otp sended successfully");
            } catch (error) {
                reject("Something went wrong,Request another OTP");
            }
        })
    },
    /*takes user id and otp as argument search the user in phone-otp collection,
        -->if user not found reject : user not found
        -->else check otp is valid or not 
        -->if not valid reject : Code has expired. Please request again
        -->else compare the otps
        -->if otp not matching reject : Invalid code please check your inbox
        -->else resolve : Account verified successfully.
    */
    VerifyEmailOtp: ({ id, otp }) => {
        return new Promise(async (resolve, reject) => {
            const user = await userMailOtpSchema.findOne({ userId: new ObjectId(id) });
            if (!user) {
                reject("User not found");
            } else {
                const { expiresAt } = user.expiresAt;
                const hashedOtp = user.otp;
                if (expiresAt < Date.now()) {
                    await userMailOtpSchema.deleteOne({ userId: new ObjectId(id) });
                    reject("Code has expired. Please request again");
                } else {
                    const validOtp = await bcrypt.compare(otp, hashedOtp);
                    if (!validOtp) {
                        reject("Invalid code please check your inbox");
                    } else {
                        await userMailOtpSchema.deleteOne({ userId: new ObjectId(id) });
                        resolve("Email verified successfully.");
                    }
                }
            }
        })
    },
    //sending phone verification otp using springEdge 
    sendPhoneOtpVerification: ({ id, phone }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const otp = await generateOtp();

                //sending sms uing springedge
                var params = {
                    'apikey': process.env.SPRING_EDGE_API_KEY, // API Key
                    'sender': 'SEDEMO', // Sender Name
                    'to': [
                        `${phone}`  //Moblie Number
                    ],
                    'message': `Hello ${otp}, This is a test message from spring edge`,
                    'format': 'json'
                };

                await springedge.messages.send(params, 5000, function (err, response) {
                    if (err) {
                        throw "something went wrong, Can't send otp right now"
                    }
                });

                const hashedOtp = await bcrypt.hash(otp, 10);
                const userOtp = new userPhoneOtpSchema({
                    userId: id,
                    otp: hashedOtp,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 3600000
                });
                const res = await userOtp.save();
                resolve("Otp sended successfully");
            } catch (error) {
                reject("Something went wrong,Request another OTP")
            }
        })
    },
    /*takes user id and otp as argument search the user in phone-otp collection,
        -->if user not found reject : user not found
        -->else check otp is valid or not 
        -->if not valid reject : Code has expired. Please request again
        -->else compare the otps
        -->if otp not matching reject : Invalid code please check your inbox
        -->else resolve : Account verified successfully.
    */
    VerifyPhoneOtp: ({ id, otp }) => {
        return new Promise(async (resolve, reject) => {
            const user = await userPhoneOtpSchema.findOne({ userId: new ObjectId(id) });
            if (!user) {
                reject("User not found");
            } else {
                const { expiresAt } = user.expiresAt;
                const hashedOtp = user.otp;
                if (expiresAt < Date.now()) {
                    await userPhoneOtpSchema.deleteOne({ userId: new ObjectId(id) });
                    reject("Code has expired. Please request again");
                } else {
                    validOtp = await bcrypt.compare(otp, hashedOtp);
                    if (!validOtp) {
                        reject("Invalid code please check your inbox");
                    } else {
                        await userPhoneOtpSchema.deleteOne({ userId: new ObjectId(id) });
                        resolve("Phone number verified successfully.");
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
    updateUserDetails: ( { id,dob,name,email,aadhar,phone } ) => {
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