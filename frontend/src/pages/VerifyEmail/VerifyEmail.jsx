import React, { useEffect, useState } from 'react';
import { getItem } from '../../../localStorage/getItem';
import { setItem } from '../../../localStorage/setItem';
import Verfy from '../../components/Verify/Verfy';
import './style.css'
import { maskEmail } from '../../utils/maskEmail';
import { URL } from '../../utils/url';
import { USER } from '../../redux/constants/user';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const VerifyEmail = () => {
  const navigate = useNavigate('');
  const [msg, setMsg] = useState('');
  const [otps, setOtps] = useState({
    digitOne: "",
    digitTwo: "",
    digitThree: "",
    digitFour: "",
  });
  const [color, setColor] = useState('');
  const dispatch = useDispatch();

  //fetching loading state from global state
  const { loading } = useSelector(state => state.verify);
  const resendLoading = useSelector(state => state.resendOtp.loading);

  // Handle changes in input fields by updating the OTP (One-Time Password) state.
  const HandleChange = (e) => {

    // Update the OTP state using the spread operator to maintain previous values
    setOtps((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  //Taking data from localstorage useing getItem function
  const userData = getItem('user');

  /**
 * React useEffect hook to set a message containing a masked email for user verification.
 * This effect runs once after component mounting.
 */
  useEffect(() => {
    // Mask the user's email for privacy
    let maskedEmail = maskEmail(userData.email);
    let text = `We have sent a verification code to ${maskedEmail}`;
    setMsg(text);
  }, []);

  /**
 * Validates the entered OTP (One-Time Password).
 * Checks if the OTP is a four-digit number and updates the message and color accordingly.
 * Returns 'true' if validation fails, 'false' otherwise.
 */
  const HandleValidation = () => {
    const otpRegex = /^\d{4}$/; // Regular expression for a four-digit OTP
    const otp = otps.digitOne + otps.digitTwo + otps.digitThree + otps.digitFour; // Concatenate OTP digits
    if (!otpRegex.test(otp)) {
      setColor('red'); // Set the color to red for error
      setMsg("otp must be four digit,check your inbox"); // Update the error message
      return true; // Return 'true' to indicate validation failure
    }
  }

  // Handle the user's request to verify an OTP (One-Time Password) for email.
  const HandleVerify = (e) => {
    e.preventDefault();
    const isErr = HandleValidation();

    if (!isErr) {
      // Dispatch an action to indicate the OTP verification request is in progress
      dispatch({ type: USER.VERIFY_OTP_REQUEST });

      // Send a POST request to the server to verify the email OTP  
      axios.post(URL + '/verify-email-otp', {
        id: userData.id,
        otp: otps.digitOne + otps.digitTwo + otps.digitThree + otps.digitFour
      }).then(res => {

        //setting emailVerified to true and update in localstorage for further validation
        userData.emailVerified = true;
        setItem('user', userData);

        // Dispatch an action to indicate a successful OTP verification
        dispatch({ type: USER.VERIFY_OTP_SUCCESS });

        // Display a success message to the user
        toast.success(res.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });

        // Navigate the user to the '/send-phone' route upon successful verification
        navigate('/send-phone');
      }).catch(err => {

        // Dispatch an action to indicate a failed OTP verification
        dispatch({ type: USER.VERIFY_OTP_FAILED });

        // Set the color to red and display an error message
        setColor('red');
        setMsg(err.response.data.error);
      });
    }
  }

  // Handle the user's request to resend an OTP (One-Time Password) via email.
  const HandleResend = (e) => {
    e.preventDefault(e);

    // Dispatch an action to indicate the OTP resend request is in progress
    dispatch({ type: USER.RESEND_OTP_REQUEST });

    // Send a POST request to the server to resend the email OTP
    axios.post(URL + '/resend-email-otp', {
      id: userData.id,
      email: userData.email
    }).then(res => {

      // Dispatch an action to indicate a successful OTP resend
      dispatch({ type: USER.RESEND_OTP_SUCCESS, payload: res.data.message });

      // Set the color to green and update the message
      setColor('green');
      setMsg(res.data.message);
    }).catch(err => {

      // Dispatch an action to indicate a failed OTP resend
      dispatch({ type: USER.RESEND_OTP_FAILED, error: err.message });

      // Set the color to red and display an error message
      setColor('red');
      setMsg(err.response.data.message);
    });
  }


  return (
    loading || resendLoading ?
      <Loader />
      :
      <Verfy
        msg={msg}
        color={color}
        HandleResend={HandleResend}
        HandleChange={HandleChange}
        HandleVerify={HandleVerify}
      />
  )
}

export default VerifyEmail