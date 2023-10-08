import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { URL } from '../../utils/url';
import { USER } from '../../redux/constants/user';
import './style.css';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import Alert from '../../components/Alert/Alert';


const Signup = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    state: '',
    phone: '',
    city: '',
    country: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });
  const [err, setErr] = useState([]);
  const navigate = useNavigate();


  // Get access to the 'dispatch' function from Redux
  const dispatch = useDispatch();

  // Extract the 'loading' property from the 'userData' slice of Redux state
  const { loading } = useSelector(state => state.userData);


  // Define a function to handle user signup form submission
  const HandleSignup = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Try to initiate the signup process
    try {
      // Dispatch an action to indicate the start of the signup request
      dispatch({ type: USER.SIGNUP_REQUEST });

      // Make an HTTP POST request to the signup API with form data
      axios.post(URL + '/user/api/signup', {
        name: formValues.name,
        email: formValues.email,
        city: formValues.city,
        phone: formValues.phone,
        state: formValues.state,
        country: formValues.country,
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
        pincode: formValues.pincode
      }).then(res => {
        console.log(res);

        // If signup is successful, dispatch a success action with user data
        if (res.status === 200) {
          const data = JSON.parse(res.data);
          dispatch({ type: USER.SIGNUP_SUCCESS, payload: data });

          // Navigate to the '/verify-email' route
          navigate('/verify-email');

          // Display a success message using a toast notification
          toast.success("Account Created", {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      }).catch(err => {
        if (err) {
          // Set an error message if there's an error response
          setErr(err.response.data.error);
        }

        // Dispatch a failure action with the error payload
        dispatch({ type: USER.SIGNUP_FAILED, payload: err });
      })
    } catch (err) {
      // Dispatch a failure action if an error occurs during the signup process
      dispatch({ type: USER.SIGNUP_FAILED, payload: err });
    }
  }


  // Handle changes in input fields by updating the OTP (One-Time Password) state.
  const HandleChange = (e) => {
    // Update the form field state using the spread operator to maintain previous values
    setFormValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    });
  }

  return (
    loading ?
      <Loader />
      :
      <>
        <div className="form-container">
          <div id="FormContainer">
            <div className="ImgContainer">
            </div>
            <form id="Form">
              <h1 id="FormHeading">Sign Up</h1>
              <div className="Name">
                <li><label>Full Name:</label>
                  <input type="text" name='name' onChange={HandleChange} placeholder="Enter your Fullname" />
                  <Alert label={'name'} errors={err} />
                </li>
                <li><label>Phone No:</label>
                  <input type="text" name='phone' onChange={HandleChange} placeholder="Enter your phone" />
                  <Alert label={'phone'} errors={err} />
                </li>
              </div>
              <li>
                <label>Email:</label>
                <input type="email" name='email' onChange={HandleChange} placeholder="Enter your email" />
                <Alert label={'email'} errors={err} />
              </li>
              <div className="Name">
                <li><label>City:</label>
                  <input type="text" name='city' onChange={HandleChange} placeholder="Enter your city" />
                  <Alert label={'city'} errors={err} />
                </li>
                <li><label>State:</label>
                  <input type="text" name='state' onChange={HandleChange} placeholder="Entr your state" />
                  <Alert label={'state'} errors={err} />
                </li>
              </div>
              <div className="Name">
                <li>
                  <label>Country:</label>
                  <select name='country' onChange={HandleChange}>
                    <option>Afghanistan</option>
                    <option>India</option>
                    <option>Albania</option>
                    <option>Algeria</option>
                    <option>Andorra</option>
                    <option>Angola</option>
                    <option>Argentina</option>
                    <option>Armenia</option>
                    <option>Australia</option>
                    <option>Austria</option>
                    <option>Azerbaijan</option>
                    <option>Croatia</option>
                  </select >
                  <Alert label={'country'} errors={err} />
                </li>
                <li>
                  <label>Pincode No:</label>
                  <input type="text" name='pincode' onChange={HandleChange} placeholder="Enter your pincode" />
                  <Alert label={'pincode'} errors={err} />
                </li>
              </div>
              <div className="password">
                <li><label>Password:</label>
                  <input type="password" name='password' onChange={HandleChange} />
                  <Alert label={'password'} errors={err} />
                </li>
                <li>
                  <label>Confirm Password:</label>
                  <input type="password" name='confirmPassword' onChange={HandleChange} />
                  <Alert label={'confirmPassword'} errors={err} />
                </li>
              </div>
              <button onClick={e => HandleSignup(e)} >Sign Up</button>
            </form>
          </div>
        </div>
      </>
  )
}

export default Signup

