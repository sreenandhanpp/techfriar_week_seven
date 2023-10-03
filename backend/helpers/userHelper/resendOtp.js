const userPhoneOtpSchema = require("../../MongoDb/models/userModels/phoneOtp");
const userMailOtpSchema = require("../../MongoDb/models/userModels/mailOtp");
const helpers = require("./index");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const resendEmailOtp = ({ id, email }) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userMailOtpSchema.deleteOne({ userId: new ObjectId(id) });
            const user = {
                id: id,
                email: email
            }
            helpers.sendOtpVerificationEmail(user).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        } catch (error) {
            reject("Something went wrong");
        }
    })
}

const resendPhoneOtp = ({ id, phone }) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userPhoneOtpSchema.deleteOne({ userId: new ObjectId(id) });
            const user = {
                id: id,
                phone: phone
            }
            helpers.sendPhoneOtpVerification(user).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        } catch (error) {
            reject("Something went wrong");
        }
    })
}

module.exports = {

    resendEmailOtp: resendEmailOtp,
    resendPhoneOtp: resendPhoneOtp
}