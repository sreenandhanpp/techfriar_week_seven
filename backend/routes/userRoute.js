const userHelper = require('../helpers/userHelper');
const { resendPhoneOtp, resendEmailOtp } = require('../helpers/userHelper/resendOtp');
const signupValidator = require('../middlewares/signupValidator');
const phoneValidator = require('../middlewares/phoneValidator');
const loginValidator = require('../middlewares/loginValidator');
const emailValidator = require('../middlewares/emailValidator');
const { validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();

// Handle user signup POST request
router.post('/signup', signupValidator, (req, res) => {
    // Validate the request body using the signupValidator middleware
    const err = validationResult(req);

    // If there are validation errors in the request data
    if (!err.isEmpty()) {
        // Extract the validation errors and send a 401 (Unauthorized) response with the errors
        let errors = err.array();
        res.status(401).json({ error: errors });
    } else {
        // If there are no validation errors, proceed to user registration
        userHelper.doSignup(req.body).then(resp => {
            // Set the user session variable to store user data
            req.session.user = resp;

            // Convert the response data to JSON and send a 200 (OK) response
            const data = JSON.stringify(resp);
            res.status(200).json(data);
        }).catch(err => {
            // Handle any registration errors and send a 401 (Unauthorized) response
            res.status(401).json(err);
        });
    }
});

// Handle POST request to send an email with an OTP for email verification
router.post('/send-email-otp', emailValidator, (req, res) => {
    // Validate the request body using the signupValidator middleware
    const err = validationResult(req);

    // If there are validation errors in the request data
    if (!err.isEmpty()) {
        // Extract the validation errors and send a 401 (Unauthorized) response with the errors
        let errors = err.array();
        res.status(401).json({ error: errors });
    } else {
        //If there are no validation errors, proceed to send the OTP verification email based on the request body
        userHelper.sendOtpVerificationEmail(req.body).then(resp => {
            // Respond with a 200 (OK) status and a success message
            res.status(200).json({ message: resp });
        }).catch(err => {
            // Respond with a 401 (Unauthorized) status and an error message if there's an issue
            res.status(401).json({ message: err })
        });
    }
});

// Handle POST request to verify an email OTP
router.post('/verify-email-otp', (req, res) => {
    // Call a function to verify the email OTP based on the request body
    userHelper.VerifyEmailOtp(req.body).then(resp => {
        // Update the user's email in the session and respond with a success message
        req.session.user.email = resp;
        res.status(200).json({ message: "Email verified successfully" });
    }).catch(err => {
        // Respond with a 401 (Unauthorized) status and an error message if verification fails
        res.status(401).json({ message: err })
    });
});

// Handle POST request to send an OTP to a phone number for verification
router.post('/send-phone-otp', phoneValidator, (req, res) => {
    // Validate the request data using the phoneValidator middleware
    const err = validationResult(req);

    // If there are validation errors in the request data
    if (!err.isEmpty()) {
        // Extract the validation errors and send a 401 (Unauthorized) response with the errors
        let errors = err.array();
        res.status(401).json({ error: errors });
    } else {
        // If there are no validation errors, proceed to send the phone OTP
        userHelper.sendPhoneOtpVerification(req.body).then(resp => {
            // Update the user's phone in the session and respond with a 200 (OK) success message
            req.session.user.phone = resp;
            res.status(200).json({ message: resp });
        }).catch(err => {
            // Respond with a 401 (Unauthorized) status and an error message if OTP sending fails
            res.status(401).json({ message: err })
        });
    }
});

// Handle POST request to verify a phone number OTP
router.post('/verify-phone-otp', (req, res) => {
    // Call a function to verify the phone number OTP based on the request body
    userHelper.VerifyPhoneOtp(req.body).then(resp => {
        // Update the user session with the response and respond with a success message
        req.session.user = resp;
        res.status(200).json({ message: "Phone number verified successfully" });
    }).catch(err => {
        // Respond with a 401 (Unauthorized) status and an error message if verification fails
        res.status(401).json({ message: err })
    })
});


//resend otp

//resending email otp route
router.post('/resend-email-otp', (req, res) => {
    resendEmailOtp(req.body).then(resp => {
        res.json({ message: resp }).status(200);
    }).catch(err => {
        res.status(400).json({ message: err });
    })
});

//resending phone otp route
router.post('/resend-phone-otp', (req, res) => {
    resendPhoneOtp(req.body).then(resp => {
        res.json({ message: resp }).status(200);
    }).catch(err => {
        res.status(400).json({ message: err });
    })
});

// Handle POST request for user login
router.post('/login', loginValidator, (req, res) => {
    // Validate the request data using the loginValidator middleware
    let err = validationResult(req);

    // If there are validation errors in the request data
    if (!err.isEmpty()) {
        // Respond with a 400 (Bad Request) status and the validation error details
        res.status(400).json({ errors: err.array() })
    } else {
        // Attempt to perform user login using userHelper's doLogin function
        userHelper.doLogin(req.body).then((data) => {
            // If login is successful, update the user session and respond with user data
            req.session.user = data;
            res.json(data).status(200);
        }).catch(err => {
            // Respond with a 400 (Bad Request) status and an error message for incorrect email or password
            res.status(400).json({ error: err });
        });
    }
});




module.exports = router;
