const userHelper = require("../helpers/userHelper");
const {
  resendPhoneOtp,
  resendEmailOtp,
} = require("../helpers/userHelper/resendOtp");
const signupValidator = require("../middlewares/signupValidator");
const phoneValidator = require("../middlewares/phoneValidator");
const loginValidator = require("../middlewares/loginValidator");
const emailValidator = require("../middlewares/emailValidator");
const { validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const commonHelper = require("../helpers/commonHelper");

dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

// Handle user signup POST request
router.post("/signup", signupValidator, (req, res) => {
  // Validate the request body usingsk_test_51Nxt3ASBmaUds8nEWZf1vpUh7fDEEFbTcRrMXKWkEKmCEOdGbPJuQIPaCeybGPe4QSrR2EAPtsSdTJbbLcsp1PJ600EGhizYGQ the signupValidator middleware
  const err = validationResult(req);

  // If there are validation errors in the request data
  if (!err.isEmpty()) {
    // Extract the validation errors and send a 401 (Unauthorized) response with the errors
    let errors = err.array();
    res.status(401).json({ error: errors });
  } else {
    // If there are no validation errors, proceed to user registration
    userHelper
      .doSignup(req.body)
      .then((resp) => {
        // Set the user session variable to store user data
        req.session.user = resp;

        // Convert the response data to JSON and send a 200 (OK) response
        const data = JSON.stringify(resp);
        res.status(200).json(data);
      })
      .catch((err) => {
        // Handle any registration errors and send a 401 (Unauthorized) response
        res.status(400).json(err);
      });
  }
});

// Handle POST request to send an email with an OTP for email verification
router.post("/send-email-otp", (req, res) => {
  // Validate the request body using the signupValidator middleware
  const err = validationResult(req);

  // If there are validation errors in the request data
  if (!err.isEmpty()) {
    // Extract the validation errors and send a 401 (Unauthorized) response with the errors
    let errors = err.array();
    res.status(401).json({ error: errors });
  } else {
    //If there are no validation errors, proceed to send the OTP verification email based on the request body
    userHelper
      .sendOtpVerificationEmail(req.body)
      .then((resp) => {
        // Respond with a 200 (OK) status and a success message
        res.status(200).json({ message: resp });
      })
      .catch((err) => {
        // Respond with a 401 (Unauthorized) status and an error message if there's an issue
        res.status(401).json({ message: err });
      });
  }
});

// Handle POST request to verify an email OTP
router.post("/verify-email-otp", (req, res) => {
  // Call a function to verify the email OTP based on the request body
  userHelper
    .VerifyEmailOtp(req.body)
    .then((resp) => {
      // Update the user's email in the session and respond with a success message
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      // Respond with a 401 (Unauthorized) status and an error message if verification fails
      res.status(401).json({ message: err });
    });
});

// Handle POST request to send an OTP to a phone number for verification
router.post("/send-phone-otp", (req, res) => {
  // Validate the request data using the phoneValidator middleware
  const err = validationResult(req);

  // If there are validation errors in the request data
  if (!err.isEmpty()) {
    // Extract the validation errors and send a 401 (Unauthorized) response with the errors
    let errors = err.array();
    res.status(401).json({ error: errors });
  } else {
    // If there are no validation errors, proceed to send the phone OTP
    userHelper
      .sendPhoneOtpVerification(req.body)
      .then((resp) => {
        // Update the user's phone in the session and respond with a 200 (OK) success message
        res.status(200).json({ message: resp });
      })
      .catch((err) => {
        // Respond with a 401 (Unauthorized) status and an error message if OTP sending fails
        res.status(401).json({ message: err });
      });
  }
});

// Handle POST request to verify a phone number OTP
router.post("/verify-phone-otp", (req, res) => {
  // Call a function to verify the phone number OTP based on the request body
  userHelper
    .VerifyPhoneOtp(req.body)
    .then((resp) => {
      // Update the user session with the response and respond with a success message
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      // Respond with a 401 (Unauthorized) status and an error message if verification fails
      res.status(401).json({ message: err });
    });
});

//resend otp

//resending email otp route
router.post("/resend-email-otp", (req, res) => {
  resendEmailOtp(req.body)
    .then((resp) => {
      res.json({ message: resp }).status(200);
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

//resending phone otp route
router.post("/resend-phone-otp", (req, res) => {
  resendPhoneOtp(req.body)
    .then((resp) => {
      res.json({ message: resp }).status(200);
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

// Handle POST request for user login
router.post("/login", loginValidator, (req, res) => {
  // Validate the request data using the loginValidator middleware
  let err = validationResult(req);

  // If there are validation errors in the request data
  if (!err.isEmpty()) {
    // Respond with a 400 (Bad Request) status and the validation error details
    res.status(401).json({ errors: err.array() });
  } else {
    // Attempt to perform user login using userHelper's doLogin function
    userHelper
      .doLogin(req.body)
      .then((data) => {
        // If login is successful, update the user session and respond with user data
        req.session.user = data;
        res.json(data).status(200);
      })
      .catch((err) => {
        // Respond with a 400 (Bad Request) status and an error message for incorrect email or password
        res.status(400).json({ error: err });
      });
  }
});

// Define a POST route for creating a checkout session
router.post("/create-checkout-session", async (req, res) => {
  // Extract 'proId' and 'userId' from the request body
  const { proId, userId } = req.body;

  // Fetch product details using 'commonHelper.getProduct'
  commonHelper
    .getProduct(proId)
    .then(async (product) => {
      console.log(product); // Log product details for debugging

      // Create a checkout session using Stripe
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: product.name,
                images: [product.images[0].url],
              },
              unit_amount: product.price * 1,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:5173/payment/success", // Set the success URL
        cancel_url: "http://localhost:5173/payment/failed", // Set the cancel URL
        payment_method_types: [
          // Specify payment method types (e.g., card)
          "card",
        ],
      });
      console.log(session.payment_intent);
      if (session.success_url) {
        // Perform additional actions (e.g., create booking details) if the success URL is available
        await userHelper.createBookingDetails(req.body);
      }

      // Respond with the generated checkout session URL
      res.status(200).json({ url: session.url });
    })
    .catch((err) => {
      console.log(err); // Log any errors that occur
    });
});

// Define a POST route for retrieving booked products
router.post("/get-booked-products", (req, res) => {
  // Call the 'getBookingDetails' function from 'userHelper' to retrieve booking details
  userHelper
    .getBookingDetails(req.body)
    .then((resp) => {
      res.status(200).json(resp); // Resolve and send the response
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

// Define a POST route for searching products
router.post("/search", (req, res) => {
  // Call the 'searchProducts' function from 'userHelper' to perform a product search
  userHelper.searchProducts(req.body).then((resp) => {
    // Send a JSON response with the search results
    res.status(200).json(resp);
  });
});

// Define a GET route for user logout
router.get("/logout", (req, res) => {
  // Destroy the user's session
  req.session.destroy();

  // Send a successful JSON response with a status code of 200
  res.status(200).json();
});

router.post("/cancel-request", (req, res) => {
  userHelper
    .sendCancelRequest(req.body)
    .then((resp) => {
      res.status(200).json({ message: resp });
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

// router.get("/payment/success", async (req, res) => {
//   const { payment_intent } = req.query; // Retrieve the Payment Intent ID from the query parameters

//   if (payment_intent) {
//     console.log("Payment Intent ID: " + payment_intent);
//     // Use payment_intent as needed
//   } else {
//     console.error("Payment Intent ID not found in query parameters.");
//     // Handle the error
//   }

//   // You can render a success page or redirect the user to an appropriate page here
// });

module.exports = router;
