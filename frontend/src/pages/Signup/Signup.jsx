import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import InuptField from '../../components/InuptField/InuptField';
import { useNavigate } from "react-router-dom";
import { URL } from '../../utils/url';
import { USER } from '../../redux/constants/user';
import './style.css';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';


const Signup = () => {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    dob: '',
    phone: '',
    aadhar: ''
  });
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    dob: '',
    phone: '',
    aadhar: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.userData);


  const ErrorHandler = () => {

    // Regular expressions for various form field validations
    const nameRegex = /^[A-Za-z\s]+$/; // Allows letters and spaces only
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Basic email format validation
    const phoneRegex = /^\d{10}$/; // 10-digit phone number
    const aadharRegex = /^\d{12}$/; // 12-digit Aadhar number

    // Initialize an empty error object
    const error = {};

    // Validate Date of Birth
    if (!formValues.dob) {
      error.dob = 'Date of Birth requried';
    }

    // Update the errors state for Date of Birth
    setErrors((prev) => {
      return {
        ...prev, dob: error.dob
      }
    });

    // Validate Full Name
    if (!formValues.name) {
      error.name = 'Full Name is required';
    } else if (!nameRegex.test(formValues.name)) {
      error.name = 'Invalid name. Please use only letters and spaces.';
    }

    // Update the errors state for Full Name
    setErrors((prev) => {
      return {
        ...prev, name: error.name
      }
    });

    // Validate Email
    if (!formValues.email) {
      error.email = 'Email is required';
    } else if (!emailRegex.test(formValues.email)) {
      error.email = 'Invalid email address.';
    }

    // Update the errors state for Email
    setErrors((prev) => {
      return {
        ...prev, email: error.email
      }
    });

    // Validate Phone Number
    if (!formValues.phone) {
      error.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formValues.phone)) {
      error.phone = 'Invalid phone number. Please enter 10 digits.';
    }

    // Update the errors state for Phone Number
    setErrors((prev) => {
      return {
        ...prev, phone: error.phone
      }
    });

    // Validate Aadhar Number
    if (!formValues.aadhar) {
      error.aadhar = 'Aadhar number is required'
    } else if (!aadharRegex.test(formValues.aadhar)) {
      error.aadhar = 'Invalid Aadhar number. Please enter 12 digits.';
    }

    // Update the errors state for Aadhar Number
    setErrors((prev) => {
      return {
        ...prev, aadhar: error.aadhar
      }
    });

    // Return the error object with error messages
    return error;
  }

  // Takes an error array and searches for a specific error message based on the provided criteria.
  const HandleErrorStructure = (find, error) => {
    // Initialize an array to store matching error messages
    const value = error.map((value => {
      if (value.path == find) {
        return value.msg;// Return the error message if 'path' matches the criteria
      }
      // Return undefined if 'path' doesn't match to keep only matching values
    }));
    return value; // Return an array of matching error messages
  }
  /**
* Handle User Signup
* 
* This function is responsible for processing user signup requests. It is triggered when a user submits a signup form.
* 
* Steps:
* 1. Prevents the default form submission behavior to handle the request via AJAX.
* 2. Dispatches a signup request action to indicate that the signup process has started.
* 3. Sends a POST request to a specified URL (likely a server endpoint) with user data including name, email, date of birth (DOB), phone number, and Aadhar number.
* 4. Upon successful response (HTTP status 200), it parses the response data (presumably containing user information) and dispatches a signup success action.
* 5. It also navigates the user to a 'verify-email' page (for email verification) while replacing the current URL in the browser history.
* 6. If there's an error during the API request, it dispatches a signup failed action and logs the error to the console.
* 7. Any exceptions outside the try-catch block are also caught and logged.
* 
* The event object, typically a form submission event.
*/
  const HandleSignup = (e) => {
    e.preventDefault();
    const error = ErrorHandler();
    const isErr = Object.getOwnPropertyNames(error).length

    if (isErr == 0) {
      try {
        dispatch({ type: USER.SIGNUP_REQUEST });
        axios.post(URL + '/signup', {
          name: formValues.name,
          email: formValues.email,
          dob: formValues.dob,
          phone: formValues.phone,
          aadhar: formValues.aadhar
        }).then(res => {
          if (res.status == 200) {
            let data = JSON.parse(res.data);
            dispatch({ type: USER.SIGNUP_SUCCESS, payload: data });

            toast.success("Account Created", {
              position: toast.POSITION.BOTTOM_CENTER
            });
            navigate('/send-email', { replace: true })
          }
        }).catch(err => {

          const error = err.response.data.error;
          setErrors((prev) => {
            return {
              ...prev,
              phone: HandleErrorStructure('phone', error),
              aadhar: HandleErrorStructure('aadhar', error),
              email: HandleErrorStructure('email', error)
            }
          });
          dispatch({ type: USER.SIGNUP_FAILED, payload: err });
        })
      } catch (err) {
        dispatch({ type: USER.SIGNUP_FAILED, payload: err });
      }
    }
  }

  const resetError = (e) => {
    setErrors(prev => {
      return { ...prev, [e.target.name]: '' }
    });
  }

  // Handle changes in input fields by updating the OTP (One-Time Password) state.
  const HandleChange = (e) => {
    resetError(e);

    // Update the form field state using the spread operator to maintain previous values
    setFormValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    });
  }

  return (
    loading ?
      <Loader />
      :
      <div className='form-wrapper'>
        <section className="container">
          <header>Registration Form</header>
          <form className="form">
            <InuptField
              placeholder={"Enter your name"}
              type={"text"} label={"Full Name"}
              HandleChange={HandleChange}
              msg={errors.name}
              name={"name"}
            />
            <div className="column">
              <InuptField
                placeholder={"Enter your phone"}
                type={"text"} label={"Phone Number"}
                HandleChange={HandleChange}
                msg={errors.phone}
                name={"phone"}
              />
              <InuptField
                placeholder={"Enter birth data"}
                type={"date"} label={"Date of Birth"}
                HandleChange={HandleChange}
                msg={errors.dob}
                name={"dob"}
              />
            </div>
            <InuptField
              placeholder={"Enter your email"}
              type={"text"} label={"Email"}
              HandleChange={HandleChange}
              msg={errors.email}
              name={"email"}
            />
            <InuptField
              placeholder={"Enter Aadhar number"}
              type={"text"} label={"Aadhar number"}
              HandleChange={HandleChange}
              msg={errors.aadhar}
              name={"aadhar"}
            />
            <button onClick={e => HandleSignup(e)}>Submit</button>
          </form>
        </section>
      </div>
  )
}

export default Signup