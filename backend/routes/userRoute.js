const { Router } = require('express');
const router = Router();

//creating user route
router.post('/signup', signupValidator, (req, res) => {

    /*doSignup function in helpers take body of the request as
    parameter and save the user data in the data base*/

    /* checking if there is any validation error,
        -->sending error response
        -->else do signup 
    */
    const err = validationResult(req);
    if (!err.isEmpty()) {
        let errors = err.array()
        // let error = JSON.stringify(errors);
        res.status(401).json({ error: errors });
    } else {
        helpers.doSignup(req.body).then(resp => {
            const data = JSON.stringify(resp);
            res.status(200).json(data);
        }).catch(err => {
            res.status(401).json(err);
        });
    }

});

//send email otp
router.post('/send-email-otp', (req, res) => {
    /*
    sendOtpVerificationEmail function takes body of the req as
    parameter and generate otp then save the user id and hashed otp to database
    and returning appropriate messages
    */
    helpers.sendOtpVerificationEmail(req.body).then(resp => {
        res.status(200).json({ message: resp });
    }).catch(err => {
        res.status(401).json({ message: err })
    })
});

//verify email otp
router.post('/verify-email-otp', (req, res) => {
    /*
    takes body of the req as parameter then if the credentials matches response with
    appropriate message,if not matches do the same 
    */
    helpers.VerifyEmailOtp(req.body).then(resp => {
        res.status(200).json({ message: resp });
    }).catch(err => {
        res.status(401).json({ message: err })
    })
});

//sending phone otp
router.post('/send-phone-otp', (req, res) => {
    /*
     sendPhoneOtpVerification function takes body of the req as
     parameter and generate otp then save the user id and hashed otp to database
     and returning appropriate messages
    */
    helpers.sendPhoneOtpVerification(req.body).then(resp => {
        res.status(200).json({ message: resp });
    }).catch(err => {
        res.status(401).json({ message: err })
    })
});

//verifing phone otp

router.post('/verify-phone-otp', (req, res) => {
    /*
    takes body of the req as parameter then if the credentials matches response with
    appropriate message,if not matches do the same 
    */
    helpers.VerifyPhoneOtp(req.body).then(resp => {
        res.status(200).json({ message: resp });
    }).catch(err => {
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



module.exports = router;
